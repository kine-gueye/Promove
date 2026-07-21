import React, { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import toyotaImg from "../assets/toyota.jpeg";
import { ParkingApi, type ParkingSpot } from "../services/api";
import { useToast } from "../composants/Toast";
import ConfirmDialog from "../composants/ConfirmDialog";
import DemoBadge from "../composants/DemoBadge";

const ParkingMap: React.FC = () => {
  const toast = useToast();
  const [spaces, setSpaces] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpot | null>(null);
  const [spaceToRelease, setSpaceToRelease] = useState<ParkingSpot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadSpaces = () => {
    setLoading(true);
    ParkingApi.list()
      .then(setSpaces)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const handleRegisterCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpace) return;
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    setSubmitting(true);
    try {
      await ParkingApi.occupy(selectedSpace.id, {
        ownerName: formData.get("owner") as string,
        carPlate: formData.get("plate") as string,
        vehicleModel: formData.get("vehicleModel") as string,
      });
      setSelectedSpace(null);
      toast.success(`Véhicule enregistré sur la place #${selectedSpace.spotNumber}.`);
      loadSpaces();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmRelease = async () => {
    if (!spaceToRelease) return;
    try {
      await ParkingApi.release(spaceToRelease.id);
      toast.success(`Place #${spaceToRelease.spotNumber} libérée.`);
      loadSpaces();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSpaceToRelease(null);
    }
  };

  if (loading) {
    return <p className="text-gray-400 font-bold uppercase text-sm">Chargement du plan...</p>;
  }

  if (error) {
    return <p className="text-red-500 font-bold">{error}</p>;
  }

  return (
    <div className="relative space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-[#1e293b]">Gestion des Emplacements</h1>
        <DemoBadge live />
      </div>

      {/* Grille de Parking (donnees reelles) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {spaces.map((space) => (
          <div
            key={space.id}
            onClick={() => (space.isOccupied ? setSpaceToRelease(space) : setSelectedSpace(space))}
            title={space.isOccupied ? "Cliquer pour libérer" : "Cliquer pour enregistrer un véhicule"}
            className={`relative h-32 flex flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${
              space.isOccupied
                ? "border-red-200 bg-red-50 hover:border-red-400"
                : "border-green-200 bg-green-50 hover:border-[#3b82f6] hover:scale-105"
            }`}
          >
            {space.isOccupied ? (
              <div className="flex flex-col items-center">
                <img src={toyotaImg} alt="Véhicule" className="w-16 h-10 object-contain mb-1" />
                <span className="text-[9px] font-bold text-gray-600">{space.carPlate}</span>
              </div>
            ) : (
              <CheckCircle size={24} className="text-green-500 opacity-40" />
            )}
            <span className="absolute top-1 left-2 text-[10px] font-black text-[#1e293b]">
              #{space.spotNumber}
            </span>
            <span className="absolute top-1 right-2 text-[8px] font-bold text-gray-400 uppercase">
              {space.zone}
            </span>
          </div>
        ))}
      </div>

      {/* --- MODALE DU FORMULAIRE --- */}
      {selectedSpace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#1e293b] p-4 text-white flex justify-between items-center">
              <h2 className="font-bold">
                Enregistrer un véhicule - Place #{selectedSpace.spotNumber}
              </h2>
              <button onClick={() => setSelectedSpace(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterCar} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du Propriétaire
                </label>
                <input
                  name="owner"
                  type="text"
                  required
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#3b82f6] outline-none"
                  placeholder="Ex: Youssouf Bah"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de Plaque
                </label>
                <input
                  name="plate"
                  type="text"
                  required
                  className="w-full border border-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-[#3b82f6] outline-none"
                  placeholder="Ex: DK-1234-AB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modèle du véhicule
                </label>
                <select name="vehicleModel" className="w-full border border-gray-300 p-2 rounded-lg outline-none">
                  <option>Toyota Corolla</option>
                  <option>Toyota Prado</option>
                  <option>Autre</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#3b82f6] text-white font-bold py-3 rounded-lg hover:bg-[#1e293b] transition-colors mt-4 disabled:opacity-50"
              >
                {submitting ? "Enregistrement..." : "Confirmer l'occupation"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!spaceToRelease}
        title="Libérer cet emplacement ?"
        message={
          spaceToRelease
            ? `La place #${spaceToRelease.spotNumber} (${spaceToRelease.carPlate}) sera marquée comme libre.`
            : ""
        }
        confirmLabel="Libérer"
        danger
        onConfirm={confirmRelease}
        onCancel={() => setSpaceToRelease(null)}
      />
    </div>
  );
};

export default ParkingMap;
