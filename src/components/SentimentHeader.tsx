import { Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ui/theme-toggle";

const SentimentHeader = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="w-full gradient-primary py-8 md:py-12 px-4 relative overflow-hidden">
      {/* Partículas de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Fecha y Hora + Theme Toggle - Esquina superior derecha */}
        <div className="absolute top-0 right-0 flex items-start gap-2 animate-fade-in">
          {/* Theme Toggle Button */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg p-2 hover:bg-primary-foreground/20 transition-all duration-300">
            <ThemeToggle />
          </div>
          
          {/* Fecha y Hora */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg px-3 py-2">
            <p className="text-primary-foreground/90 text-xs font-medium">
              {formatDate(currentDateTime)}
            </p>
            <p className="text-primary-foreground font-bold text-sm tabular-nums">
              {formatTime(currentDateTime)}
            </p>
          </div>
        </div>

        {/* Contenido central compacto */}
        <div className="text-center pt-2">
          {/* Ícono cerebro */}
          <div className="flex items-center justify-center mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="p-3 bg-red-500/20 rounded-xl backdrop-blur-sm border border-red-400/30 animate-pulse-slow hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/20">
              <Brain className="w-10 h-10 md:w-12 md:h-12 text-red-500 animate-brain-pulse" strokeWidth={2.5} />
            </div>
          </div>

          {/* Título con gradiente animado */}
          <h1 
            className="text-2xl md:text-4xl font-extrabold mb-3 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="inline-block bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] hover:scale-105 transition-transform duration-300">
              Análisis de Sentimiento ML
            </span>
          </h1>

          {/* Subtítulo */}
          <p 
            className="text-base md:text-lg text-primary-foreground/90 font-medium animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Detecta emociones en texto usando{" "}
            <span className="font-bold text-primary-foreground animate-pulse inline-block">
              Machine Learning
            </span>
          </p>
        </div>
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

        /* Animación del cerebro con efecto rojo */
        @keyframes brain-pulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.6));
          }
          50% { 
            transform: scale(1.08);
            filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8));
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
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation: float-particle 8s ease-in-out infinite;
        }

        .particle-2 {
          width: 50px;
          height: 50px;
          top: 60%;
          right: 15%;
          animation: float-particle 6s ease-in-out infinite reverse;
        }

        .particle-3 {
          width: 60px;
          height: 60px;
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