"use client";

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  // Références pour le défilement fluide
  const sectionRefs = {
    hero: useRef(null),
    about: useRef(null),
    services: useRef(null),
    tarifs: useRef(null),
    testimonials: useRef(null),
    contact: useRef(null),
  };

  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Observer pour détecter la section active au défilement
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Récupération des avis Google
  useEffect(() => {
    fetchGoogleReviews();
  }, []);

  const fetchGoogleReviews = async () => {
    setIsLoading(true);
    try {
      // Dans un environnement de production, vous utiliseriez l'API réelle
      // const response = await fetch('/api/google-reviews');
      // const data = await response.json();
      
      // Pour l'instant, utilisation de données mock
      const mockReviews = [
        {
          name: "Maxence G.",
          text: "Fadia a fait preuve d'une grande qualité d'écoute et d'empathie ainsi que d'une excellente compréhension de ma situation. Les pistes de travail qu'elle m'a proposé se sont avérées être extrêmement pertinentes tant du point de vue de mon alimentation que de mon activité sportive, travaillant à la fois sur le corps et le mental. Suite au rendez-vous, elle m'a envoyé tous ces éléments sous la forme d'un programme d'hygiène vitale qui m'a permis de ne pas perdre le fil au quotidien. La clarté de son discours m'a permis de m'engager dans ce travail de fond pour mon bien-être ce dont je lui si extrêmement reconnaissant.",
          rating: 5,
          date: "3 Avril 2025"
        },
        {
          name: "Caroline A.",
          text: "Fadia est une personne à l'écoute, bienveillante et passionnée par son métier. Elle a pris son temps pour bien comprendre mes besoins et me proposer un programme d'hygiène vitale adapté. J'ai suivi ses recommandations à la lettre et j'en suis très satisfaite. Ses conseils m'ont vraiment été bénéfiques !",
          rating: 5,
          date: "10 Avril 2025"
        },
        {
          name: "Neila Prout",
          text: "Je consulte Fadia depuis plusieurs mois pour des problèmes digestifs persistants. Les conseils en naturopathie et micronutrition ont été d'une grande aide. Une professionnelle à l'écoute que je recommande vivement.",
          rating: 5,
          date: "10 Janvier 2023"
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Rotation automatique des témoignages
  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  // Gestion du bouton de rendez-vous pour éviter le double modal
  const handleRdvClick = (e) => {
    e.preventDefault(); 
    setShowModal(true);
  };

  // Initialisation de Google Maps
  useEffect(() => {
    // Chargement du script Google Maps si nécessaire
    if (!window.google) {
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=initMap&libraries=maps,marker&v=beta";
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
      
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      initMap();
    }
  }, []);

  function initMap() {
    if (typeof window !== 'undefined' && document.getElementById('google-map')) {
      // La carte sera initialisée par la balise gmp-map
      console.log('Google Maps loaded!');
    }
  }

  return (
    <main className="relative">
      <Head>
        <title>Fadia Benamar - Naturopathe & Micronutrition à Paris</title>
        <meta name="description" content="Fadia Benamar, naturopathe et experte en micronutrition à Paris, vous accompagne vers un mieux-être au naturel." />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Script pour Google Maps */}
        <script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=console.debug&libraries=maps,marker&v=beta"></script>
      </Head>

      {/* Bouton flottant pour prendre RDV */}
      <button 
        onClick={handleRdvClick}
        className="fixed bottom-8 right-8 z-40 bg-[#537E88] text-white p-4 rounded-full shadow-lg hover:bg-[#3A5B63] focus:outline-none transition-all duration-300"
        aria-label="Prendre rendez-vous"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="h-12 w-36 bg-[#537E88]/10 rounded flex items-center justify-center">
                  <span className="text-[#537E88] font-bold text-lg">Fadia Benamar</span>
                </div>
              </div>
            </Link>
            
            {/* Navigation Bureau */}
            <nav className="hidden md:flex space-x-1">
              <Link 
                href="#hero" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'hero' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600 hover:text-[#537E88]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sectionRefs.hero.current.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Accueil
              </Link>
              <Link 
                href="#about" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'about' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600 hover:text-[#537E88]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sectionRefs.about.current.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                À propos
              </Link>
              <Link 
                href="#services" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'services' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600 hover:text-[#537E88]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sectionRefs.services.current.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Services
              </Link>
              <Link 
                href="#tarifs" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'tarifs' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600 hover:text-[#537E88]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sectionRefs.tarifs.current.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Tarifs
              </Link>
              <Link 
                href="#testimonials" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'testimonials' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600 hover:text-[#537E88]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sectionRefs.testimonials.current.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Témoignages
              </Link>
              <Link 
                href="#contact" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'contact' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600 hover:text-[#537E88]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sectionRefs.contact.current.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact
              </Link>
            </nav>
            
            {/* Bouton RDV */}
            <div className="hidden md:block">
              <button 
                onClick={handleRdvClick}
                className="bg-[#537E88] hover:bg-[#3A5B63] text-white px-5 py-2 rounded-lg transition duration-300"
              >
                Prendre RDV
              </button>
            </div>
            
            {/* Hamburger menu pour mobile */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-[#537E88] focus:outline-none"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden bg-white shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-5 space-y-3">
                <Link 
                  href="#hero" 
                  className={`block py-2 px-4 rounded-lg ${
                    activeSection === 'hero' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sectionRefs.hero.current.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  Accueil
                </Link>
                <Link 
                  href="#about" 
                  className={`block py-2 px-4 rounded-lg ${
                    activeSection === 'about' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sectionRefs.about.current.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  À propos
                </Link>
                <Link 
                  href="#services" 
                  className={`block py-2 px-4 rounded-lg ${
                    activeSection === 'services' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sectionRefs.services.current.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  Services
                </Link>
                <Link 
                  href="#tarifs" 
                  className={`block py-2 px-4 rounded-lg ${
                    activeSection === 'tarifs' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sectionRefs.tarifs.current.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  Tarifs
                </Link>
                <Link 
                  href="#testimonials" 
                  className={`block py-2 px-4 rounded-lg ${
                    activeSection === 'testimonials' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sectionRefs.testimonials.current.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  Témoignages
                </Link>
                <Link 
                  href="#contact" 
                  className={`block py-2 px-4 rounded-lg ${
                    activeSection === 'contact' ? 'bg-[#F0EAE0] text-[#537E88]' : 'text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sectionRefs.contact.current.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  Contact
                </Link>
                <div className="pt-2">
                  <button 
                    onClick={(e) => {
                      handleRdvClick(e);
                      setIsMenuOpen(false);
                    }} 
                    className="bg-[#537E88] hover:bg-[#3A5B63] text-white w-full py-3 px-4 rounded-lg transition duration-300"
                  >
                    Prendre RDV
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section 
        id="hero" 
        ref={sectionRefs.hero}
        className="pt-32 pb-20 bg-gradient-to-b from-[#F0EAE0] to-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2 text-center md:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3A5B63] leading-tight mb-6">
                Retrouvez votre bien-être <span className="text-[#537E88]">naturellement</span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
                Naturopathe et experte en micronutrition à Paris. Je vous accompagne pour améliorer votre équilibre et votre vitalité grâce à des approches naturelles et personnalisées.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={handleRdvClick}
                  className="bg-[#537E88] hover:bg-[#3A5B63] text-white px-8 py-3 rounded-lg font-medium transition duration-300"
                >
                  Prendre rendez-vous
                </button>
                <button 
                  onClick={() => sectionRefs.about.current.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-[#537E88] text-[#537E88] hover:bg-[#F0EAE0] px-8 py-3 rounded-lg font-medium transition duration-300"
                >
                  En savoir plus
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full h-[400px] md:aspect-[3/4] md:h-auto rounded-lg overflow-hidden shadow-xl">
                {/* Version pour mobile - utilise une approche avec width/height fixes */}
                <div className="block md:hidden w-full h-full">
                  <Image 
                    src="/images/portraitfadia.JPG" 
                    alt="Fadia Benamar, Naturopathe" 
                    width={300}
                    height={400}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                </div>
                
                {/* Version pour tablette/desktop - utilise l'approche fill */}
                <div className="hidden md:block w-full h-full">
                  <Image 
                    src="/images/portraitfadia.JPG" 
                    alt="Fadia Benamar, Naturopathe" 
                    fill
                    sizes="(min-width: 768px) 500px, 100vw"
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>

            </motion.div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#F0EAE0] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3A5B63] mb-2">Bilan personnalisé</h3>
              <p className="text-gray-600">Évaluation complète de votre état de santé et établissement d{"'"}un plan d{"'"}action adapté.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#F0EAE0] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3A5B63] mb-2">Approche holistique</h3>
              <p className="text-gray-600">Considération globale de votre santé pour un équilibre physique et émotionnel.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#F0EAE0] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3A5B63] mb-2">Micronutrition</h3>
              <p className="text-gray-600">Expertise en besoins nutritionnels pour renforcer votre organisme.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#F0EAE0] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3A5B63] mb-2">Vitalité retrouvée</h3>
              <p className="text-gray-600">Accompagnement vers une énergie durable et un bien-être quotidien.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        ref={sectionRefs.about}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/fadiabureau.jpeg" 
                  alt="Bureau de consultation de Fadia - Naturopathie" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-[#F8F5F0] p-5 rounded-lg">
                  <h4 className="text-[#3A5B63] font-semibold text-lg mb-2">Formation</h4>
                  <p className="text-gray-600">Certifiée en naturopathie et micronutrition fonctionnelle.</p>
                </div>
                <div className="bg-[#F8F5F0] p-5 rounded-lg">
                  <h4 className="text-[#3A5B63] font-semibold text-lg mb-2">Expérience</h4>
                  <p className="text-gray-600">Plus de 10 ans dans l{"'"}accompagnement bien-être.</p>
                </div>
                <div className="bg-[#F8F5F0] p-5 rounded-lg">
                  <h4 className="text-[#3A5B63] font-semibold text-lg mb-2">Approche</h4>
                  <p className="text-gray-600">Personnalisée et adaptée à chaque individu.</p>
                </div>
                <div className="bg-[#F8F5F0] p-5 rounded-lg">
                  <h4 className="text-[#3A5B63] font-semibold text-lg mb-2">Passion</h4>
                  <p className="text-gray-600">Accompagner vers une santé durable et naturelle.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A5B63] mb-6">À propos de moi</h2>
              <div className="h-1 w-20 bg-[#537E88] mb-6"></div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Passionnée par les approches naturelles de la santé, j{"'"}ai consacré ma carrière à la naturopathie et à la micronutrition. Mon parcours m{"'"}a amenée à me spécialiser dans l{"'"}accompagnement personnalisé pour aider les personnes à retrouver leur vitalité et leur équilibre.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Ma formation en naturopathie, complétée par une expertise en micronutrition fonctionnelle, me permet d{"'"}avoir une vision globale de la santé. Je considère chaque personne comme unique, avec ses propres besoins et défis.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Mon approche allie les connaissances scientifiques modernes aux sagesses traditionnelles pour vous offrir un accompagnement complet et adapté à votre situation.
              </p>
              <button 
                onClick={handleRdvClick}
                className="bg-[#537E88] hover:bg-[#3A5B63] text-white px-8 py-3 rounded-lg font-medium transition duration-300"
              >
                Prendre rendez-vous
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="services" 
        ref={sectionRefs.services}
        className="py-20 bg-[#F8F5F0]"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A5B63]">Mes services</h2>
            <div className="h-1 w-20 bg-[#537E88] mx-auto my-6"></div>
            <p className="text-gray-600">
              Je propose une variété de services pour vous accompagner vers une meilleure santé et un équilibre optimal.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-48 bg-[#537E88]/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#3A5B63] mb-3">Bilan naturopathique</h3>
                <p className="text-gray-600 mb-4">
                  Une évaluation complète de votre état de santé pour établir un programme personnalisé visant à renforcer vos capacités d'auto-guérison et votre vitalité.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleRdvClick}
                    className="text-[#537E88] hover:text-[#3A5B63] font-medium transition-colors duration-300 flex items-center"
                  >
                    Prendre rendez-vous
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="h-48 bg-[#537E88]/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#3A5B63] mb-3">Suivi en micronutrition</h3>
                <p className="text-gray-600 mb-4">
                  Analyse des carences et déséquilibres micronutritionnels pour optimiser votre santé cellulaire et prévenir les pathologies liées à l{"'"}alimentation moderne.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleRdvClick}
                    className="text-[#537E88] hover:text-[#3A5B63] font-medium transition-colors duration-300 flex items-center"
                  >
                    Prendre rendez-vous
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="h-48 bg-[#537E88]/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#3A5B63] mb-3">Rééquilibrage alimentaire</h3>
                <p className="text-gray-600 mb-4">
                  Un plan nutritionnel sur mesure pour améliorer votre digestion, renforcer votre système immunitaire et retrouver votre poids de forme naturellement.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleRdvClick}
                    className="text-[#537E88] hover:text-[#3A5B63] font-medium transition-colors duration-300 flex items-center"
                  >
                    Prendre rendez-vous
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="h-48 bg-[#537E88]/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#3A5B63] mb-3">Gestion du stress</h3>
                <p className="text-gray-600 mb-4">
                  Techniques naturelles et conseils pratiques pour mieux gérer le stress quotidien et améliorer votre qualité de sommeil.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleRdvClick}
                    className="text-[#537E88] hover:text-[#3A5B63] font-medium transition-colors duration-300 flex items-center"
                  >
                    Prendre rendez-vous
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-48 bg-[#537E88]/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#3A5B63] mb-3">Revitalisation</h3>
                <p className="text-gray-600 mb-4">
                  Programme complet pour retrouver votre énergie, lutter contre la fatigue chronique et renforcer votre vitalité au quotidien.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleRdvClick}
                    className="text-[#537E88] hover:text-[#3A5B63] font-medium transition-colors duration-300 flex items-center"
                  >
                    Prendre rendez-vous
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="h-48 bg-[#537E88]/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#537E88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#3A5B63] mb-3">Accompagnement saisonnier</h3>
                <p className="text-gray-600 mb-4">
                  Préparation et soutien de l{"'"}organisme lors des changements de saison, avec conseils adaptés pour maintenir votre équilibre tout au long de l{"'"}année.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleRdvClick}
                    className="text-[#537E88] hover:text-[#3A5B63] font-medium transition-colors duration-300 flex items-center"
                  >
                    Prendre rendez-vous
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tarifs Section */}
      <section 
        id="tarifs" 
        ref={sectionRefs.tarifs}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A5B63]">Tarifs</h2>
            <div className="h-1 w-20 bg-[#537E88] mx-auto my-6"></div>
            <p className="text-gray-600">
              Des prestations adaptées à vos besoins avec un suivi personnalisé pour des résultats durables.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ translateY: -10 }}
            >
              <div className="bg-[#F0EAE0] py-6 px-8">
                <h3 className="text-xl font-bold text-[#3A5B63]">Première consultation</h3>
                <p className="text-[#537E88] text-2xl font-bold mt-2">120€</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Bilan naturopathique complet</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Programme d{"'"}hygiène de vie personnalisé</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Conseils en micronutrition</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Durée : 1h30</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={handleRdvClick}
                    className="w-full bg-[#537E88] hover:bg-[#3A5B63] text-white py-3 px-6 rounded-lg font-medium transition duration-300"
                  >
                    Prendre rendez-vous
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ translateY: -10 }}
            >
              <div className="bg-[#F0EAE0] py-6 px-8">
                <h3 className="text-xl font-bold text-[#3A5B63]">Consultation de suivi</h3>
                <p className="text-[#537E88] text-2xl font-bold mt-2">100€</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Évaluation des progrès</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Ajustement du programme</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Conseils personnalisés</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Durée : 1h</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={handleRdvClick}
                    className="w-full bg-[#537E88] hover:bg-[#3A5B63] text-white py-3 px-6 rounded-lg font-medium transition duration-300"
                  >
                    Prendre rendez-vous
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ translateY: -10 }}
            >
              <div className="bg-[#F0EAE0] py-6 px-8">
                <h3 className="text-xl font-bold text-[#3A5B63]">Pack 3 séances</h3>
                <p className="text-[#537E88] text-2xl font-bold mt-2">210€</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">1 bilan initial</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">2 séances de suivi</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Suivi par email</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Économie de 20€</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={handleRdvClick}
                    className="w-full bg-[#537E88] hover:bg-[#3A5B63] text-white py-3 px-6 rounded-lg font-medium transition duration-300"
                  >
                    Prendre rendez-vous
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="bg-[#F8F5F0] p-6 rounded-lg mt-12 text-center">
            <p className="text-gray-600">
              Les consultations peuvent être réalisées en cabinet ou à distance par visioconférence. <br />
              Les programmes et recommandations vous sont envoyés par email après chaque consultation.
            </p>
          </div>
        </div>
      </section>

{/* Testimonials Section - Intégration d'avis Google */}
<section 
  id="testimonials" 
  ref={sectionRefs.testimonials}
  className="py-20 bg-[#F8F5F0]"
>
  <div className="container mx-auto px-6">
    <motion.div 
      className="text-center max-w-2xl mx-auto mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A5B63]">Ce que mes clients disent</h2>
      <div className="h-1 w-20 bg-[#537E88] mx-auto my-6"></div>
      <p className="text-gray-600">
        Découvrez les témoignages de personnes que j{"'"}ai pu accompagner dans leur parcours vers une meilleure santé.
      </p>
    </motion.div>
    
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          animate={{ x: `-${activeTestimonial * 100}%` }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
        >
          {isLoading ? (
            <div className="min-w-full flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#537E88]"></div>
            </div>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="min-w-full px-4">
                <div className="bg-white p-8 pt-12 mt-8 rounded-lg shadow-md relative"> {/* Ajouté pt-12 et mt-8 */}
                  <div className="absolute -top-6 left-10 h-12 w-12 bg-[#537E88]/20 rounded-full flex items-center justify-center shadow-md border-2 border-white"> {/* Modifié -top-5 à -top-6, h-10/w-10 à h-12/w-12, ajouté shadow et border */}
                    <span className="text-[#3A5B63] font-bold">{review.name.charAt(0)}</span>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-[#3A5B63]">{review.name}</h4>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <svg 
                              key={star} 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-5 w-5 ${star < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="text-gray-400">{review.date}</div>
                    </div>
                    <p className="text-gray-600 italic line-clamp-none">
                      {'"'}{review.text}{'"'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
      
      {/* Navigation des témoignages */}
      <div className="flex justify-center mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTestimonial(index)}
            className={`w-3 h-3 mx-1 rounded-full transition-colors duration-300 ${
              activeTestimonial === index ? 'bg-[#537E88]' : 'bg-gray-300'
            }`}
            aria-label={`Voir le témoignage ${index + 1}`}
          />
        ))}
      </div>

      {/* Afficher plus d'avis */}
      <div className="text-center mt-8">
        <a
          href="https://maps.app.goo.gl/jHQ3osGG48rRkNjg6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#537E88] hover:text-[#3A5B63] font-medium transition-colors duration-300 inline-flex items-center"
        >
          Voir tous les avis sur Google
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>


      {/* Contact Section */}
      <section 
        id="contact" 
        ref={sectionRefs.contact}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A5B63]">Me contacter</h2>
            <p className="text-[#537E88] mt-2 max-w-2xl mx-auto">
              Pour toute question ou pour prendre rendez-vous
            </p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#F8F5F0] p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-[#3A5B63] mb-6">Informations de contact</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#537E88]/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3A5B63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3A5B63]">Adresse</h4>
                      <p className="text-gray-600 mt-1">9 rue la Vieuville, 75018 Paris</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#537E88]/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3A5B63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3A5B63]">Téléphone</h4>
                      <p className="text-gray-600 mt-1">07 65 52 59 00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#537E88]/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3A5B63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3A5B63]">Email</h4>
                      <p className="text-gray-600 mt-1">contact@fadianaturo.com</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-[#3A5B63] mb-4">Réseaux sociaux</h4>
                    <div className="flex space-x-4">
                      <a href="https://www.linkedin.com/in/fadia-benamar-77b6a915/" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full hover:bg-[#537E88] hover:text-white transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-white p-4 rounded-lg shadow-inner overflow-hidden">
                  <div style={{ height: '300px', width: '100%' }} className="relative rounded-lg overflow-hidden">
                    <div id="map-container" className="absolute inset-0">
                      {/* Google Maps intégration */}
                      <script
                        dangerouslySetInnerHTML={{
                          __html: `
                            function initMap() {
                              const map = new google.maps.Map(document.getElementById("map-container"), {
                                center: { lat: 48.88489532470703, lng: 2.3395562171936035 },
                                zoom: 15,
                                styles: [
                                  {
                                    "featureType": "landscape",
                                    "elementType": "all",
                                    "stylers": [{ "color": "#F8F5F0" }]
                                  }
                                ]
                              });
                              
                              const marker = new google.maps.Marker({
                                position: { lat: 48.88489532470703, lng: 2.3395562171936035 },
                                map: map,
                                title: "FADIA NATUROPATHIE & MICRONUTRITION"
                              });
                            }
                          `
                        }}
                      />
                      <script 
                        async 
                        defer
                        src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=initMap"
                      />
                      {/* Fallback pour Google Maps */}
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2623.607678355038!2d2.3369919768165097!3d48.884755098850285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66f231ce18b59%3A0xa7049b88004931f2!2sFADIA%20NATUROPATHIE%20%26%20MICRONUTRITION!5e0!3m2!1sfr!2sfr!4v1744886451250!5m2!1sfr!2sfr" 
                        width="100%" 
                        height="300" 
                        style={{border: 0}} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-[#3A5B63] mb-6">Envoyez-moi un message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#537E88] focus:border-transparent transition"
                        placeholder="Votre nom" 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#537E88] focus:border-transparent transition"
                        placeholder="Votre email" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#537E88] focus:border-transparent transition"
                      placeholder="Sujet de votre message" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={6} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#537E88] focus:border-transparent transition"
                      placeholder="Votre message"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-start">
                    <input 
                      id="privacy" 
                      type="checkbox" 
                      className="h-5 w-5 text-[#537E88] focus:ring-[#537E88] border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-gray-600">
                      J{"'"}accepte que mes données soient traitées dans le cadre de ma demande de contact
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-[#537E88] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3A5B63] focus:outline-none focus:ring-2 focus:ring-[#3A5B63] focus:ring-opacity-50 transition duration-300"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

{/* Footer Section */}
<footer className="bg-[#3A5B63] text-white">
  {/* Section principale */}
  <div className="container mx-auto px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Colonne 1 - Logo et informations */}
      <div className="space-y-6">
        <div className="w-48">
          <Image 
            src="/images/fadialogo.png" 
            alt="Logo Fadia Benamar Naturopathe" 
            width={180} 
            height={60} 
            className="h-auto w-full object-contain"
            priority
          />
        </div>
        <p className="text-sm leading-relaxed text-gray-200">
          Naturopathe certifiée, je vous accompagne vers un équilibre naturel et une santé optimale grâce à des approches holistiques personnalisées.
        </p>
        <div className="flex space-x-4">
          <a href="https://www.linkedin.com/in/fadia-benamar-77b6a915/" aria-label="LinkedIn" className="text-white hover:text-[#F8F5F0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Colonne 2 - Navigation rapide */}
      <div className="md:mx-auto">
        <h3 className="text-lg font-bold mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Navigation
        </h3>
        <ul className="space-y-3">
          <li>
            <a 
              href="#accueil" 
              onClick={(e) => handleNavClick(e, 'accueil')}
              className="text-gray-200 hover:text-white hover:underline transition-all flex items-center"
            >
              <span className="text-[#E2C2B3] mr-2">›</span> Accueil
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-gray-200 hover:text-white hover:underline transition-all flex items-center"
            >
              <span className="text-[#E2C2B3] mr-2">›</span> À propos
            </a>
          </li>
          <li>
            <a 
              href="#services" 
              onClick={(e) => handleNavClick(e, 'services')}
              className="text-gray-200 hover:text-white hover:underline transition-all flex items-center"
            >
              <span className="text-[#E2C2B3] mr-2">›</span> Prestations
            </a>
          </li>
          <li>
            <a 
              href="#testimonials" 
              onClick={(e) => handleNavClick(e, 'testimonials')}
              className="text-gray-200 hover:text-white hover:underline transition-all flex items-center"
            >
              <span className="text-[#E2C2B3] mr-2">›</span> Témoignages
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-gray-200 hover:text-white hover:underline transition-all flex items-center"
            >
              <span className="text-[#E2C2B3] mr-2">›</span> Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Colonne 3 - Contact */}
      <div>
        <h3 className="text-lg font-bold mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-1 text-[#E2C2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-gray-200">
                Fadia Naturo<br />
                9 rue la Vieuville<br />
                75018 Paris
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#E2C2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:+33665742549" className="text-gray-200 hover:text-white hover:underline">07 65 52 59 00</a>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#E2C2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:fadia.naturopathe@gmail.com" className="text-gray-200 hover:text-white hover:underline">contact@fadianaturo.com</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Copyright */}
  <div className="py-4 border-t border-[#4C6971] bg-[#334F56]">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="text-sm text-gray-300 mb-4 md:mb-0">
        © {new Date().getFullYear()} Fadia Benamar, Naturopathe. Tous droits réservés.
      </div>
      <div className="text-sm text-gray-300">
        <a href="/mentions-legales" className="hover:text-white hover:underline mx-2">Mentions légales</a>
        <span className="mx-2">|</span>
        <a href="/politique-de-confidentialite" className="hover:text-white hover:underline mx-2">Politique de confidentialité</a>
      </div>
    </div>
  </div>
</footer>



      {/* Modal de Rendez-vous */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-xl z-50 w-11/12 max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h3 className="text-2xl font-bold text-[#3A5B63] mb-6">Prendre rendez-vous</h3>
              
              <div className="space-y-6">
                <div>
                  <a 
                    href="https://www.crenolibre.fr/prendre-rdv/115731_benamar-fadia"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-[#537E88] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3A5B63] focus:outline-none transition duration-300 flex items-center justify-center"
                    onClick={() => setShowModal(false)}
                  >
                    Via Crénolibre
                    <svg className="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                
                <div className="text-center text-gray-500">ou</div>
                
                <div>
                  <a 
                    href="tel:+33600000000"
                    className="w-full border border-[#537E88] text-[#537E88] py-3 px-6 rounded-lg font-medium hover:bg-[#F0EAE0] focus:outline-none transition duration-300 flex items-center justify-center"
                    onClick={() => setShowModal(false)}
                  >
                    Par téléphone
                    <svg className="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500 text-center">
                Les rendez-vous peuvent être pris en cabinet ou en visioconférence.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}


// Fonction de gestion des clics pour le rendez-vous
function handleRdvClick(e) {
  const isExternalLink = e.currentTarget.hasAttribute('href') && 
                         e.currentTarget.getAttribute('href').startsWith('http');
                         
  // Si c'est un lien externe direct, on laisse le comportement par défaut
  if (isExternalLink) {
    // Ouvrir dans un nouvel onglet
    const newWindow = window.open('https://www.crenolibre.fr/prendre-rdv/115731_benamar-fadia', '_blank');
    newWindow.focus();
    
    // Empêcher l'ouverture de la modal
    e.stopPropagation();
    return;
  }
  
  // Sinon, on montre la modal
  e.preventDefault();
  setShowModal(true);
}
