import { useState } from "react";
import { useContext } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/ContextAuth";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, access } = useSelector((state) => state.auth);
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(result)) {
       localStorage.setItem("token", "my-jwt-token");
      setIsLoggedIn(true);
      navigate("/"); 
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-blue-200 overflow-hidden">
      
      
      <div className="absolute inset-0">
        <div className="absolute bg-blue-300 rounded-full opacity-30 w-20 h-20 animate-float1 top-10 left-10"></div>
        <div className="absolute bg-blue-400 rounded-full opacity-20 w-32 h-32 animate-float2 top-1/4 right-16"></div>
        <div className="absolute bg-blue-300 rounded-full opacity-25 w-16 h-16 animate-float3 bottom-20 left-1/3"></div>
      </div>

    
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44C161.76,78.75,0,50.14,0,50.14V120H1200V0S1083.67,84,924.05,84C764.43,84,641,33.06,481.39,56.44Z" fill="#60a5fa">
            <animate 
              attributeName="d" 
              dur="6s" 
              repeatCount="indefinite" 
              values="
                M321.39,56.44C161.76,78.75,0,50.14,0,50.14V120H1200V0S1083.67,84,924.05,84C764.43,84,641,33.06,481.39,56.44Z;
                M321.39,46.44C161.76,68.75,0,40.14,0,40.14V120H1200V0S1083.67,74,924.05,74C764.43,74,641,23.06,481.39,46.44Z;
                M321.39,56.44C161.76,78.75,0,50.14,0,50.14V120H1200V0S1083.67,84,924.05,84C764.43,84,641,33.06,481.39,56.44Z
              " 
            />
          </path>
        </svg>
      </div>

    
      <div className="relative bg-white shadow-lg rounded-2xl p-8 w-full max-w-md z-10">
        
        <div className="flex flex-col items-center mb-6">
          <MdWaterDrop className="text-blue-500 text-6xl" />
          <h1 className="text-2xl font-bold text-blue-600 mt-2">
            Borehole Monitor
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        
        <form onSubmit={handleLogin} className="space-y-4">
        
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500">
            <FaUser className="text-gray-400 mr-2" />
             <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500">
            <FaLock className="text-gray-400 mr-2" />
           <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
            />
          </div>

        
          <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
>
  {loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
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
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Signing in...
    </>
  ) : (
    "Sign In"
  )}
</button>

        </form>

        
        <p className="text-sm text-gray-500 text-center mt-6">
          © {new Date().getFullYear()} Borehole Monitor. All rights reserved.
        </p>
      </div>
    </div>
  );
}
