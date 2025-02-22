import { useState, useEffect } from "react";
import { collection, onSnapshot, Timestamp, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { firestore, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [reactionPopup, setReactionPopup] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMessagingEnabled, setIsMessagingEnabled] = useState(true);

  // Fetch messages
  useEffect(() => {
    const messagesRef = collection(firestore, "messages");
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetchedMessages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user role
  const fetchUserRole = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setIsAdmin(userDoc.data().role === "admin");
      }
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRole();
      } else {
        setIsAdmin(false);
        setIsMessagingEnabled(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen for messaging state changes
  useEffect(() => {
    const messagingDocRef = doc(firestore, "settings", "messaging");
    const unsubscribeMessaging = onSnapshot(messagingDocRef, (doc) => {
      if (doc.exists()) {
        setIsMessagingEnabled(doc.data().isMessagingEnabled);
      }
    });

    return () => unsubscribeMessaging();
  }, []);

  // Toggle messaging state
  const toggleMessaging = async () => {
    if (isAdmin) {
      try {
        const messagingDocRef = doc(firestore, "settings", "messaging");
        const newState = !isMessagingEnabled;
        await updateDoc(messagingDocRef, { isMessagingEnabled: newState });
        // alert(`Messaging ${newState ? "Enabled" : "Disabled"}`);
      } catch (error) {
        console.error("Error updating messaging state:", error);
        alert("Failed to update messaging state. Please try again.");
      }
    } else {
      alert("You are not an admin");
    }
  };

  // Send message
  const sendMessage = async () => {
    if (isMessagingDisabled) {
      alert("Messaging is currently disabled.");
      return;
    }

    if (newMessage.trim() === "" || !auth.currentUser) return;

    const newMsg = {
      text: newMessage,
      sender: auth.currentUser.uid,
      username: `anonymous${Math.floor(Math.random() * 1000)}`,
      avatar: "../assets/security.png",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: Timestamp.now(),
      replyTo: replyTo ? { text: replyTo.text, username: replyTo.username } : null,
      reactions: {},
      status: "sending",
    };
let docRef
    try {
       docRef = await addDoc(collection(firestore, "messages"), newMsg);
      await updateDoc(doc(firestore, "messages", docRef.id), { status: "sent" });
      setNewMessage("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
      await updateDoc(doc(firestore, "messages", docRef.id), { status: "failed" });
    }
  };

  // Add reaction
  const addReaction = async (msgId, reaction) => {
    const messageRef = doc(firestore, "messages", msgId);
    const userId = auth.currentUser.uid;

    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) => {
        if (msg.id === msgId) {
          const updatedReactions = { ...(msg.reactions || {}) };
          for (const key in updatedReactions) {
            updatedReactions[key] = updatedReactions[key].filter((id) => id !== userId);
            if (updatedReactions[key].length === 0) delete updatedReactions[key];
          }
          if (reaction) {
            if (!updatedReactions[reaction]) updatedReactions[reaction] = [];
            updatedReactions[reaction].push(userId);
          }
          return { ...msg, reactions: updatedReactions };
        }
        return msg;
      });

      const updatedMessage = updatedMessages.find((msg) => msg.id === msgId);
      if (updatedMessage) {
        updateDoc(messageRef, { reactions: updatedMessage.reactions || {} });
      }

      return updatedMessages;
    });

    setReactionPopup(null);
  };

  const isMessagingDisabled = !isAdmin && !isMessagingEnabled;

  return (
    <div className="min-h-screen bg-[#0d1a2b] flex flex-col justify-between">
      <ChatHeader isAdmin={isAdmin} toggleMessaging={toggleMessaging} isMessagingEnabled={isMessagingEnabled} />
      <MessageList
        messages={messages}
        auth={auth}
        setReactionPopup={setReactionPopup}
        reactionPopup={reactionPopup}
        addReaction={addReaction}
        setReplyTo={setReplyTo}
      />
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        isMessagingDisabled={isMessagingDisabled}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
      />
    </div>
  );
}