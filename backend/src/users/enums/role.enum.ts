export enum Role {
  ADMIN = 'admin', // Gere tout : voitures, utilisateurs, reservations
  MANAGER = 'manager', // Gere le catalogue de voitures et les reservations
  CLIENT = 'client', // Client final : reserve des voitures, laisse des avis
}
