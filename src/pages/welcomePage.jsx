
import AnonImage2 from '../assets/anonymous.png'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
export const Welcome = () => {

    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 500)
    }, [])

    const handleClick = () => {
        setIsClicked(true);
        navigate('/login');
        setTimeout(() => 
            setIsClicked(false), 200);
    }

    return (
        <>
            <div className="bg-gray-900 h-screen flex flex-col justify-center flex-wrap items-center">
                <h1 className="text-[#00CCFF] font-bold text-4xl md:text-6xl pb-4 md:pb-8">AnonTruth</h1>

                <div className='pb-4 mb-10 flex flex-col items-center'>
                    <img className='w-24 h-24 md:w-60 md:h-60 mb-6  items-center' src={AnonImage2} alt="AnonImage" />
                    <h1 className="text-[#00CCFF] font-bold text-center text-3xl md:text-6xl pb-6 ">Welcome</h1>
                    <p className="text-[#00CCFF] font-normal text-sm px-14 md:text-xl text-center">Behind the veil of anonymity, every whisper becomes a voice, every thought finds a space, say it all, no names, no limits</p>
                </div>

                <div>
                    <p onClick={handleClick} className={`absolute mt-4 transform -translate-x-1/2 bg-[#00CCFF] font-bold text-lg text-white px-6 py-2 rounded-full hover:bg-[#3e92e6] hover:scale-105   transition-all duration-1000 
                    ${isVisible ? "bottom-[120px]" : "bottom-[-200px] opacity-0" }
                    ${isClicked ? "bg-[#3e92e6] scale-90" : "bg-[#00CCFF]"}
                    animate-floating shadow-lg`}>Getting started</p>
                </div>
            </div>
        </>
    )
}