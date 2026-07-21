import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            PRO<span className="text-blue-500">MOVE</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            La liberté de rouler, en toute simplicité. Location de véhicules à
            Dakar et partout au Sénégal.
          </p>
        </div>

        {/* Liens */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Navigation</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/apropos"
                className="hover:text-blue-400 transition-colors"
              >
                A propos
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-blue-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              📍 <span>Dakar, Sénégal</span>
            </li>
            <li className="flex items-center gap-2">
              📞 <span>+221 78 546 38 93</span>
            </li>
            <li className="flex items-center gap-2">
              ✉️ <span>promove221@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Suivez-nous</h3>
          <div className="flex flex-col space-y-3">
            <a
              href="https://www.facebook.com/" target="blank"
              className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors text-sm"
            >
              <div className="bg-blue-600 p-2 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold">
                f
              </div>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/" target="blank"
              className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors text-sm"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold">
                in
              </div>
              Instagram
            </a>
            <a
              href="" target="blank"
              className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors text-sm"
            >
              <div className="bg-green-500 p-2 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold">
                W
              </div>
              WhatsApp
            </a>
            <a
              href="https://www.linkedin.com/feed/" target="blank"
              className="flex items-center gap-3 text-gray-400 hover:text-blue-300 transition-colors text-sm"
            >
              <div className="bg-blue-400 p-2 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold">
                in
              </div>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="max-w-6xl mx-auto border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-gray-500 text-xs">
          © 2026 PROMOVE. Tous droits réservés.
        </p>
        <p className="text-gray-500 text-xs">
          Fait avec ❤️ au Sénégal
          <Link
            to="/connexionadmin"
            className="ml-1 hover:text-blue-400 transition-colors"
          >
            Espace Administrateur
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
