/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FaRegSmile } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { TiTickOutline } from "react-icons/ti";
import img from "../assets/security.png";
const MessageItem = ({
  msg,
  auth,
  userReaction,
  setReactionPopup,
  reactionPopup,
  addReaction,
  setReplyTo,
}) => {
  return (
    <motion.div
      key={msg.id}
      className={`flex items-start ${
        msg.sender === auth.currentUser.uid ? "justify-end" : "justify-start"
      }`}
      drag="x"
      dragConstraints={{ left: -5, right: 0 }}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 15 }}
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 30) {
          setReplyTo(msg);
        }
      }}
      transition={{ type: "spring", stiffness: 150, damping: 10 }}
    >
      {/* Avatar for Sender */}
      {msg.sender !== auth.currentUser.uid && (
        <img src={img} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
      )}

      {/* Message Bubble */}
      <div className="relative group overflow-hidden">
        {msg.sender !== auth.currentUser.uid && (
          <p className="text-gray-300 text-xs">{msg.username}</p>
        )}
        <div
          className={`
            min-w-[100px] 
            max-w-[75%] 
            ${msg.text.length > 100 ? "rounded-md" : "rounded-full"}
            px-4 py-2 flex flex-col justify-between 
            ${msg.sender === auth.currentUser.uid ? "ml-auto mr-2 bg-blue-500 text-white" : "bg-gray-700 text-gray-200"} 
            rounded-md overflow-hidden
          `}
        >
          {/* Reply Info */}
          {msg.replyTo && (
            <div className="mb-1 flex flex-col">
              <p className="text-xs text-gray-400 italic">{msg.replyTo.username}:</p>
              <p className="text-xs text-gray-400 italic truncate max-w-[15ch]">
                `{msg.replyTo.text}`
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
            className={`absolute ${
              msg.sender === auth.currentUser.uid ? "right-0" : "left-0"
            } bottom-[-18px] flex space-x-[-4px] text-white text-xs`}
          >
            {Object.keys(msg.reactions).map((emoji) => (
              <span key={emoji}>{emoji}</span>
            ))}
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
          className={`mt-1 text-gray-300 text-sm flex items-center relative ${
            msg.sender === auth.currentUser.uid ? "ml-auto" : "mr-auto"
          }`}
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
};

export default MessageItem;