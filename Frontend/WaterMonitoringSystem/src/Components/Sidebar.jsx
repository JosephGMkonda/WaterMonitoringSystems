import { Link } from "react-router-dom";
import { BsGrid3X3GapFill, BsPeopleFill } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import usericon from "../assets/usericon.webp";

const Sidebar = () => {
  const username = "Joseph Mkonda"; 
  const version = "v1.0.0";

  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-400 h-full w-[18%] fixed top-0 left-0 z-50 flex flex-col justify-between">
      
      
      <div>
        
        <div className="flex flex-col items-center py-6 border-b border-blue-300">
          <img
            src={usericon}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
          />
          <h2 className="text-white mt-3 font-semibold">{username}</h2>
         
        </div>

        
        <nav className="mt-6">
          <Link
            to="/"
            className="flex items-center gap-4 py-3 px-6 cursor-pointer text-white hover:bg-blue-500 transition-all"
          >
            <BsGrid3X3GapFill />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/waterpoints"
            className="flex items-center gap-4 py-3 px-6 cursor-pointer text-white hover:bg-blue-500 transition-all"
          >
            <BsPeopleFill />
            <span className="font-medium">Water Points</span>
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-4 py-3 px-6 cursor-pointer text-white hover:bg-blue-500 transition-all"
          >
            <FiSettings />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </div>

      
      <div className="text-center py-4 border-t border-blue-300 text-blue-100 text-sm">
        {version}
      </div>
    </div>
  );
};

export default Sidebar;
