import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthApi } from "../services/api";

const ConnexionClient: React.FC = () => {
  const navigate = useNavigate();

  // On laisse les champs vides au départ pour que l'utilisateur puisse écrire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const { accessToken, user } = await AuthApi.login(email, password);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 font-sans">
      <div className="bg-white flex w-full max-w-5xl min-h-[600px] rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        {/* --- COLONNE GAUCHE : Formulaire --- */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-[#3b82f6] p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Car size={28} />
            </div>
            <span className="text-2xl font-black text-[#1e293b] tracking-tighter uppercase">
              PRO<span className="text-[#3b82f6]">MOVE</span>
            </span>
          </div>

          <div className="mb-8">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">
              Espace Client
            </p>
            <h1 className="text-4xl font-black text-[#1e293b]">Connexion</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col group">
              <label className="text-xs font-bold text-[#1e293b] mb-2 ml-1 uppercase opacity-60">
                Adresse Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3b82f6] transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#3b82f6] focus:bg-white p-4 pl-12 rounded-2xl outline-none transition-all text-[#1e293b] font-medium"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col group relative">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-bold text-[#1e293b] uppercase opacity-60">
                  Mot de passe
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-[10px] text-[#3b82f6] font-bold hover:underline uppercase"
                >
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3b82f6] transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#3b82f6] focus:bg-white p-4 pl-12 rounded-2xl outline-none transition-all"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3b82f6] hover:bg-[#1e293b] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase text-sm tracking-widest disabled:opacity-50"
              >
                <LogIn size={20} />
                {loading ? "Connexion..." : "Entrer"}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center md:text-left">
            <p className="text-sm text-gray-400 font-medium">
              Nouveau sur la plateforme ?
              <Link
                to="/inscription"
                className="text-[#3b82f6] font-black ml-2 hover:underline"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* --- COLONNE DROITE : Design Start-up --- */}
        <div className="hidden md:flex w-1/2 bg-[#1e293b] items-center justify-center p-12 relative">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#3b82f6] rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#3b82f6] rounded-full opacity-10 blur-3xl"></div>

          <div className="relative z-10 text-center">
            <img
              src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/2d0bbb45-0e00-41a0-8773-e400d8d4c256.png"
              alt="Logo PROMOVE"
            ></img>

            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter italic uppercase">
              Solution ProMove
            </h2>
            <p className="text-blue-200 text-sm font-medium opacity-70 px-8">
              Gérez intelligemment votre flotte et vos parkings avec la
              technologie Start-up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnexionClient;
