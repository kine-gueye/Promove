import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Car } from "lucide-react";
import { AuthApi } from "../services/api";
import { useToast } from "../composants/Toast";

const Inscription = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const [firstName, ...rest] = fullName.trim().split(" ").filter(Boolean);
    const lastName = rest.join(" ") || firstName;
    if (!firstName) {
      setError("Merci de renseigner votre nom complet.");
      return;
    }

    setLoading(true);
    try {
      const { accessToken, user } = await AuthApi.register({
        email,
        password,
        firstName,
        lastName,
      });
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Bienvenue chez PROMOVE, ${user.firstName} !`);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden px-4 py-12">
      {/* Halo decoratif en fond, coherent avec Connexion */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3b82f6]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3b82f6]/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 text-white">
          <Car size={28} className="text-[#3b82f6]" />
          <span className="text-2xl font-black tracking-tight">PROMOVE</span>
        </Link>

        <div className="bg-white rounded-[32px] shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-50 text-[#3b82f6] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus size={26} />
            </div>
            <h1 className="text-2xl font-black text-[#1e293b]">Créer un compte</h1>
            <p className="text-gray-400 text-sm font-medium mt-1">
              Rejoignez PROMOVE pour louer un véhicule à Dakar
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nom complet"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#3b82f6] focus:bg-white transition-all"
                required
              />
            </div>

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#3b82f6] focus:bg-white transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (8 caractères min.)"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#3b82f6] focus:bg-white transition-all"
                required
                minLength={8}
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#3b82f6] focus:bg-white transition-all"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] hover:bg-[#1e293b] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 uppercase text-sm tracking-widest mt-2"
            >
              {loading ? "Création..." : "S'inscrire"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 font-medium mt-8">
            Vous avez déjà un compte ?{" "}
            <Link to="/connexionclient" className="text-[#3b82f6] font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
