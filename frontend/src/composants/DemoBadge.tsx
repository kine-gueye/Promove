import React from "react";

/**
 * Etiquette a placer en haut d'un onglet/section pour indiquer clairement
 * si les donnees affichees viennent reellement de l'API ou sont illustratives.
 */
const DemoBadge: React.FC<{ live?: boolean }> = ({ live = false }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
      live ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-emerald-500" : "bg-amber-500"}`} />
    {live ? "Données en temps réel" : "Données de démonstration"}
  </span>
);

export default DemoBadge;
