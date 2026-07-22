export enum BookingStatus {
  PENDING = 'pending', // Demande en attente de validation (manager/admin)
  CONFIRMED = 'confirmed', // Reservation confirmee, a venir
  ACTIVE = 'active', // Location en cours (vehicule chez le client)
  COMPLETED = 'completed', // Vehicule rendu, location terminee
  CANCELLED = 'cancelled', // Reservation annulee
}
