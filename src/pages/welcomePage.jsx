import AnonImage1 from '../assets/security.png'
import AnonImage2 from '../assets/anonymous.png'
import { useState, useEffect } from 'react'
export const Welcome = () => {

    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 500)
    }, [])

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => 
            setIsClicked(false), 200);
    }
    return (
        <>
            <div className="bg-[#000] h-screen flex flex-col lg:py-[5%] sm:py-[50px] flex-wrap items-center">
                <h1 className="text-[#00CCFF] font-bold text-6xl pb-8">AnonTruth</h1>

                <div className='pb-4'>
                    <img className='w-60 h-60' src={AnonImage2} alt="AnonImage" />
                </div>
                <div className='pb-14'>
                    <h1 className="text-[#00CCFF] font-bold text-center text-6xl pb-6">Welcome</h1>
                    <p className="text-[#00CCFF] font-normal text-xl text-center">Behind the veil of anonymity, every whisper becomes a voice, every thought finds a space, say it all, no names, no limits</p>
                </div>

                <div>
                    <p onClick={handleClick} className={`fixed bottom-5 transform -translate-x-1/2 bg-[#00CCFF] font-bold text-lg text-white px-6 py-2 rounded-full transition-all duration-1000 
                    ${isVisible ? "bottom-[120px]" : "bottom-[-200px] opacity-0" }
                    ${isClicked ? "bg-[#003366]" : "bg-[#00CCFF]"}`}>Getting started</p>
                </div>
            </div>
        </>
    )
}