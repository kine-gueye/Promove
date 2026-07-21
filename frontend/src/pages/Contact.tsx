import { useState, useRef } from "react";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    ville: "",
    message: "",
    service: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      console.log("Données du formulaire simulé :", form);
    }, 1500);

  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-bounce-in p-10 bg-white rounded-3xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Message envoyé !
          </h2>
          <p className="text-gray-500">
            Nous vous répondrons dans les 24h. Merci {form.nom} !
          </p>
          <button
            onClick={() => {
              setSent(false);
              setForm({
                nom: "",
                email: "",
                telephone: "",
                ville: "",
                message: "",
                service: "",
              });
            }}
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
          >
            Nouveau message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-4  mt-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Contactez <span className="text-blue-500">PROMOVE</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Une question ? Une réservation ? Remplissez le formulaire et nous vous
          répondons rapidement.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Infos contact */}
        <div className="space-y-4">
          {[
            { icon: "📍", titre: "Adresse", info: "Dakar, Sénégal" },
            { icon: "📞", titre: "Téléphone", info: "+221 78 546 38 93" },
            { icon: "✉️", titre: "Email", info: "promove221@gmail.com" },
            { icon: "⏰", titre: "Disponibilité", info: "7j/7 — 8h à 20h" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              <div className="text-2xl">{item.icon}</div>
              <div>
                <p className="text-xs text-gray-400">{item.titre}</p>
                <p className="text-sm font-medium text-gray-800">{item.info}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-lg p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {/* Nom & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${focused === "nom" || form.nom ? "top-1 text-xs text-blue-500" : "top-4 text-sm text-gray-400"}`}
                >
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  onFocus={() => setFocused("nom")}
                  onBlur={() => setFocused(null)}
                  required
                  className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 ${focused === "nom" ? "border-blue-500 shadow-md shadow-blue-100" : "border-gray-200"}`}
                />
              </div>
              <div className="relative">
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${focused === "email" || form.email ? "top-1 text-xs text-blue-500" : "top-4 text-sm text-gray-400"}`}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                  className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 ${focused === "email" ? "border-blue-500 shadow-md shadow-blue-100" : "border-gray-200"}`}
                />
              </div>
            </div>

            {/* Téléphone & Ville */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${focused === "telephone" || form.telephone ? "top-1 text-xs text-blue-500" : "top-4 text-sm text-gray-400"}`}
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  onFocus={() => setFocused("telephone")}
                  onBlur={() => setFocused(null)}
                  className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 ${focused === "telephone" ? "border-blue-500 shadow-md shadow-blue-100" : "border-gray-200"}`}
                />
              </div>
              <div className="relative">
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${focused === "ville" || form.ville ? "top-1 text-xs text-blue-500" : "top-4 text-sm text-gray-400"}`}
                >
                  Ville
                </label>
                <input
                  type="text"
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  onFocus={() => setFocused("ville")}
                  onBlur={() => setFocused(null)}
                  className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 ${focused === "ville" ? "border-blue-500 shadow-md shadow-blue-100" : "border-gray-200"}`}
                />
              </div>
            </div>

            {/* Service */}
            <div className="relative">
              <label className="block text-xs text-gray-400 mb-1 ml-1">
                Type de service *
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-blue-500 focus:shadow-md focus:shadow-blue-100 bg-white text-gray-700"
              >
                <option value="">Choisissez un service...</option>
                <option value="Location courte durée">
                  Location courte durée
                </option>
                <option value="Location longue durée">
                  Location longue durée
                </option>
                <option value="Location avec chauffeur">
                  Location avec chauffeur
                </option>
                <option value="Transfert aéroport">Transfert aéroport</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Message */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${focused === "message" || form.message ? "top-1 text-xs text-blue-500" : "top-4 text-sm text-gray-400"}`}
              >
                Votre message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                required
                rows={4}
                className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 resize-none ${focused === "message" ? "border-blue-500 shadow-md shadow-blue-100" : "border-gray-200"}`}
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer le message 🚀"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
