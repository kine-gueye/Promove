import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modale de confirmation reutilisable, remplace window.confirm().
 * Utilisation : <ConfirmDialog open={...} title="..." message="..." onConfirm={...} onCancel={...} />
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-toast-in">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
            danger ? "bg-red-50 text-red-500" : "bg-blue-50 text-[#3b82f6]"
          }`}
        >
          <AlertTriangle size={22} />
        </div>
        <h3 className="text-lg font-black text-[#1e293b] mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-colors ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-[#3b82f6] hover:bg-[#1e293b]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
