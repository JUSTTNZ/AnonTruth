/* eslint-disable react/prop-types */
import {  useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaPlus } from "react-icons/fa";

const MessageInput = ({ newMessage, setNewMessage, sendMessage, isMessagingDisabled, replyTo, setReplyTo }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0d1a2b] flex flex-col items-center w-full">
      {replyTo && (
        <div className="w-full flex items-center bg-gray-800 text-white p-2 rounded-t-md mb-2">
          <div className="flex-1 p-3 bg-gray-900 rounded-t-md border-l-8 border-blue-500">
            <p className="text-xs text-gray-400">Replying to {replyTo.username}</p>
            <p className="text-sm italic text-gray-300 truncate max-w-[15ch]">{replyTo.text}</p>
          </div>
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
            disabled={isMessagingDisabled}
          />
        </div>

        <motion.button
          disabled={isMessagingDisabled}
          onClick={sendMessage}
          className="ml-2 text-white"
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <FaPaperPlane className="text-xl" />
        </motion.button>
      </div>
    </div>
  );
};

export default MessageInput;