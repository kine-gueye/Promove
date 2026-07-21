import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, type: ToastType) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const value: ToastContextValue = {
    success: (message) => push(message, "success"),
    error: (message) => push(message, "error"),
  };

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-[90vw] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-toast-in ${
              t.type === "success"
                ? "bg-[#1e293b]/95 border-emerald-400/30 text-white"
                : "bg-[#1e293b]/95 border-red-400/30 text-white"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium flex-1 leading-snug">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-white/50 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé à l'intérieur d'un <ToastProvider>");
  return ctx;
}
