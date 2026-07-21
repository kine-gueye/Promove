import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail, Car, ArrowLeft } from "lucide-react";
import { AuthApi } from "../services/api";
import { useToast } from "../composants/Toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await AuthApi.forgotPassword(email);
      toast.success(result.message);
      navigate("/connexionclient");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden px-4 py-12">
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
              <KeyRound size={26} />
            </div>
            <h1 className="text-2xl font-black text-[#1e293b]">Mot de passe oublié</h1>
            <p className="text-gray-400 text-sm font-medium mt-1">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && (
              <p className="text-red-500 text-xs font-bold bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] hover:bg-[#1e293b] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 uppercase text-sm tracking-widest mt-2"
            >
              {loading ? "Envoi..." : "Réinitialiser"}
            </button>
          </form>

          <Link
            to="/connexionclient"
            className="flex items-center justify-center gap-2 text-sm text-gray-400 font-bold hover:text-[#3b82f6] transition-colors mt-8"
          >
            <ArrowLeft size={14} /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
