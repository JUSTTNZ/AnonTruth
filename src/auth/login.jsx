import {  FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  const [error, SetError] = useState('')
  const handleLogin = (e) => {
e.preventDefault()
try {
 email
 password
}catch(error){
    SetError(error)
}


  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md  p-6 rounded-lg shadow-lg">
        
        <h1 className="text-3xl font-bold text-center text-blue-400">Anon Truth</h1>

        <p className="text-gray-400 text-sm text-center mt-2">
          Only login via email, Google, is supported 
        </p>
  {error && (
    <div className=" text-center text-red-400">
       {error}
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
            />
            <button className="pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash className="text-gray-400 pointer" /> : <FaRegEye className="text-gray-400 pointer" />}
            </button>
          </div>
        </div>

     
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-gray-400">
            I confirm that I have read, consent and agree to Anon truth{" "}
            <span className="text-blue-400 cursor-pointer">Terms of Use</span> and{" "}
            <span className="text-blue-400 cursor-pointer">Privacy Policy</span>.
          </p>
        </div>

       
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md mt-4 font-semibold">
          Log in
        </button>

      </form>
   
     
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <a href="#" className="hover:underline">Forgot password?</a>
          <a href="#" className="hover:underline">Sign up</a>
        </div>

     
   
      </div>
    </div>
  );
}
