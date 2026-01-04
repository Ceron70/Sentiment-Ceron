import { Brain } from "lucide-react";

const SentimentHeader = () => {
  return (
    <header className="w-full gradient-primary py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Partículas de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      <div className="container max-w-4xl mx-auto text-center relative z-10">
        {/* Ícono cerebro con animación de pulso */}
        <div className="flex items-center justify-center mb-6 animate-fade-in">
          <div className="p-4 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm border border-primary-foreground/20 animate-pulse-slow hover:scale-110 transition-transform duration-300">
            <Brain className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground animate-brain-pulse" />
          </div>
        </div>

        {/* Título con gradiente animado */}
        <h1 
          className="text-3xl md:text-5xl font-extrabold mb-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="inline-block bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] hover:scale-105 transition-transform duration-300">
            Análisis de Sentimiento ML
          </span>
        </h1>

        {/* Subtítulo con efecto de aparición */}
        <p 
          className="text-lg md:text-xl text-primary-foreground/90 font-medium animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Detecta emociones en texto usando{" "}
          <span className="font-bold text-primary-foreground animate-pulse inline-block">
            Machine Learning
          </span>
        </p>
      </div>

      {/* Estilos personalizados */}
      <style>{`
        /* Animación de gradiente en el título */
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        /* Animación del cerebro */
        @keyframes brain-pulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
          }
          50% { 
            transform: scale(1.05);
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
          }
        }

        .animate-brain-pulse {
          animation: brain-pulse 2s ease-in-out infinite;
        }

        /* Pulso lento para el contenedor del cerebro */
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        /* Fade in con movimiento hacia arriba */
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        /* Partículas flotantes de fondo */
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          pointer-events: none;
        }

        .particle-1 {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 10%;
          animation: float-particle 8s ease-in-out infinite;
        }

        .particle-2 {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 15%;
          animation: float-particle 6s ease-in-out infinite reverse;
        }

        .particle-3 {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          animation: float-particle 10s ease-in-out infinite;
          animation-delay: 2s;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -20px) rotate(90deg);
            opacity: 0.5;
          }
          50% {
            transform: translate(-20px, 20px) rotate(180deg);
            opacity: 0.3;
          }
          75% {
            transform: translate(20px, 20px) rotate(270deg);
            opacity: 0.5;
          }
        }
      `}</style>
    </header>
  );
};

export default SentimentHeader;