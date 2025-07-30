import { Link } from "react-router-dom";
// import { ShoppingCart, Search } from "lucide-react";

const Header = () => {
  return (
   <header className="absolute top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-opacity-10 backdrop-blur-md z-10">
           <h1 className="text-2xl font-bold text-white">QuickQuiz</h1>
           <nav className="space-x-6 text-sm">
             <Link to="/login" className="hover:underline text-white">
               Login
             </Link>
             <Link to="/register" className="hover:underline text-white">
               Register
             </Link>
           </nav>
         </header>
  );
};

export default Header;
