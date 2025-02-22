/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, auth, setReactionPopup, reactionPopup, addReaction, setReplyTo }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-16 pt-20 mt-5 mb-5 max-h-[calc(100vh-150px)] hide-scrollbar">
      {messages.map((msg) => {
        const userReaction = msg.reactions?.[auth.currentUser.uid] || "";
        return (
          <MessageItem
            key={msg.id}
            msg={msg}
            auth={auth}
            userReaction={userReaction}
            setReactionPopup={setReactionPopup}
            reactionPopup={reactionPopup}
            addReaction={addReaction}
            setReplyTo={setReplyTo}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;