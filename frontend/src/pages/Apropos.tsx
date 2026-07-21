const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-6 mt-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          À propos de <span className="text-blue-500">PROMOVE</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Votre partenaire de confiance pour la location de véhicules au Sénégal
          depuis 2018.
        </p>
      </section>

      {/* Histoire */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Notre <span className="text-blue-500">histoire</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            PROMOVE est née en 2018 à Dakar, fondée par notre start up , des
            jeunes entrepreneurs passionnés par la mobilité urbaine en Afrique
            de l'Ouest. Partant d'une flotte de seulement 5 véhicules,
            l'entreprise a rapidement grandi pour répondre aux besoins
            croissants des particuliers et des professionnels.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Aujourd'hui, PROMOVE dispose d'une flotte de plus de 50 véhicules
            modernes et dessert Dakar, Thiès, Saint-Louis et bien d'autres
            villes du Sénégal. Notre mission reste la même : vous offrir la
            liberté de rouler, en toute simplicité.
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
              <p className="text-4xl font-bold text-blue-500">50+</p>
              <p className="text-gray-500 text-sm mt-1">
                Véhicules disponibles
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
              <p className="text-4xl font-bold text-blue-500">6</p>
              <p className="text-gray-500 text-sm mt-1">Ans d'expérience</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
              <p className="text-4xl font-bold text-blue-500">2k+</p>
              <p className="text-gray-500 text-sm mt-1">Clients satisfaits</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
              <p className="text-4xl font-bold text-blue-500">4</p>
              <p className="text-gray-500 text-sm mt-1">Villes couvertes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-blue-500 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Notre Mission</h2>
        <p className="text-blue-100 text-lg max-w-3xl mx-auto leading-relaxed">
          Rendre la mobilité accessible à tous les Sénégalais en proposant des
          véhicules de qualité à des prix compétitifs, avec un service rapide,
          fiable et disponible 7j/7.
        </p>
      </section>

      {/* Valeurs */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Nos <span className="text-blue-500">valeurs</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Confiance</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Nous construisons des relations durables basées sur la
              transparence et l'honnêteté avec chaque client.
            </p>
          </div>
          <div className="text-center p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Rapidité</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Votre véhicule disponible en moins de 30 minutes après
              confirmation de votre réservation.
            </p>
          </div>
          <div className="text-center p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Qualité</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Une flotte entretenue régulièrement pour vous garantir confort et
              sécurité à chaque trajet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
