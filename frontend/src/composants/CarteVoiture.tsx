import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface VoitureProps {
  id: string;
  nom: string;
  image: string;
  prix: string;
  categorie: string;
}

const CarteVoiture = ({ id, nom, image, prix, categorie }: VoitureProps) => {
  const navigate = useNavigate();
  const handleReservation = () => {
    // On envoie l'utilisateur vers la page détail de cette voiture précise
    navigate(`/voiture/${id}`);
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Zone Image */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={nom}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Car size={40} className="text-gray-300" />
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-[#3b82f6] text-[10px] font-black uppercase tracking-wider">
            {categorie}
          </span>
        </div>
      </div>

      {/* Détails */}
      <div className="p-6">
        <h3 className="text-[#1e293b] text-xl font-black tracking-tight">
          {nom}
        </h3>

        <div className="flex justify-between items-center mt-6">
          <div className="flex flex-col">
            <span className="text-[#3b82f6] font-black text-lg">{prix}</span>
            <span className="text-gray-400 text-[10px] uppercase font-bold">
              par jour
            </span>
          </div>

          <button
            onClick={handleReservation}
            className="bg-[#1e293b] hover:bg-[#3b82f6] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
          >
            Détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarteVoiture;
