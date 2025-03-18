/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaPlus, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const MessageInput = ({ newMessage, setNewMessage, sendMessage, isMessagingDisabled, replyTo, setReplyTo }) => {
  const textareaRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // State to track recording time
  const intervalRef = useRef(null); // Ref to store the interval ID

  // Speech recognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Update the message input with the transcribed text
  useEffect(() => {
    if (transcript) {
      setNewMessage(transcript);
    }
  }, [transcript]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  // Handle start/stop listening
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  // Start/stop the recording timer
  useEffect(() => {
    if (listening) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1); // Increment time every second
      }, 1000);
    } else {
      // Stop the timer and reset the time
      clearInterval(intervalRef.current);
      setRecordingTime(0);
    }

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [listening]);

  // Automatically send the message when speech recognition stops
  useEffect(() => {
    if (!listening && transcript.trim() !== "") {
      handleSendMessage();
    }
  }, [listening]);

  // Handle sending message and resetting transcript
  const handleSendMessage = () => {
    sendMessage();
    resetTranscript(); // Reset the transcript after sending the message
  };

  // Format the recording time into MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // If the browser doesn't support speech recognition, don't render the microphone button
  if (!browserSupportsSpeechRecognition) {
    return null; // or render a fallback UI
  }

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
            className="w-full px-4 py-3 bg-transparent text-white outline-none placeholder-gray-400 resize-none overflow-y-auto leading-normal whitespace-pre-wrap hide-scrollbar"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={1}
            style={{ maxHeight: "70px" }}
            disabled={isMessagingDisabled}
          />
        </div>

        {/* Microphone Button and Recording Time Display */}
        <div className="flex items-center ml-2">
          {listening && (
            <div className="text-white text-sm mr-2">
              {formatTime(recordingTime)} {/* Display recording time */}
            </div>
          )}
          <motion.button
            onClick={toggleListening}
            disabled={isMessagingDisabled}
            className="text-white"
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {listening ? <FaMicrophoneSlash className="text-xl text-red-400" /> : <FaMicrophone className="text-xl" />}
          </motion.button>
        </div>

        {/* Send Button */}
        <motion.button
          disabled={isMessagingDisabled}
          onClick={handleSendMessage}
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