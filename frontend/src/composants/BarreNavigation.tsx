import { useState } from "react"; // 1. On ajoute useState
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Optionnel : utilise les icônes lucide-react

const BarreNavigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // 2. État pour le menu mobile
  
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md shadow-md py-4 px-8 z-50">
      <div className="flex justify-between items-center">
        {/* LOGO */}
        <div className="text-[#1e293b] font-bold text-2xl tracking-tight">
          PRO<span className="text-[#3b82f6]">MOVE</span>
        </div>

        {/* LIENS DESKTOP (cachés sur mobile) */}
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          <Link to="/" className="hover:text-[#3b82f6] transition">Accueil</Link>
          <Link to="/apropos" className="hover:text-[#3b82f6] transition">À propos</Link>
          <Link to="/contact" className="hover:text-[#3b82f6] transition">Contact</Link>
        </div>

        {/* BOUTON CONNEXION & BURGER */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-700">{user.email}</span>
                <button onClick={handleLogout} className="text-xs text-red-500 font-bold hover:underline">Déconnexion</button>
              </div>
            ) : (
              <Link to="/connexionclient" className="bg-[#3b82f6] text-white px-6 py-2 rounded-full font-semibold">Connexion</Link>
            )}
          </div>

          {/* 3. LE BOUTON BURGER (Visible uniquement sur mobile) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-gray-800 p-2"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 4. LE MENU MOBILE (S'affiche si isOpen est vrai) */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md flex flex-col items-center py-8 gap-6 shadow-xl border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold uppercase tracking-widest text-sm">Accueil</Link>
          <Link to="/apropos" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold uppercase tracking-widest text-sm">À propos</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold uppercase tracking-widest text-sm">Contact</Link>
          
          {user ? (
             <button onClick={handleLogout} className="bg-red-500 text-white px-8 py-3 rounded-full font-bold">Déconnexion</button>
          ) : (
            <Link to="/connexionclient" onClick={() => setIsOpen(false)} className="bg-[#3b82f6] text-white px-8 py-3 rounded-full font-bold">Connexion</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default BarreNavigation;