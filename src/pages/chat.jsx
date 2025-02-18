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
    
            // Preserve existing reactions in state
            setMessages((prevMessages) =>
                fetchedMessages.map((msg) => {
                    const existingMsg = prevMessages.find(m => m.id === msg.id);
                    return existingMsg ? { ...msg, reactions: existingMsg.reactions || msg.reactions } : msg;
                })
            );
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
                    const updatedReactions = { ...(msg.reactions || {}) };
    
                    // Remove the user's previous reaction (if any)
                    for (const key in updatedReactions) {
                        updatedReactions[key] = updatedReactions[key].filter(id => id !== userId);
                        if (updatedReactions[key].length === 0) {
                            delete updatedReactions[key]; 
                        }
                    }
    
                    // Add the new reaction (if it's not the same as the previous one)
                    if (reaction) {
                        if (!updatedReactions[reaction]) {
                            updatedReactions[reaction] = [];
                        }
                        updatedReactions[reaction].push(userId);
                    }
    
                    return { ...msg, reactions: updatedReactions };
                }
                return msg;
            })
        );
    
        setReactionPopup(null);
    
        try {
            // Update Firestore *with the updated reactions*
            await updateDoc(messageRef, { reactions: messages.find(msg => msg.id === msgId)?.reactions || {} });
    
            // Manually update the state after Firestore update (to avoid snapshot resetting UI)
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === msgId ? { ...msg, reactions: messages.find(m => m.id === msgId)?.reactions || {} } : msg
                )
            );
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-16 pt-20 mt-5 mb-5 max-h-[calc(100vh-150px)]">
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
                                <div className={`max-w-xs ${msg.text.length > 100 ? 'rounded-md' : 'rounded-full'} px-4 py-2 flex flex-col justify-between ${msg.sender === auth.currentUser.uid ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"} rounded-md overflow-hidden`}>
                                    {msg.replyTo && (
                                        <div className=" mb-1 flex flex-col ">
                                         <p className="text-xs text-gray-400 italic">
                                         Replying to {msg.replyTo.username}:
                                          </p>
                                              <p className="text-xs text-gray-400 italic truncate max-w-[15ch]">
                                            `{msg.replyTo.text}`
                                              </p>
                                        </div>
                                    )}
                                    <p className="text-[12px] md:text-[18px] leading-tight break-words">{msg.text}</p>
                                    {msg.time && <p className="text-[8px] text-gray-200 self-end">{msg.time}</p>}
                                </div>

                                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                    <div className="absolute left-0 bottom-[-18px] flex space-x-1 text-white text-xs">
                                        {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                                            <button
                                                key={emoji}
                                                className={`flex items-center space-x-1 p-1 rounded ${
                                                    userIds.includes(auth.currentUser.uid) ? "bg-blue-500" : "bg-gray-700"
                                                }`}
                                                onClick={() => addReaction(msg.id, emoji)}
                                            >
                                                <span>{emoji}</span> {/* Display emoji */}
                                                <span>{userIds.length}</span> {/* Display count of users who reacted with this emoji */}
                                            </button>
                                        ))}
                                    </div>
                                )}

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