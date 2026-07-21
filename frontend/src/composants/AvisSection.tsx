import React, { useEffect, useState } from "react";
import { Star, MessageSquareText } from "lucide-react";
import { Auth, ReviewsApi, type Review } from "../services/api";
import { useToast } from "./Toast";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

const AvisSection: React.FC<{ carId: string }> = ({ carId }) => {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    ReviewsApi.listByCar(carId)
      .then(setReviews)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Auth.isLoggedIn()) {
      toast.error("Connectez-vous pour laisser un avis.");
      return;
    }

    setSubmitting(true);
    try {
      await ReviewsApi.create({ carId, rating, comment: comment.trim() || undefined });
      toast.success("Merci pour votre avis !");
      setComment("");
      setRating(5);
      loadReviews();
    } catch (err) {
      // Le backend refuse si le client n'a jamais reserve ce vehicule
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-black text-[#1e293b] mb-8">Avis des clients</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Liste des avis */}
        <div className="space-y-4">
          {loading && <p className="text-gray-400 font-bold uppercase text-sm">Chargement des avis...</p>}

          {!loading && reviews.length === 0 && (
            <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-6 text-gray-400">
              <MessageSquareText size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                Aucun avis pour le moment. Soyez le premier à partager votre expérience avec ce véhicule.
              </p>
            </div>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "fill-[#3b82f6] text-[#3b82f6]" : "text-gray-200"}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 font-bold">{formatDate(review.createdAt)}</span>
              </div>
              {review.comment && <p className="text-sm text-gray-600 leading-relaxed mb-2">{review.comment}</p>}
              <p className="text-[11px] font-black text-[#3b82f6] uppercase tracking-wide">
                {review.user ? `${review.user.firstName} ${review.user.lastName[0]}.` : "Client PROMOVE"}
              </p>
            </div>
          ))}
        </div>

        {/* Formulaire pour laisser un avis */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 h-fit space-y-4">
          <h3 className="font-black text-[#1e293b]">Laisser un avis</h3>
          <p className="text-xs text-gray-400">Réservé aux clients ayant déjà réservé ce véhicule.</p>

          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="p-1"
                aria-label={`${i + 1} étoile${i > 0 ? "s" : ""}`}
              >
                <Star size={22} className={i < rating ? "fill-[#3b82f6] text-[#3b82f6]" : "text-gray-200"} />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre expérience avec ce véhicule..."
            rows={3}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3b82f6] focus:bg-white transition-all resize-none"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#3b82f6] hover:bg-[#1e293b] text-white font-bold py-3 rounded-2xl transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
          >
            {submitting ? "Envoi..." : "Publier l'avis"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AvisSection;
