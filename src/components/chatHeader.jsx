/* eslint-disable react/prop-types */
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi"; 
import img from "../assets/anonymous.png";

const ChatHeader = ({ isAdmin, toggleMessaging, isMessagingEnabled }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 w-full flex items-center p-4 bg-[#1a2b3c] text-white z-10">

      <img src={img} alt="Avatar" className="w-10 h-10 rounded-full" />

   
      <div className="ml-3 flex-1">
        <p className="text-sm text-gray-300">Anonymous</p>
        {!isMessagingEnabled &&(
                  <p className="text-sm text-gray-300">Only Admin Can Send Message</p>
        )
        
        }

      </div>

      {isAdmin && (
        <div className="relative">
          
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FiMoreVertical className="text-xl" />
          </button>

         
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1a2b3c] text-white rounded-lg shadow-lg border border-gray-500">
            
              <button
                className="block px-4 py-2 text-sm hover:bg-gray-700 w-full text-left"
                onClick={() => {
                  toggleMessaging();
                  setMenuOpen(false); 
                }}
              >
               {isMessagingEnabled ? "Disable Messaging" : "Enable Messaging"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHeader;