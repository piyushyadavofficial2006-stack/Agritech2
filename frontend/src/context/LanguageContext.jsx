import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: 'AgriTech',
    appTagline: 'Smart Farming Management System',
    navDashboard: 'Dashboard',
    navFarms: 'My Farms',
    navCrops: 'Crop Tracking',
    navSoil: 'Soil Analysis',
    navWeather: 'Weather & Advisory',
    navPests: 'Pest Alerts',
    navMarketplace: 'Agri Store',
    navOrders: 'My Orders',
    navForum: 'Expert Forum',
    navAdmin: 'Admin Center',
    login: 'Sign In',
    register: 'Register',
    logout: 'Sign Out',
    welcomeBack: 'Welcome back',
    roleFarmer: 'Farmer',
    roleAdmin: 'Administrator',
    roleExpert: 'Agri Expert',

    // Dashboard
    activeFarms: 'Active Farms',
    monitoredCrops: 'Monitored Crops',
    healthyRate: 'Crop Health Rate',
    weatherTemp: 'Current Temperature',
    soilHealthIndex: 'Soil Health Status',
    recentAlerts: 'Active Pest & Weather Warnings',
    viewAll: 'View All',
    addNewFarm: 'Add New Farm',
    addNewCrop: 'Register Crop',

    // Soil
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    soilMoisture: 'Soil Moisture',
    soilPh: 'Soil pH Level',
    soilDiagnosis: 'Soil Health Assessment',
    idealRange: 'Ideal Range',

    // Weather & Alerts
    sprayingSafety: 'Chemical Spraying Condition',
    irrigationAdvice: 'Irrigation Advisory',
    windSpeed: 'Wind Speed',
    humidity: 'Relative Humidity',
    rainProbability: 'Precipitation Chance',

    // Marketplace
    addToCart: 'Add to Cart',
    cart: 'Cart',
    checkout: 'Checkout',
    total: 'Total',
    orderSuccess: 'Order Placed Successfully!',
    deliveryAddress: 'Delivery Address'
  },
  hi: {
    appName: 'एग्रीटेक',
    appTagline: 'स्मार्ट कृषि प्रबंधन प्रणाली',
    navDashboard: 'डैशबोर्ड',
    navFarms: 'मेरे खेत',
    navCrops: 'फसल निगरानी',
    navSoil: 'मिट्टी परीक्षण',
    navWeather: 'मौसम व सलाह',
    navPests: 'कीट चेतावनी',
    navMarketplace: 'कृषि बाज़ार',
    navOrders: 'मेरे ऑर्डर',
    navForum: 'विशेषज्ञ मंच',
    navAdmin: 'प्रबंधन केंद्र',
    login: 'लॉग इन करें',
    register: 'पंजीकरण करें',
    logout: 'लॉग आउट',
    welcomeBack: 'नमस्ते',
    roleFarmer: 'किसान',
    roleAdmin: 'प्रशासक',
    roleExpert: 'कृषि विशेषज्ञ',

    // Dashboard
    activeFarms: 'सक्रिय खेत',
    monitoredCrops: 'निगरानी में फसलें',
    healthyRate: 'फसल स्वास्थ्य दर',
    weatherTemp: 'वर्तमान तापमान',
    soilHealthIndex: 'मिट्टी की स्थिति',
    recentAlerts: 'सक्रिय कीट व मौसम चेतावनियां',
    viewAll: 'सभी देखें',
    addNewFarm: 'नया खेत जोड़ें',
    addNewCrop: 'फसल दर्ज करें',

    // Soil
    nitrogen: 'नाइट्रोजन (N)',
    phosphorus: 'फास्फोरस (P)',
    potassium: 'पोटेशियम (K)',
    soilMoisture: 'मिट्टी की नमी',
    soilPh: 'मिट्टी का pH स्तर',
    soilDiagnosis: 'मिट्टी स्वास्थ्य मूल्यांकन',
    idealRange: 'आदर्श सीमा',

    // Weather & Alerts
    sprayingSafety: 'कीटनाशक छिड़काव स्थिति',
    irrigationAdvice: 'सिंचाई परामर्श',
    windSpeed: 'हवा की गति',
    humidity: 'आर्द्रता',
    rainProbability: 'बारिश की संभावना',

    // Marketplace
    addToCart: 'कार्ट में जोड़ें',
    cart: 'कार्ट',
    checkout: 'खरीदारी पूरी करें',
    total: 'कुल राशि',
    orderSuccess: 'ऑर्डर सफलतापूर्वक दर्ज हुआ!',
    deliveryAddress: 'डिलीवरी का पता'
  },
  es: {
    appName: 'AgriTech',
    appTagline: 'Sistema de Gestión Agrícola Inteligente',
    navDashboard: 'Panel Principal',
    navFarms: 'Mis Fincas',
    navCrops: 'Cultivos',
    navSoil: 'Análisis de Suelo',
    navWeather: 'Clima y Asesoría',
    navPests: 'Alertas de Plagas',
    navMarketplace: 'Tienda Agrícola',
    navOrders: 'Mis Pedidos',
    navForum: 'Foro de Expertos',
    navAdmin: 'Panel Admin',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    welcomeBack: 'Bienvenido de nuevo',
    roleFarmer: 'Agricultor',
    roleAdmin: 'Administrador',
    roleExpert: 'Experto Agrónomo',

    // Dashboard
    activeFarms: 'Fincas Activas',
    monitoredCrops: 'Cultivos Monitoreados',
    healthyRate: 'Tasa de Salud',
    weatherTemp: 'Temperatura Actual',
    soilHealthIndex: 'Estado del Suelo',
    recentAlerts: 'Alertas de Plagas y Clima',
    viewAll: 'Ver Todo',
    addNewFarm: 'Nueva Finca',
    addNewCrop: 'Registrar Cultivo',

    // Soil
    nitrogen: 'Nitrógeno (N)',
    phosphorus: 'Fósforo (P)',
    potassium: 'Potasio (K)',
    soilMoisture: 'Humedad del Suelo',
    soilPh: 'Nivel de pH',
    soilDiagnosis: 'Evaluación del Suelo',
    idealRange: 'Rango Ideal',

    // Weather & Alerts
    sprayingSafety: 'Condición de Fumigación',
    irrigationAdvice: 'Aviso de Riego',
    windSpeed: 'Velocidad del Viento',
    humidity: 'Humedad Relativa',
    rainProbability: 'Probabilidad de Lluvia',

    // Marketplace
    addToCart: 'Añadir al Carrito',
    cart: 'Carrito',
    checkout: 'Comprar',
    total: 'Total',
    orderSuccess: '¡Pedido Realizado con Éxito!',
    deliveryAddress: 'Dirección de Entrega'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('agritech_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('agritech_lang', lang);
  }, [lang]);

  const t = (key) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
