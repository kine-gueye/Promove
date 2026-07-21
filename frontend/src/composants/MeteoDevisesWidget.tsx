import React, { useEffect, useState } from "react";
import { Cloud, Droplets, TrendingUp } from "lucide-react";
import { WeatherApi, CurrencyApi } from "../services/api";
import DemoBadge from "./DemoBadge";

interface WeatherData {
  city: string;
  country?: string;
  temperature: number;
  humidity: number;
  description?: string;
}

/**
 * Widget "Meteo & Devises" - consomme les deux API externes du projet
 * (OpenWeather + ExchangeRate) pour le tableau de bord PROMOVE.
 */
const MeteoDevisesWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState("");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [ratesError, setRatesError] = useState("");

  useEffect(() => {
    WeatherApi.get("Dakar")
      .then(setWeather)
      .catch((err) => setWeatherError(err.message));

    CurrencyApi.rates("XOF")
      .then((res) => setRates(res.rates))
      .catch((err) => setRatesError(err.message));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Meteo (OpenWeather) */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-[#1e293b] flex items-center gap-2">
            <Cloud size={18} className="text-[#3b82f6]" /> Météo — Dakar
          </h3>
          <DemoBadge live />
        </div>

        {weatherError && <p className="text-xs text-red-500 font-medium">{weatherError}</p>}

        {!weatherError && !weather && (
          <p className="text-xs text-gray-400 font-bold uppercase">Chargement...</p>
        )}

        {weather && (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-black text-[#1e293b]">{Math.round(weather.temperature)}°</p>
              <p className="text-sm text-gray-400 font-medium capitalize">{weather.description}</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-400 font-bold">
              <Droplets size={14} /> {weather.humidity}%
            </div>
          </div>
        )}
      </div>

      {/* Devises (ExchangeRate) */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-[#1e293b] flex items-center gap-2">
            <TrendingUp size={18} className="text-[#3b82f6]" /> Taux de change
          </h3>
          <DemoBadge live />
        </div>

        {ratesError && <p className="text-xs text-red-500 font-medium">{ratesError}</p>}

        {!ratesError && !rates && (
          <p className="text-xs text-gray-400 font-bold uppercase">Chargement...</p>
        )}

        {rates && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">1 000 XOF → EUR</span>
              <span className="font-black text-[#1e293b]">
                {rates.EUR ? (rates.EUR * 1000).toFixed(2) : "—"} €
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">1 000 XOF → USD</span>
              <span className="font-black text-[#1e293b]">
                {rates.USD ? (rates.USD * 1000).toFixed(2) : "—"} $
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeteoDevisesWidget;
