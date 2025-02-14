import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaPlus } from "react-icons/fa";
import img from '../assets/anonymous.png';
import img1 from '../assets/security.png';
import { collection, getDocs, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { firestore, auth } from '../../firebase'; 


export default function Chat() {
    const RandomUsername = (baseName) => {
        const randomNumber = Math.floor(Math.random() * 1000); 
        return `${baseName}${randomNumber}`;
      };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [username, setUsername] = useState(RandomUsername("anonymous")); 
  const messagesEndRef = useRef(null)
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();

      if (day === 5 && hour >= 19 && hour < 22) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages from Firestore
  useEffect(() => {
    const messagesRef = collection(firestore, 'messages'); 
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort messages by timestamp in ascending order
      fetchedMessages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!isAllowed) return;
    if (newMessage.trim() === "") return;

    const newMsg = {
      text: newMessage,
      sender: auth.currentUser.uid, 
      username: username, 
      avatar: img1, 
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: Timestamp.now(), 
    };

    try {
      await addDoc(collection(firestore, 'messages'), newMsg); 
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
// Scroll to the last message whenever messages change
useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="min-h-screen bg-[#0d1a2b] flex flex-col justify-between">
    
      <div className="fixed top-0 left-0 right-0 w-full flex items-center p-4 bg-[#1a2b3c] text-white z-10">
        <img src={img} alt="Avatar" className="w-10 h-10 rounded-full" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-gray-300">Anonymous</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-16 pt-20 mt-5 mb-5">
        {messages.
        map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start ${msg.sender === auth.currentUser .uid ? "justify-end" : "justify-start"}`}
          >
            {msg.sender !== auth.currentUser.uid && (
              <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
            )}
            <div>
              <p className="text-gray-300 text-xs">{msg.username}</p>
              <div className={`max-w-xs ${msg.text.length > 100 ? 'rounded-md' : 'lg:rounded-full rounded-lg'} px-4 py-2 flex flex-col justify-between ${msg.sender === auth.currentUser .uid ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                <p className={`text-[12px] md:text-[18px] leading-tight`}>{msg.text}</p>
                {msg.time && <p className="text-[8px] text-gray-200 self-end">{msg.time}</p>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {!isAllowed && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1a2b3c] flex items-center w-full">
        <FaPlus className="text-white mx-2" />
        <input
          type="text"
          className="flex-1 p-2 rounded-lg bg-gray-500 text-white outline-none"
          placeholder="Type a message..."
          value={newMessage}
          disabled={!isAllowed}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={!isAllowed} className="ml-2 text-white">
          <FaPaperPlane className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
}