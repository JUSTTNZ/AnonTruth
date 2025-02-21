import {  FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { useState } from "react";
import { auth, firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import GoogleIcon from "../assets/google logo.png";

export default function Login({ setIsAdmin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  const [error, SetError] = useState(null)
  const [btnloading, setbtnloading] = useState()
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;
  
      const userDoc = await getDoc(doc(firestore, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if user is admin
        const isAdmin = userData.isAdmin || false;
        localStorage.setItem("isAdmin", isAdmin); // Store admin status in local storage
        setIsAdmin(isAdmin); // Update global admin state
  
        setbtnloading(true);
        setTimeout(() => {
          setbtnloading(false);
          navigate("/chat");
        }, 9000);
      } else {
        SetError("You are not authorized as a User.");
        setTimeout(() => SetError(""), 5000);
      }
    } catch (err) {
      setbtnloading(true);
      setTimeout(() => {
        setbtnloading(false);
        SetError("Invalid email or password.");
        setTimeout(() => SetError(""), 5000);
      }, 2000);
    }
  };

  const GoggleRegister = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const userId = user.uid;
    
       
        const userDocRef = doc(firestore, "users", userId); 
        const userDoc = await getDoc(userDocRef); 
    
        if (!userDoc.exists()) {
  
          await setDoc(userDocRef, {
            email: user.email,
            userId,
          });
          console.log("User  data saved to Firestore");
        } else {
          console.log("User  already exists in Firestore");
        }
    
        
        navigate('/chat');
      } catch (error) {
        SetError("An error occurred during sign-in. Please try again.", error);
        console.error("Error signing in:", error);
      }
    };
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md  p-6 rounded-lg shadow-lg">
        
        <h1 className="text-3xl font-bold text-center text-[#00CCFF] font-poppins">Akanite Box</h1>

        <p className="text-gray-400 text-md text-center mt-2 font-poppins">
          Only login via email, Google, is supported 
        </p>
  {error && (
    <div className=" text-center text-red-400">
       {error.message}
        </div>
  )}
      <form onSubmit={handleLogin}>
      <div className="mt-4">
          <label className="block text-md font-medium"> Email</label>
          <div className="flex items-center border border-gray-600 rounded-md px-3 mt-1">
            <MdEmail className="text-gray-400" />
            <input
              type="text"
              placeholder="Email address"
              className="w-full bg-transparent p-2 outline-none text-md text-white"
              onChange={(e) => SetEmail(e.target.value)}
              value={email}
              required
            />
          </div>
        </div>

       
        <div className="mt-4">
          <label className="block text-md font-medium font-poppins">Password</label>
          <div className="flex items-center border border-gray-600 rounded-md px-3 mt-1">
            <MdLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent p-2 outline-none text-white text-md pointer"
              onChange={(e) => SetPassword(e.target.value)}
              value={password}
              required
            />
            <button className="pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash className="text-gray-400 pointer" /> : <FaRegEye className="text-gray-400 pointer" />}
            </button>
          </div>
        </div>

     
        <div className="mt-4 flex items-center gap-2">
          <input required type="checkbox" className="w-4 h-4 text-[#00CCFF]" />
          <p className="text-md text-gray-400">
            I confirm that I have read, consent and agree to Anon truth{" "}
            <a href="/terms-of-use" className="text-[#00CCFF] underline hover:text-[#3e92e6] transition-colors duration-300 cursor-pointer">Terms of Use</a> and{" "}
            <a href="/privacy-policy" className="text-[#00CCFF] underline hover:text-[#3e92e6] transition-colors duration-300 cursor-pointer">Privacy Policy</a>.
          </p>
        </div>

       
        <button type="submit" className={`w-full bg-[#00CCFF] hover:bg-[#3e92e6] transition-all duration-500 text-white py-2 rounded-md mt-4 font-semibold
        `}>
        {btnloading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                role="status"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Log in"
            )}
         
        </button>

      </form>
   
     
        <div className="mt-4 flex justify-between text-md text-gray-400">
          <a href="/forgot-password" className="hover:underline text-[#00CCFF] underline">Forgot password?</a>
          <a href="/register" className="hover:underline text-[#00CCFF] underline" >Sign up</a>
        </div>
 <div onClick={GoggleRegister} className="flex items-center gap-3 mt-6 border border-gray-500 rounded-full justify-center p-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition duration-800 hover:text-black">
          <img src={GoogleIcon} alt="" className="w-5 h-5 rounded-full" />
          <p>Sign in
           with Google</p>
        </div>
        
   
      </div>
    </div>
  );
}
