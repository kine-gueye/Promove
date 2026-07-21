/**
 * Associe "Marque Modele" (tel que renvoye par l'API) a l'image locale
 * correspondante. Le backend ne stocke qu'une URL d'image (souvent absente
 * en local) : on utilise cette table comme visuel par defaut pour le
 * catalogue de demo, et on retombe sur car.imageUrl ou un placeholder sinon.
 */
import ToyotaPrado from "../assets/Voituresimg/ToyotaPrado.jpg";
import mercedes from "../assets/Voituresimg/mercedes.jpg";
import HyundaiAccent from "../assets/Voituresimg/HyundaiAccentjpg.jpg";
import ToyotaFortuner from "../assets/Voituresimg/ToyotaFortuner.jpg";
import FordExplorer from "../assets/Voituresimg/FordExplorer.jpg";
import RangeRoverVelar from "../assets/Voituresimg/RangeRoverVelar.jpg";
import HyundaiSantaFe from "../assets/Voituresimg/HyundaiSantaFe.jpg";
import KiaSportage from "../assets/Voituresimg/KiaSportage.jpg";
import ToyotaHilux from "../assets/Voituresimg/ToyotaHilux.jpg";
import AudiA6 from "../assets/Voituresimg/AudiA6.jpg";
import BMWSerie5 from "../assets/Voituresimg/BMWSerie5.jpg";
import ToyotaCamry from "../assets/Voituresimg/ToyotaCamry.jpg";
import HondaAccord from "../assets/Voituresimg/HondaAccord.jpg";
import VolkswagenPassat from "../assets/Voituresimg/VolkswagenPassat.jpg";
import KiaPicanto from "../assets/Voituresimg/KiaPicanto.jpg";
import SuzukiSwift from "../assets/Voituresimg/SuzukiSwift.jpg";
import ToyotaYaris from "../assets/Voituresimg/ToyotaYaris.jpg";
import HyundaiI10 from "../assets/Voituresimg/HyundaiI10.jpg";
import RenaultLogan from "../assets/Voituresimg/RenaultLogan.jpg";
import ToyotaHiace from "../assets/Voituresimg/ToyotaHiace.jpg";
import MercedesSprinter from "../assets/Voituresimg/MercedesSprinter.jpg";
import HyundaiH1 from "../assets/Voituresimg/HyundaiH1.jpg";
import MitsubishiL200 from "../assets/Voituresimg/MitsubishiL200.jpg";
import LexusLX600 from "../assets/Voituresimg/LexusLX600.jpg";

export const carImages: Record<string, string> = {
  "Toyota Prado": ToyotaPrado,
  "Mercedes Classe C": mercedes,
  "Hyundai Accent": HyundaiAccent,
  "Toyota Fortuner": ToyotaFortuner,
  "Mitsubishi L200": MitsubishiL200,
  "Ford Explorer": FordExplorer,
  "Range Rover Velar": RangeRoverVelar,
  "Hyundai Santa Fe": HyundaiSantaFe,
  "Kia Sportage": KiaSportage,
  "Toyota Hilux": ToyotaHilux,
  "BMW Série 5": BMWSerie5,
  "Audi A6": AudiA6,
  "Toyota Camry": ToyotaCamry,
  "Honda Accord": HondaAccord,
  "Volkswagen Passat": VolkswagenPassat,
  "Kia Picanto": KiaPicanto,
  "Suzuki Swift": SuzukiSwift,
  "Toyota Yaris": ToyotaYaris,
  "Hyundai i10": HyundaiI10,
  "Renault Logan": RenaultLogan,
  "Toyota Hiace": ToyotaHiace,
  "Mercedes Sprinter": MercedesSprinter,
  "Hyundai H1": HyundaiH1,
  "Lexus LX600": LexusLX600,
};

/** Retrouve une image locale pour une voiture venant de l'API, sinon un placeholder */
export function getCarImage(brand: string, model: string, fallbackUrl?: string): string {
  const key = `${brand} ${model}`;
  return (
    carImages[key] ||
    fallbackUrl ||
    "https://placehold.co/600x400/1e293b/3b82f6?text=" + encodeURIComponent(key)
  );
}
