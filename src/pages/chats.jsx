import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaPlus, FaRegSmile } from "react-icons/fa";
import img from "../assets/anonymous.png";
import img1 from "../assets/security.png";
import { collection, getDocs, addDoc, updateDoc, doc, onSnapshot, Timestamp } from "firebase/firestore";
import { firestore, auth } from "../../firebase";

export default function Chat() {
    const RandomUsername = (baseName) => `${baseName}${Math.floor(Math.random() * 1000)}`;
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [reactionPopup, setReactionPopup] = useState(null);
    const [position, setPosition] = useState(0);
    const [username, setUsername] = useState(RandomUsername("anonymous"));
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

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

    const sendMessage = async () => {
        if (newMessage.trim() === "") return;

        const newMsg = {
            text: newMessage,
            sender: auth.currentUser.uid,
            username,
            avatar: img1,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            timestamp: Timestamp.now(),
            replyTo: replyTo ? { text: replyTo.text, username: replyTo.username } : null,
            reactions: {} // Empty reactions initially
        };

        try {
            await addDoc(collection(firestore, "messages"), newMsg);
            setNewMessage("");
            setReplyTo(null);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const addReaction = async (msgId, reaction) => {
        const messageRef = doc(firestore, "messages", msgId);
        const userId = auth.currentUser.uid;

        setMessages((prevMessages) =>
            prevMessages.map((msg) => {
                if (msg.id === msgId) {
                    const updatedReactions = { ...msg.reactions };

                    if (updatedReactions[userId] === reaction) {
                        // If the user clicks the same reaction, remove it (unreact)
                        delete updatedReactions[userId];
                    } else {
                        // Otherwise, add or change reaction
                        updatedReactions[userId] = reaction;
                    }

                    return { ...msg, reactions: updatedReactions };
                }
                return msg;
            })
        );

        setReactionPopup(null);

        try {
            const docSnapshot = await getDocs(collection(firestore, "messages"));
            const docToUpdate = docSnapshot.docs.find((doc) => doc.id === msgId);

            if (docToUpdate) {
                if (docToUpdate.data().reactions?.[userId] === reaction) {
                    await updateDoc(messageRef, { [`reactions.${userId}`]: "" });
                } else {
                    await updateDoc(messageRef, { [`reactions.${userId}`]: reaction });
                }
            }
        } catch (error) {
            console.error("Error updating reaction:", error);
        }

        
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    
    useEffect(() => {
        if (textareaRef.current) {
        textareaRef.current.style.height = "48px"; 
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);

    return (
        <div className="min-h-screen bg-[#0d1a2b] flex flex-col justify-between">
            {/* HEADER */}
            <div className="fixed top-0 left-0 right-0 w-full flex items-center p-4 bg-[#1a2b3c] text-white z-10">
                <img src={img} alt="Avatar" className="w-10 h-10 rounded-full" />
                <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-300">Anonymous</p>
                </div>
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-16 pt-20 mt-5 mb-5">
                {messages.map((msg) => {
                    const userReaction = msg.reactions?.[auth.currentUser.uid] || "";

                    return (
                      <motion.div
                          key={msg.id}
                          className={`flex items-start ${msg.sender === auth.currentUser.uid ? "justify-end" : "justify-start"}`}
                          drag="x"
                          dragConstraints={{ left: -5, right: 0 }} // Limits how far it can be swiped
                          dragElastic={0.2} // Makes swipe feel natural
                          dragTransition={{ bounceStiffness: 50, bounceDamping: 10 }} // Controls bounce effect
                          initial={{ x: 0 }}
                          animate={{ x: position }} // Ensures it returns to original position
                          onDragEnd={(event, info) => {
                              if (info.offset.x > 30) { // If swiped slightly right
                                  setReplyTo(msg);
                              }
                              setPosition(0);
                          }}
                          whileTap={{ scale: 0.98}}
                          transition={{ type: "spring", stiffness: 150, damping: 10 }}
                      >

                            {msg.sender !== auth.currentUser.uid && (
                                <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
                            )}
                            <div className="relative">
                                <p className="text-gray-300 text-xs">{msg.username}</p>
                                <div className={`max-w-xs ${msg.text.length > 100 ? 'rounded-md' : 'rounded-full'} px-4 py-2 flex flex-col justify-between ${msg.sender === auth.currentUser.uid ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"} rounded-md`}>
                                    {msg.replyTo && (
                                        <div className="text-xs text-gray-400 italic mb-1">
                                            Replying to {msg.replyTo.username}: "{msg.replyTo.text}"
                                        </div>
                                    )}
                                    <p className="text-[12px] md:text-[18px] leading-tight">{msg.text}</p>
                                    {msg.time && <p className="text-[8px] text-gray-200 self-end">{msg.time}</p>}
                                </div>

                                {/* Reaction Button */}
                                <button
                                    onClick={() => setReactionPopup(msg.id)}
                                    className="absolute bottom-[-16px] right-0 text-gray-300 text-sm"
                                >
                                    {userReaction ? (
                                        <span className="text-xl">{userReaction}</span> // Show selected reaction
                                    ) : (
                                        <FaRegSmile className="text-gray-400 text-xl" /> // Default gray smiley
                                    )}
                                </button>

                                {/* Reaction Picker */}
                                {reactionPopup === msg.id && (
                                    <div className="absolute top-[-40px] right-0 bg-gray-800 text-white p-1 rounded-md flex space-x-1">
                                        {["❤️", "😂", "👍", "😢", "😡"].map((emoji) => (
                                            <button key={emoji} onClick={() => addReaction(msg.id, emoji)}>
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* MESSAGE INPUT */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0d1a2b] flex flex-col items-center w-full">
            {replyTo && (
                <div className="w-full flex items-center bg-gray-800 text-white p-2 rounded-md mb-2">
                    {/* Replying to Message Preview */}
                    <div className="flex-1 p-3 bg-gray-900 rounded-t-md border-l-8 border-blue-500">
                        <p className="text-xs text-gray-400">Replying to {replyTo.username}</p>
                        <p className="text-sm italic text-gray-300 truncate">{replyTo.text}</p>
                    </div>
                    
                    {/* Cancel Button */}
                    <button 
                        onClick={() => setReplyTo(null)}
                        className="ml-3 text-gray-400 hover:text-red-400"
                    >
                        ✖
                    </button>
                </div>
            )}

                <div className="flex items-center w-full">
                    <FaPlus className="text-white mx-2" />
                    <div className="w-full min-h-[48px] max-h-[70px] flex items-center border border-gray-500 rounded-3xl bg-[#0d1a2b] overflow-hidden">
                        <textarea
                            ref={textareaRef}
                            className="w-full px-4 py-3 bg-transparent text-white outline-none placeholder-gray-400 resize-none overflow-y-auto leading-normal"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={1}
                        />
                    </div>

                    <motion.button
                    onClick={sendMessage}
                    className="ml-2 text-white"
                    whileTap={{ scale: 0.8 }} // Shrinks slightly when clicked
                    transition={{ type: "spring", stiffness: 300, damping: 10 }} // Smooth bounce effect
                    >
                    <FaPaperPlane className="text-xl" />
                    </motion.button>
                </div>
                
            </div>
        </div>
    );
}























how can i implement having a three dots icon and this page will only show for admins so admin can toggle when users can drop a message or not . and the admin will just be two people only whenever the user login with those two emails, firebase should notice that the account is an admin account  import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaPlus, FaRegSmile } from "react-icons/fa";
import img from "../assets/anonymous.png";
import img1 from "../assets/security.png";
import { collection, getDocs, addDoc, updateDoc, doc, onSnapshot, Timestamp } from "firebase/firestore";
import { firestore, auth } from "../../firebase";
import { IoMdTime } from "react-icons/io";
import { TiTickOutline } from "react-icons/ti";
export default function Chat() {
    const RandomUsername = (baseName) => ${baseName}${Math.floor(Math.random() * 1000)};
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [reactionPopup, setReactionPopup] = useState(null);
    const [position, setPosition] = useState(0);
    const [username, setUsername] = useState(RandomUsername("anonymous"));
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const [isAllowed, setIsAllowed] = useState(false);
// after testing we should uncomment this function

    // useEffect(() => {
    //     const checkTime = () => {
    //       const now = new Date();
    //       const day = now.getDay();
    //       const hour = now.getHours();
    
    //       if (day === 5 && hour >= 19 && hour < 22) {
    //         setIsAllowed(true);
    //       } else {
    //         setIsAllowed(false);
    //       }
    //     };
    
    //     checkTime();
    //     const interval = setInterval(checkTime, 60000);
    //     return () => clearInterval(interval);
    //   }, []);



useEffect(() => {
    const messagesRef = collection(firestore, "messages");
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        fetchedMessages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());

        console.log("Fetched Messages from Firestore:", fetchedMessages); // Debugging

        // Update local state with the latest reactions
        setMessages(fetchedMessages.map((msg) => ({
            ...msg,
            reactions: msg.reactions || {}, // Ensure reactions is always an object
        })));
    });

    return () => unsubscribe();
}, []);
    

const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
        text: newMessage,
        sender: auth.currentUser.uid,
        username,
        avatar: img1,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: Timestamp.now(),
        replyTo: replyTo ? { text: replyTo.text, username: replyTo.username } : null,
        reactions: {}, // Empty reactions initially
        status: "sending", // Initial status
    };

    let docRef; // Declare docRef outside the try block

    try {
        // Add the message to Firestore
        docRef = await addDoc(collection(firestore, "messages"), newMsg);

        // Update the message status to "sent" after successful send
        await updateDoc(doc(firestore, "messages", docRef.id), {
            status: "sent",
        });

        setNewMessage("");
        setReplyTo(null);
    } catch (error) {
        console.error("Error sending message:", error);

        // Update the message status to "failed" if sending fails
        if (docRef) { // Check if docRef is defined
            await updateDoc(doc(firestore, "messages", docRef.id), {
                status: "failed",
            });
        }
    }
};

const addReaction = async (msgId, reaction) => {
    const messageRef = doc(firestore, "messages", msgId);
    const userId = auth.currentUser.uid;

    console.log("Adding Reaction:", { msgId, reaction, userId }); // Debugging

    // Step 1: Update local state
    setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
            if (msg.id === msgId) {
                // Create a copy of the existing reactions or initialize as an empty object
                const updatedReactions = { ...(msg.reactions || {}) };

                // Remove the user's previous reaction (if any)
                for (const key in updatedReactions) {
                    updatedReactions[key] = updatedReactions[key].filter(id => id !== userId);
                    if (updatedReactions[key].length === 0) {
                        delete updatedReactions[key]; // Remove the reaction if no users are left
                    }
                }

                // Add the new reaction (if it's not the same as the previous one)
                if (reaction) {
                    if (!updatedReactions[reaction]) {
                        updatedReactions[reaction] = []; // Initialize the array if it doesn't exist
                    }
                    updatedReactions[reaction].push(userId); // Add the user to the reaction
                }

                console.log("Updated Reactions for Message:", msgId, updatedReactions); // Debugging

                // Return the updated message with the new reactions
                return { ...msg, reactions: updatedReactions };
            }
            return msg; // Return unchanged messages
        });

        // Step 2: Update Firestore with the latest reactions
        const updatedMessage = updatedMessages.find((msg) => msg.id === msgId);
        if (updatedMessage) {
            console.log("Updating Firestore with Reactions:", updatedMessage.reactions); // Debugging

            // Update Firestore with the updated reactions
            updateDoc(messageRef, { reactions: updatedMessage.reactions || {} })
                .then(() => console.log("Firestore updated successfully!"))
                .catch((error) => console.error("Error updating Firestore:", error));
        }

        return updatedMessages; // Return the updated messages array
    });

    // Close the reaction popup
    setReactionPopup(null);
};
    


// Track the previous length of the messages array
const prevMessagesLengthRef = useRef(messages.length);

// Scroll to bottom only when a new message is added
useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
        // New message added, scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // Update the previous length
    prevMessagesLengthRef.current = messages.length;
}, [messages]);
    
    useEffect(() => {
        if (textareaRef.current) {
        textareaRef.current.style.height = "48px"; 
        textareaRef.current.style.height = ${textareaRef.current.scrollHeight}px;
        }
    }, [newMessage]);

    return (
        <div className="min-h-screen bg-[#0d1a2b] flex flex-col justify-between">
            {/* HEADER */}
            <div className="fixed top-0 left-0 right-0 w-full flex items-center p-4 bg-[#1a2b3c] text-white z-10">
                <img src={img} alt="Avatar" className="w-10 h-10 rounded-full" />
                <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-300">Anonymous</p>
                </div>
            </div>
            {/* // after testing we should uncomment this modal */}
            {/* <>
  {!isAllowed && (
    <div className="fixed pointer-events-none left-0 right-0 top-0 bottom-0 overflow-y-auto flex justify-center items-center bg-opacity-50 z-20">
      <div className="bg-[#1a2b3c] text-white p-6 rounded-lg border border-gray-500 shadow-lg w-80 text-center">
        <h3 className="text-lg font-bold mb-2">Message Restriction</h3>
        <p className="text-sm text-gray-300">
          You can only send messages on <span className="font-bold text-red-400">Friday</span> between
          <span className="font-bold text-red-400"> 7 PM - 10 PM</span>.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold"
          onClick={() => setIsAllowed(true)}
        >
          Close
        </button>
      </div>
    </div>
  )}
</> */}

{/* CHAT MESSAGES */}
<div className="flex-1 overflow-y-auto p-4 space-y-8 pb-16 pt-20 mt-5 mb-5 max-h-[calc(100vh-150px)]">
  {messages.map((msg) => {
    const userReaction = msg.reactions?.[auth.currentUser.uid] || "";

    return (
      <motion.div
        key={msg.id}
        className={flex items-start ${
          msg.sender === auth.currentUser.uid ? "justify-end" : "justify-start"
        }}
        drag="x"
        dragConstraints={{ left: -5, right: 0 }}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 50, bounceDamping: 10 }}
        initial={{ x: 0 }}
        animate={{ x: position }}
        onDragEnd={(event, info) => {
          if (info.offset.x > 30) {
            setReplyTo(msg);
          }
          setPosition(0);
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
      >
        {/* Avatar for Sender */}
        {msg.sender !== auth.currentUser.uid && (
          <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
        )}

        {/* Message Bubble */}
        <div className="relative group">
          {msg.sender !== auth.currentUser.uid && (
            <p className="text-gray-300 text-xs">{msg.username}</p>
          )}
          <div
            className={
              min-w-[100px] 
              max-w-[75%] 
              ${msg.text.length > 100 ? 'rounded-md' : 'rounded-full'}
              px-4 py-2 flex flex-col justify-between 
              ${msg.sender === auth.currentUser.uid ? "ml-auto mr-2 bg-blue-500 text-white" : "bg-gray-700 text-gray-200"} 
              rounded-md overflow-hidden
            }
          >
            {/* Reply Info */}
            {msg.replyTo && (
              <div className="mb-1 flex flex-col">
                <p className="text-xs text-gray-400 italic">{msg.replyTo.username}:</p>
                <p className="text-xs text-gray-400 italic truncate max-w-[15ch]">
                  {msg.replyTo.text}
                </p>
              </div>
            )}

            {/* Message Text */}
            <p className="text-[12px] md:text-[18px] leading-tight whitespace-pre-wrap break-words">
              {msg.text}
            </p>

            {/* Timestamp and Status */}
            <div className="flex items-center justify-end text-end relative left-[10px]">
              {/* Time */}
              {msg.time && <p className="text-[8px] text-gray-200">{msg.time}</p>}

              {/* Status Icons */}
              {msg.sender === auth.currentUser.uid && (
                <div className="flex items-center just text-[8px] text-gray-200">
                  {msg.status === "sending" && (
                    <span className="animate-spin">
                      <IoMdTime />
                    </span>
                  )}
                  {msg.status === "sent" && (
                    <span>
                      <TiTickOutline size="13" className="text-green-400" />
                    </span>
                  )}
                  {msg.status === "failed" && (
                    <span className="text-red-500">❌</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reactions Container */}
          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
            <div
              className={absolute ${
                msg.sender === auth.currentUser.uid ? "right-0" : "left-0"
              } bottom-[-18px] flex space-x-[-4px] text-white text-xs}
            >
              {/* Display all emojis without individual counts */}
              {Object.keys(msg.reactions).map((emoji) => (
                <span key={emoji}>{emoji}</span>
              ))}
              {/* Display the total reactions count */}
              <span className="pl-4 text-gray-400">
                {Object.values(msg.reactions).reduce(
                  (total, userIds) => total + userIds.length,
                  0
                )}
              </span>
            </div>
          )}

          {/* Reaction Button */}
          <button
            onClick={() => setReactionPopup(msg.id)}
            className={mt-1 text-gray-300 text-sm flex items-center relative ${
              msg.sender === auth.currentUser.uid ? "ml-auto" : "mr-auto"
            }}
          >
            {userReaction ? (
              <span className="text-xl">{userReaction}</span>
            ) : (
              <FaRegSmile className="text-gray-400 text-xl" />
            )}
          </button>

          {/* Reaction Picker */}
          {reactionPopup === msg.id && (
            <div className="absolute top-[-40px] bg-gray-800 text-white p-1 rounded-md flex space-x-1">
              {["❤️", "😂", "👍", "😢", "😡"].map((emoji) => (
                <button key={emoji} onClick={() => addReaction(msg.id, emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  })}

  <div ref={messagesEndRef} />
</div>


            {/* MESSAGE INPUT */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0d1a2b] flex flex-col items-center w-full">
            {replyTo && (
                <div className="w-full flex items-center bg-gray-800 text-white p-2 rounded-t-md mb-2">
                    {/* Replying to Message Preview */}
                    <div className="flex-1 p-3 bg-gray-900 rounded-t-md border-l-8 border-blue-500">
                        <p className="text-xs text-gray-400">Replying to {replyTo.username}</p>
                        <p className="text-sm italic text-gray-300 truncate max-w-[15ch]">{replyTo.text}</p>
                    </div>
                    
                    {/* Cancel Button */}
                    <button 
                        onClick={() => setReplyTo(null)}
                        className="ml-3 text-gray-400 hover:text-red-400 border border-gray-600 rounded-full p-1"
                    >
                        ✖
                    </button>
                </div>
            )}

                <div className="flex items-center w-full">
                    <FaPlus className="text-white mx-2" />
                    <div className="w-full min-h-[45px] max-h-[70px] flex items-center border border-gray-500 rounded-3xl bg-[#0d1a2b] overflow-hidden">
                        <textarea
                            ref={textareaRef}
                            className="w-full px-4 py-3 bg-transparent text-white outline-none placeholder-gray-400 resize-none overflow-y-auto leading-normal whitespace-pre-wrap"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={1}
                            style={{ maxHeight: "70px" }} 
                            disabled={!isAllowed}
                        />
                    </div>

                    <motion.button
                      disabled={!isAllowed}
                    onClick={sendMessage}
                    className="ml-2 text-white"
                    whileTap={{ scale: 0.8 }} // Shrinks slightly when clicked
                    transition={{ type: "spring", stiffness: 300, damping: 10 }} // Smooth bounce effect
                    >
                    <FaPaperPlane className="text-xl" />
                    </motion.button>
                </div>
                
            </div>
        </div>
    );
}  import {  FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { useState } from "react";
import { auth, firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import GoogleIcon from "../assets/google logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  const [error, SetError] = useState(null)
  const [btnloading, setbtnloading] = useState()
  const navigate = useNavigate();
  const handleLogin = async (e) => {
e.preventDefault()
try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userId = user.uid;

    const UserDoc = await getDoc(doc(firestore, "users", userId));
    if (UserDoc.exists()) {
      setbtnloading(true);
      setTimeout(() => {
        setbtnloading(false);
        navigate("/chat");
      }, 9000);
    } else {
      SetError("You are not authorized as a User.");
      setTimeout(() => SetError(""), 5000);
    }
  } catch (err) {
    setbtnloading(true);
    setTimeout(() => {
      setbtnloading(false);
      
      SetError(err, "Invalid email or password.");
      setTimeout(() => SetError(""), 5000);
    }, 2000);
  }

  }

  const GoggleRegister = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const userId = user.uid;
    
       
        const userDocRef = doc(firestore, "users", userId); 
        const userDoc = await getDoc(userDocRef); 
    
        if (!userDoc.exists()) {
  
          await setDoc(userDocRef, {
            email: user.email,
            userId,
          });
          console.log("User  data saved to Firestore");
        } else {
          console.log("User  already exists in Firestore");
        }
    
        
        navigate('/chat');
      } catch (error) {
        SetError("An error occurred during sign-in. Please try again.", error);
        console.error("Error signing in:", error);
      }
    };
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md  p-6 rounded-lg shadow-lg">
        
        <h1 className="text-3xl font-bold text-center text-[#00CCFF]">Anon Truth</h1>

        <p className="text-gray-400 text-sm text-center mt-2">
          Only login via email, Google, is supported 
        </p>
  {error && (
    <div className=" text-center text-red-400">
       {error.message}
        </div>
  )}
      <form onSubmit={handleLogin}>
      <div className="mt-4">
          <label className="block text-sm font-medium"> Email</label>
          <div className="flex items-center border border-gray-600 rounded-md px-3 mt-1">
            <MdEmail className="text-gray-400" />
            <input
              type="text"
              placeholder="Email address"
              className="w-full bg-transparent p-2 outline-none text-white"
              onChange={(e) => SetEmail(e.target.value)}
              value={email}
              required
            />
          </div>
        </div>

       
        <div className="mt-4">
          <label className="block text-sm font-medium">Password</label>
          <div className="flex items-center border border-gray-600 rounded-md px-3 mt-1">
            <MdLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent p-2 outline-none text-white pointer"
              onChange={(e) => SetPassword(e.target.value)}
              value={password}
              required
            />
            <button className="pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash className="text-gray-400 pointer" /> : <FaRegEye className="text-gray-400 pointer" />}
            </button>
          </div>
        </div>

     
        <div className="mt-4 flex items-center gap-2">
          <input required type="checkbox" className="w-4 h-4 text-[#00CCFF]" />
          <p className="text-sm text-gray-400">
            I confirm that I have read, consent and agree to Anon truth{" "}
            <a href="/terms-of-use" className="text-[#00CCFF] underline hover:text-[#3e92e6] transition-colors duration-300 cursor-pointer">Terms of Use</a> and{" "}
            <a href="/privacy-policy" className="text-[#00CCFF] underline hover:text-[#3e92e6] transition-colors duration-300 cursor-pointer">Privacy Policy</a>.
          </p>
        </div>

       
        <button type="submit" className={w-full bg-[#00CCFF] hover:bg-[#3e92e6] transition-all duration-500 text-white py-2 rounded-md mt-4 font-semibold
        }>
        {btnloading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                role="status"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Log in"
            )}
         
        </button>

      </form>
   
     
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <a href="#" className="hover:underline">Forgot password?</a>
          <a href="/register" className="hover:underline" >Sign up</a>
        </div>
 <div onClick={GoggleRegister} className="flex items-center gap-3 mt-6 border border-gray-500 rounded-full justify-center p-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition duration-800 hover:text-black">
          <img src={GoogleIcon} alt="" className="w-5 h-5 rounded-full" />
          <p>Sign in
           with Google</p>
        </div>
        
   
      </div>
    </div>
  );
}