import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ConnexionClient from "./pages/ConnexionClient";
import ConnexionAdmin from "./pages/ConnexionAdmin";
import BarreNavigation from "./composants/BarreNavigation";
import Dashboard from "./pages/Dashboard";
import Footer from "./composants/Footer";
import Apropos from "./pages/Apropos";
import Contact from "./pages/Contact";
import DetailVoiture from "./pages/DetailVoiture";
import ForgotPassword from "./pages/ForgotPassword";
import Inscription from "./pages/Inscription";
import { ToastProvider } from "./composants/Toast";

function AppContent() {
  const location = useLocation();

  const currentPath = location.pathname.toLowerCase();

  // Liste des pages sans Nav
  const hideNavPages = [
    "/dashboard",
    "/connexionclient",
    "/connexionadmin",
    "/inscription",
    "/reinitialisation",
    "/forgotpassword",
  ];

  // Liste des pages sans Footer
  const hideFooterPages = ["/dashboard", "/connexionclient", "/connexionadmin"];

  // Comparaison
  const shouldShowNav = !hideNavPages.includes(currentPath);
  const shouldShowFooter = !hideFooterPages.includes(currentPath);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {shouldShowNav && <BarreNavigation />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connexionadmin" element={<ConnexionAdmin />} />
          <Route path="/connexionclient" element={<ConnexionClient />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/voiture/:id" element={<DetailVoiture />} />
          <Route path="/apropos" element={<Apropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/inscription" element={<Inscription />} />
        </Routes>
      </main>

      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
