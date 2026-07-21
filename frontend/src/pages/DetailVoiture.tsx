import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ShieldCheck, Fuel, Gauge, ArrowLeft } from "lucide-react";
import { Auth, BookingsApi, CarsApi, type Car } from "../services/api";
import { getCarImage } from "../data/carImages";
import { useToast } from "../composants/Toast";
import AvisSection from "../composants/AvisSection";

const categorieLabels: Record<string, string> = {
  economique: "Économique",
  berline: "Berline",
  suv: "SUV",
  luxe: "Luxe",
  pickup: "Pick-up",
  transport: "Transport",
};

const fuelLabels: Record<string, string> = {
  essence: "Essence",
  diesel: "Diesel",
  electrique: "Électrique",
  hybride: "Hybride",
};

function formatPrix(pricePerDay: number, currency: string) {
  return `${Math.round(pricePerDay).toLocaleString("fr-FR")} ${currency}`;
}

const DetailVoiture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    CarsApi.get(id)
      .then(setCar)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="pt-40 text-center min-h-screen text-gray-400 font-bold uppercase">Chargement...</div>;
  }

  if (notFound || !car) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">Véhicule introuvable</h2>
        <button onClick={() => navigate("/")} className="text-blue-500 hover:underline mt-4">
          Retourner à l'accueil
        </button>
      </div>
    );
  }

  const totalEstime = (() => {
    if (!startDate || !endDate) return null;
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (days <= 0) return null;
    return { days, total: days * car.pricePerDay };
  })();

  const handleLocationFinale = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!Auth.isLoggedIn()) {
      toast.error("Veuillez vous connecter pour finaliser votre location.");
      navigate("/connexionclient");
      return;
    }

    if (!startDate || !endDate || !pickupLocation) {
      setMessage({ type: "error", text: "Merci de renseigner les dates et le lieu de prise en charge." });
      return;
    }

    setSubmitting(true);
    try {
      await BookingsApi.create({ carId: car.id, startDate, endDate, pickupLocation });
      setMessage({
        type: "success",
        text: `Félicitations ! Votre demande pour la ${car.brand} ${car.model} a été enregistrée avec succès.`,
      });
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-8 max-w-6xl mx-auto min-h-screen font-sans">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-[#3b82f6] mb-8 transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft size={16} /> Retour à la flotte
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* --- COLONNE GAUCHE : IMAGE --- */}
        <div className="rounded-[40px] overflow-hidden shadow-2xl bg-white border border-gray-100 group">
          <img
            src={getCarImage(car.brand, car.model, car.imageUrl)}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* --- COLONNE DROITE : INFOS + RESERVATION --- */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="bg-blue-50 text-[#3b82f6] px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-[0.2em]">
              {categorieLabels[car.category] || car.category}
            </span>
            <h1 className="text-5xl font-black text-[#1e293b] mt-4 tracking-tighter">
              {car.brand} {car.model}
            </h1>
          </div>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl font-black text-[#3b82f6]">
              {formatPrix(car.pricePerDay, car.currency)}
            </span>
            <span className="text-gray-400 font-bold uppercase text-xs">/ Journée</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100">
            <p className="text-gray-500 leading-relaxed italic">
              {car.description ||
                `Profitez d'un véhicule récent, climatisé et parfaitement entretenu. Chez PROMOVE, nous nous engageons à vous fournir une expérience de conduite sans souci à Dakar et partout au Sénégal.`}
            </p>
          </div>

          {/* Caractéristiques techniques (reelles, venant de l'API) */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
              <div className="bg-blue-50 p-2 rounded-lg text-[#3b82f6]">
                <Fuel size={18} />
              </div>
              <span className="text-sm font-bold text-[#1e293b]">
                {fuelLabels[car.fuelType] || car.fuelType}
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
              <div className="bg-blue-50 p-2 rounded-lg text-[#3b82f6]">
                <Gauge size={18} />
              </div>
              <span className="text-sm font-bold text-[#1e293b]">
                {car.transmission === "automatique" ? "Automatique" : "Manuelle"} · {car.seats} places
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
              <div className="bg-blue-50 p-2 rounded-lg text-[#3b82f6]">
                <ShieldCheck size={18} />
              </div>
              <span className="text-sm font-bold text-[#1e293b]">Assurance Incluse</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
              <div className="bg-blue-50 p-2 rounded-lg text-[#3b82f6]">
                <Calendar size={18} />
              </div>
              <span className="text-sm font-bold text-[#1e293b]">
                {car.available ? "Dispo immédiate" : "Indisponible"}
              </span>
            </div>
          </div>

          {/* Formulaire de reservation */}
          <form onSubmit={handleLocationFinale} className="bg-white border border-gray-100 rounded-3xl p-6 mb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Prise en charge</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#1e293b]"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Retour</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#1e293b]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Lieu de prise en charge</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Ex: Aéroport AIBD, Dakar"
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#1e293b]"
                required
              />
            </div>

            {totalEstime && (
              <p className="text-sm font-bold text-[#1e293b] flex justify-between">
                <span>Total estimé ({totalEstime.days} jour{totalEstime.days > 1 ? "s" : ""})</span>
                <span className="text-[#3b82f6]">{formatPrix(totalEstime.total, car.currency)}</span>
              </p>
            )}

            {message && (
              <p className={`text-sm font-bold ${message.type === "error" ? "text-red-500" : "text-green-600"}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !car.available}
              className="w-full bg-[#3b82f6] hover:bg-[#1e293b] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? "Traitement..." : car.available ? "Louer maintenant" : "Indisponible"}
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Aucun frais de dossier caché · Paiement à la livraison
          </p>
        </div>
      </div>

      <AvisSection carId={car.id} />
    </div>
  );
};

export default DetailVoiture;
