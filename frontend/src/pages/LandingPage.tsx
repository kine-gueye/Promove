import { useEffect, useState } from "react";
import BarreNavigation from "../composants/BarreNavigation";
import CarteVoiture from "../composants/CarteVoiture";
import heroBg from "../assets/hero-bg.jpg";
import { CarsApi, type Car } from "../services/api";
import { getCarImage } from "../data/carImages";

// Traduit les categories backend (enum anglais) vers les libelles FR affiches
const categorieLabels: Record<string, string> = {
  economique: "Économique",
  berline: "Berline",
  suv: "SUV",
  luxe: "Luxe",
  pickup: "Pick-up",
  transport: "Transport",
};

function formatPrix(pricePerDay: number, currency: string) {
  return `${Math.round(pricePerDay).toLocaleString("fr-FR")} ${currency}`;
}

const LandingPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CarsApi.list()
      .then(setCars)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const scrollToVehicules = () => {
    const element = document.getElementById("flotte");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <BarreNavigation />

      {/* --- Section Héro avec Background Image --- */}
      <header className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
              La liberté de rouler, <br />
              <span className="text-[#3b82f6]">en toute simplicité.</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 font-medium">
              Découvrez notre large gamme de véhicules pour tous vos déplacements
              à Dakar et partout au Sénégal avec PROMOVE.
            </p>
            <button
              onClick={scrollToVehicules}
              className="bg-[#3b82f6] text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-[#3b82f6] transition-all transform hover:scale-105 shadow-2xl text-lg"
            >
              Voir les véhicules disponibles
            </button>
          </div>
        </div>
      </header>

      {/* --- SECTION : LISTE DES VOITURES --- */}
      <section className="py-20 px-8 max-w-7xl mx-auto" id="flotte">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl font-black text-[#1e293b]">
            Notre Flotte à Dakar
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Découvrez notre sélection de véhicules disponibles immédiatement.
          </p>
        </div>

        {loading && (
          <p className="text-gray-400 font-bold uppercase text-sm">Chargement de la flotte...</p>
        )}
        {error && (
          <p className="text-red-500 font-bold">
            {error} — vérifiez que l'API PROMOVE est bien démarrée sur {`http://localhost:3000`}.
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {cars.map((car) => (
              <CarteVoiture
                key={car.id}
                id={car.id}
                nom={`${car.brand} ${car.model}`}
                image={getCarImage(car.brand, car.model, car.imageUrl)}
                prix={formatPrix(car.pricePerDay, car.currency)}
                categorie={categorieLabels[car.category] || car.category}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
