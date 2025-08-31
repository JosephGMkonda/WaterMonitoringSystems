import { useState, useRef, useEffect } from "react";
import { BsFillBellFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import usericon from "../assets/usericon.webp"; 


const TopBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();




  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <div className="flex items-center justify-between h-[70px] shadow-lg px-[25px] py-[20px] bg-white fixed top-0 left-0 w-full z-40">
      <div>
         
      </div>

      <div className="flex items-center">

      <p className="text text-sm">joseph mkonda</p>
      

        <div 
          className="flex items-center px-[20px] cursor-pointer relative"
          onClick={() => setShowDropdown(!showDropdown)}
          ref={dropdownRef}
        >
           
          <img
            src={usericon}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  navigate("/profile");
                  setShowDropdown(false);
                }}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;