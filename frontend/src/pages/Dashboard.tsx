import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParkingMap from "./ParkingMap"; // Adapte le chemin si nécessaire
import { Auth } from "../services/api";
import DemoBadge from "../composants/DemoBadge";
import MeteoDevisesWidget from "../composants/MeteoDevisesWidget";
import {
  LayoutDashboard,
  Car,
  MapPin,
  LogOut,
  Search,
  Bell,
  MoreHorizontal,
  Timer,
  History,
  Download,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Garde d'acces : reserve au staff (admin/manager)
  useEffect(() => {
    if (!Auth.isLoggedIn() || !Auth.hasRole("admin", "manager")) {
      navigate("/connexionadmin");
    }
  }, [navigate]);

  const user = Auth.getUser() || { email: "Gestionnaire", firstName: "Gestionnaire" };

  const handleLogout = () => {
    Auth.logout();
    navigate("/connexionadmin");
  };

  const joursSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="flex h-screen bg-[#f7f9fb] font-sans text-[#1e293b]">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-[#3b82f6] p-1.5 rounded-lg text-white">
            <Car size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">
            PRO<span className="text-[#3b82f6]">MOVE</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
            Menu Principal
          </p>

          <MenuButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<LayoutDashboard size={18} />}
            label="Tableau de bord"
          />
          <MenuButton
            active={activeTab === "plan"}
            onClick={() => setActiveTab("plan")}
            icon={<MapPin size={18} />}
            label="Plan (Plateau/VDN)"
          />
          <MenuButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={<History size={18} />}
            label="Historique Flux"
          />
          <MenuButton
            active={activeTab === "vehicles"}
            onClick={() => setActiveTab("vehicles")}
            icon={<Car size={18} />}
            label="Véhicules Actifs"
          />
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold group"
          >
            <LogOut
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between border-b border-gray-50 shrink-0">
          <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
            <span className="font-bold text-[#3b82f6]">PRO MOVE</span>
            <span>/</span>
            <span className="text-[#1e293b] capitalize font-bold">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Chercher plaque (ex: DK-1234...)"
                className="bg-[#f1f5f9] border-none rounded-lg p-2 pl-9 text-sm w-64 outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            </div>
            <Bell
              size={18}
              className="text-gray-400 cursor-pointer hover:text-[#3b82f6]"
            />
            <div className="w-8 h-8 bg-[#1e293b] rounded-full flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm border-2 border-white">
              {user.email ? user.email[0] : "G"}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <>
              <div className="flex justify-end">
                <DemoBadge />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Recettes Jour"
                  value="245.000 FCFA"
                  change="+12.5%"
                  color="bg-blue-50"
                  textColor="text-blue-700"
                />
                <StatCard
                  title="Taux d'occupation"
                  value="78%"
                  change="+5%"
                  color="bg-gray-50"
                  textColor="text-slate-800"
                />
                <StatCard
                  title="Abonnés Présents"
                  value="42"
                  change="Stable"
                  color="bg-blue-50"
                  textColor="text-blue-700"
                />
                <StatCard
                  title="Paiements Wave/OM"
                  value="189.000 FCFA"
                  change="+20%"
                  color="bg- white-750"
                  textColor="text-blue"
                />
              </div>

              <MeteoDevisesWidget />

              <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-lg">Affluence PRO - MOVE</h3>
                  <span className="text-xs text-gray-400 font-medium">
                    Pic d'activité vers 14h00 (Plateau)
                  </span>
                </div>
                <div className="h-64 w-full flex items-end justify-between px-2 gap-4">
                  {[45, 60, 85, 95, 100, 75, 30].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-3 h-full justify-end"
                    >
                      <div
                        style={{ height: `${h}%` }}
                        className="w-full bg-[#3b82f6] rounded-t-lg opacity-80 hover:opacity-100 transition-all cursor-pointer relative group"
                      >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400">
                        {joursSemaine[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB: VÉHICULES (OPTIMISÉ POUR DAKAR) */}
          {activeTab === "vehicles" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#1e293b]">
                    Véhicules en Stationnement
                  </h2>
                  <p className="text-sm text-gray-400">
                    Zone Dakar Plateau & VDN
                  </p>
                  <DemoBadge />
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 shadow-sm transition-all">
                    <Download size={16} /> Rapport Journalier
                  </button>
                  <button className="bg-[#3b82f6] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all">
                    + Enregistrer Entrée
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] text-[11px] uppercase text-gray-400 font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Immatriculation</th>
                      <th className="px-6 py-4">Client / Catégorie</th>
                      <th className="px-6 py-4">Arrivée</th>
                      <th className="px-6 py-4">Durée</th>
                      <th className="px-6 py-4">Statut Paiement</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <VehicleRow
                      plate="DK-1288-BG"
                      model="Toyota Fortuner (Noir)"
                      owner="M. Abdoulaye Diallo"
                      type="Abonné Mensuel"
                      entryTime="07:45"
                      duration="6h 15m"
                      status="Réglé"
                      payMethod="Abonnement"
                    />
                    <VehicleRow
                      plate="TH-4502-A"
                      model="Ford Focus (Bleu)"
                      owner="Mme. Fatou Sow"
                      type="Passager"
                      entryTime="10:20"
                      duration="3h 40m"
                      status="En attente"
                      payMethod="Wave"
                    />
                    <VehicleRow
                      plate="LG-7731-C"
                      model="Peugeot 301 (Gris)"
                      owner="Service Livraison"
                      type="Professionnel"
                      entryTime="12:15"
                      duration="1h 45m"
                      status="Réglé"
                      payMethod="Espèces"
                    />
                    <VehicleRow
                      plate="DK-9901-AH"
                      model="Mercedes GLE (Blanc)"
                      owner="Dr. Cheikh Tidiane"
                      type="VIP / Médical"
                      entryTime="08:30"
                      duration="5h 30m"
                      status="Prioritaire"
                      payMethod="Contrat"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PLAN (ZONE DAKAR) */}
          {activeTab === "plan" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* En-tête avec les badges */}
              <div className="text-center py-6">
                <MapPin size={32} className="mx-auto text-blue-500 mb-2" />
                <h2 className="text-xl font-bold">Plan Interactif du Site</h2>
                <p className="text-gray-400 max-w-md mx-auto text-sm">
                  Visualisez en temps réel les places disponibles (Plateau /
                  VDN).
                </p>
                <div className="mt-4 inline-flex gap-4">
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    64 Libres
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    24 Occupées
                  </span>
                </div>
              </div>

              {/* --- INTÉGRATION DE LA CARTE RÉELLE --- */}
              <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                <ParkingMap />
              </div>
            </div>
          )}

          {/* TAB: HISTORIQUE */}
          {activeTab === "history" && (
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b border-gray-50 font-bold flex justify-between items-center">
                <span className="flex items-center gap-3">
                  Historique des Flux (Dakar) <DemoBadge />
                </span>
                <button className="text-[#3b82f6] text-sm">Voir tout</button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8fafc] text-[11px] uppercase text-gray-400 font-bold">
                  <tr>
                    <th className="px-6 py-4">Véhicule</th>
                    <th className="px-6 py-4">Mouvement</th>
                    <th className="px-6 py-4">Heure</th>
                    <th className="px-6 py-4">Montant</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  <HistoryRow
                    plate="DK-5521-F"
                    action="Sortie"
                    time="13:50"
                    amount="2.500 F"
                    type="warning"
                  />
                  <HistoryRow
                    plate="TH-1022-B"
                    action="Entrée"
                    time="13:42"
                    amount="0 F"
                    type="success"
                  />
                  <HistoryRow
                    plate="DK-0021-AH"
                    action="Sortie"
                    time="13:15"
                    amount="5.000 F"
                    type="warning"
                  />
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const MenuButton = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium ${
      active
        ? "bg-[#f1f5f9] text-[#3b82f6] font-bold shadow-sm"
        : "text-gray-500 hover:bg-[#f1f5f9]"
    }`}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ title, value, change, color, textColor }: any) => (
  <div
    className={`${color} p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow`}
  >
    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 opacity-70">
      {title}
    </p>
    <div className="flex items-center justify-between">
      <h3 className={`text-2xl font-black ${textColor}`}>{value}</h3>
      <span className="text-[10px] font-bold bg-white/40 px-2 py-0.5 rounded-full">
        {change}
      </span>
    </div>
  </div>
);

const HistoryRow = ({ plate, action, time, amount, type }: any) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 font-bold">{plate}</td>
    <td className="px-6 py-4">
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${type === "success" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
      >
        {action}
      </span>
    </td>
    <td className="px-6 py-4 text-gray-400">{time}</td>
    <td className="px-6 py-4 font-bold text-slate-700">{amount}</td>
  </tr>
);

const VehicleRow = ({
  plate,
  model,
  owner,
  type,
  entryTime,
  duration,
  status,
  payMethod,
}: any) => (
  <tr className="hover:bg-blue-50/30 transition-colors group">
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="font-black text-[#1e293b] text-base">{plate}</span>
        <span className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
          {model}
        </span>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-[#3b82f6]">
          {owner[0]}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-700">{owner}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            {type}
          </span>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{entryTime}</td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
        <Timer size={14} className="text-blue-500" /> {duration}
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col gap-1">
        <span
          className={`w-fit px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
            status === "Réglé"
              ? "bg-green-100 text-green-700"
              : status === "Prioritaire"
                ? "bg-purple-100 text-purple-700"
                : "bg-orange-100 text-orange-700"
          }`}
        >
          {status}
        </span>
        <span className="text-[9px] text-gray-400 font-bold ml-1 italic">
          {payMethod}
        </span>
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="p-2 hover:bg-white rounded-full transition-all text-gray-300 hover:text-blue-500 shadow-sm border border-transparent hover:border-gray-100">
        <MoreHorizontal size={18} />
      </button>
    </td>
  </tr>
);

export default Dashboard;
