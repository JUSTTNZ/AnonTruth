import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnonImage2 from '../assets/anonymous.png';

export const Welcome = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [displayText, setDisplayText] = useState(""); // Holds progressively revealed text
    const [isTyping, setIsTyping] = useState(true); // Tracks if text is still typing
    const navigate = useNavigate();

    const fullText = "Beehind the veil of anonymity, every whisper becomes a voice, every thought finds a space, say it all, no names, no limits.";

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 500);

        let index = 0;
        const textInterval = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText((prev) => prev + fullText.charAt(index));
                index++;
            } else {
                clearInterval(textInterval);
                setIsTyping(false); // Stop blinking dot after text is done
            }
        }, 50); // Adjust speed if needed

        return () => clearInterval(textInterval);
    }, []);

    const handleClick = () => {
        setIsClicked(true);
        navigate('/login');
        setTimeout(() => setIsClicked(false), 200);
    };

    return (
        <>
            <div className={`bg-gray-900 h-screen flex flex-col justify-center items-center transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                
                {/* Logo with scale & rotate effect */}
                <h1 className={`text-[#00CCFF] font-bold text-4xl md:text-6xl pb-4 md:pb-8 transition-transform duration-1000 ease-in-out transform 
                ${isVisible ? "scale-100 rotate-0" : "scale-75 rotate-[-10deg]"}`}>
                    Akanite Box
                </h1>

                <div className='pb-4 mb-10 flex flex-col items-center'>
                    {/* Image with bounce-in effect */}
                    <img className={`w-24 h-24 md:w-60 md:h-60 mb-6 transition-transform duration-1000 ease-out transform scale-50 opacity-0 ${isVisible ? "scale-100 opacity-100" : ""}`} src={AnonImage2} alt="AnonImage" />

                    {/* Slide-in effect for Welcome text */}
                    <h1 className={`text-[#00CCFF] font-bold text-center text-3xl md:text-6xl pb-14 transition-transform duration-1000 ease-in-out transform translate-y-10 opacity-0 
                    ${isVisible ? "translate-y-0 opacity-100" : ""}`}>Welcome</h1>

                    {/* ChatGPT-style typing effect with moving blinking dot */}
                    <p className="text-[#00CCFF] font-normal text-sm px-14 md:text-xl text-center mb-6">
                        {displayText}
                        <span className={`typing-dot ${isTyping ? "blink" : "hidden"}`}>●</span> {/* Dot follows the text */}
                    </p>
                </div>

                {/* Floating Button with hover and click animation */}
                <div className="relative flex justify-center">
                    <p onClick={handleClick} className={`mt-4 transform bg-[#00CCFF] font-bold text-lg text-white px-6 py-2 rounded-full hover:bg-[#3e92e6] hover:scale-110 transition-all duration-1000 
                    ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
                    ${isClicked ? "bg-[#3e92e6] scale-90" : "bg-[#00CCFF]"}
                    animate-floating shadow-lg`}>
                        Get started
                    </p>
                </div>

                {/* CSS for blinking dot */}
                <style>
                    {`
                    .typing-dot {
                        font-size: 1.5em;
                        font-weight: bold;
                        color: #00CCFF;
                        margin-left: 4px; /* Moves the dot to follow text */
                    }

                    .blink {
                        animation: blink 1s infinite;
                    }

                    @keyframes blink {
                        0% { opacity: 1; }
                        50% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    `}
                </style>
            </div>
        </>
    );
};
