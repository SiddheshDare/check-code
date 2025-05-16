import React, { use } from 'react'
import { useState } from 'react'

function Login({setIsLoggedIn}) {
    const[userName,setUserName]=useState(null);
    const[password,setPassword]=useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userName || !password) {
          setError('Please fill in both fields');
        } else {
          if(userName==="Admin" && password==="Admin"){
            setIsLoggedIn(true);
          }
        }
      };
    

    return (
        <div className="w-screen h-screen flex flex-row justify-center items-center">
        <div className="w-80 h-[28rem] flex flex-col justify-center items-center p-6 rounded-lg shadow-md">
          <div className="text-2xl font-semibold mb-6">Log In</div>
    
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
    
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
    
            <button
              type="submit"
              className="bg-amber-500 text-white py-2 rounded mt-4 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-700"
            >
              Log In
            </button>
          </form>
        </div>
        </div>
      );
}

export default Login
