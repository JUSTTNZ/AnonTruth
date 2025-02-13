import {  FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { useState } from "react";
import { auth, firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import GoogleIcon from "../assets/google logo.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [user, setUser] = useState(null);
  const [error, SetError] = useState(null)
  const [btnloading, setbtnloading] = useState()
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
e.preventDefault()
try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userId = user.uid;

    const UserDoc = await getDoc(doc(firestore, "users", userId));
    if (UserDoc.exists()) {
      setbtnloading(true);
      setTimeout(() => {
        setbtnloading(false);
        navigate("/#");
      }, 9000);
    } else {
      SetError("You are not authorized as a User.");
      setTimeout(() => SetError(""), 5000);
    }
  } catch (err) {
    setbtnloading(true);
    setTimeout(() => {
      setbtnloading(false);
      
      SetError(err, "Invalid email or password.");
      setTimeout(() => SetError(""), 5000);
    }, 2000);
  }

  }

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Set logged-in user details
      navigate('/chats')
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md  p-6 rounded-lg shadow-lg">
        
        <h1 className="text-3xl font-bold text-center text-[#00CCFF]">Anon Truth</h1>

        <p className="text-gray-400 text-sm text-center mt-2">
          One Anon Truth account is all you need to access all Anon Truth services.
        </p>
  {error && (
    <div className=" text-center text-red-400">
       {error.message}
        </div>
  )}
      <form onSubmit={handleLogin}>
      <div className="mt-4">
          <label className="block text-sm font-medium"> Email</label>
          <div className="flex items-center border border-gray-600 rounded-md px-3 mt-1">
            <MdEmail className="text-gray-400" />
            <input
              type="text"
              placeholder="Email address"
              className="w-full bg-transparent p-2 outline-none text-white"
              onChange={(e) => SetEmail(e.target.value)}
              value={email}
              required
            />
          </div>
        </div>

       
        <div className="mt-4">
          <label className="block text-sm font-medium">Password</label>
          <div className="flex items-center border border-gray-600 rounded-md px-3 mt-1">
            <MdLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent p-2 outline-none text-white pointer"
              onChange={(e) => SetPassword(e.target.value)}
              value={password}
              required
            />
            <button className="pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash className="text-gray-400 pointer" /> : <FaRegEye className="text-gray-400 pointer" />}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Password</label>
          <div className="flex items-center border border-gray-600 rounded-md px-3 mt-1">
            <MdLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full bg-transparent p-2 outline-none text-white pointer"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
            <button className="pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash className="text-gray-400 pointer" /> : <FaRegEye className="text-gray-400 pointer" />}
            </button>
          </div>
        </div>
     
        <div className="mt-4 flex items-center gap-2">
          <input required type="checkbox" className="w-4 h-4 text-[#00CCFF]" />
          <p className="text-sm text-gray-400">
            I confirm that I have read, consent and agree to Anon truth{" "}
            <span className="text-[#00CCFF] cursor-pointer">Terms of Use</span> and{" "}
            <span className="text-[#00CCFF] cursor-pointer">Privacy Policy</span>.
          </p>
        </div>

       
        <button type="submit" onClick={handleClick} className={`w-full bg-[#00CCFF] hover:bg-[#3e92e6] transition-all duration-500 text-white py-2 rounded-md mt-4 font-semibold
        ${isClicked ? "scale-90" : ""}`}>
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
              "Sign Up"
            )}
         
        </button>

      </form>
   
     
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <a href="#" className="hover:underline">Forgot password?</a>
          <a href="#" className="hover:underline">Sign up</a>
        </div>
        <div onClick={login} className="flex items-center gap-3 mt-6 border border-gray-500 rounded-full justify-center p-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition duration-800 hover:text-black">
          <img src={GoogleIcon} alt="" className="w-5 h-5 rounded-full" />
          <p>Sign in with Google</p>
        </div>
      </div>
    </div>
  );
}
