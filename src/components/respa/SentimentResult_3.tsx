import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type SentimentType = "positive" | "negative" | "neutral";

interface SentimentResultProps {
  sentiment: SentimentType;
  confidence: number;
  text: string;
  onReset: () => void;
}

const sentimentConfig = {
  positive: {
    emoji: "😊",
    label: "Positivo",
    description: "El texto expresa emociones positivas",
    badgeClass: "bg-positive text-positive-foreground",
    progressClass: "bg-positive",
    gradientClass: "gradient-positive",
  },
  negative: {
    emoji: "😞",
    label: "Negativo",
    description: "El texto expresa emociones negativas",
    badgeClass: "bg-negative text-negative-foreground",
    progressClass: "bg-negative",
    gradientClass: "gradient-negative",
  },
  neutral: {
    emoji: "😐",
    label: "Neutral",
    description: "El texto no expresa emociones fuertes",
    badgeClass: "bg-neutral text-neutral-foreground",
    progressClass: "bg-neutral",
    gradientClass: "gradient-neutral",
  },
};

const SentimentResult = ({ sentiment, confidence, text, onReset }: SentimentResultProps) => {
  const config = sentimentConfig[sentiment];

  return (
    <Card className="w-full p-8 md:p-12 bg-card shadow-card border-0 rounded-2xl animate-scale-in">
      <div className="flex flex-col items-center text-center space-y-6">
        
        {/* Texto Analizado ARRIBA con animación */}
        <div 
          className="w-full max-w-2xl p-4 bg-secondary/50 rounded-xl animate-fade-in"
          style={{ 
            animationDelay: "0.1s",
            animation: "slide-down 0.6s ease-out forwards"
          }}
        >
          <p className="text-sm text-muted-foreground mb-2 font-medium">
            Texto analizado:
          </p>
          <p className="text-base md:text-lg text-foreground">
            "{text}"
          </p>
        </div>

        {/* Emoji Animado */}
        <div 
          className="text-7xl md:text-8xl relative"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Versión con múltiples animaciones según sentimiento */}
          {sentiment === "positive" && (
            <div className="animate-bounce">
              <div className="hover:scale-125 transition-transform duration-300 cursor-pointer">
                {config.emoji}
              </div>
            </div>
          )}
          
          {sentiment === "negative" && (
            <div 
              className="animate-pulse"
              style={{
                animation: "swing 2s ease-in-out infinite"
              }}
            >
              <div className="hover:scale-110 transition-transform duration-300 cursor-pointer">
                {config.emoji}
              </div>
            </div>
          )}
          
          {sentiment === "neutral" && (
            <div 
              style={{
                animation: "float 3s ease-in-out infinite"
              }}
            >
              <div className="hover:rotate-12 transition-transform duration-300 cursor-pointer">
                {config.emoji}
              </div>
            </div>
          )}
        </div>

        {/* Sentiment Label */}
        <div 
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Sentimiento Detectado
          </h2>
          <Badge 
            className={`text-lg md:text-xl px-6 py-2 font-semibold ${config.badgeClass}`}
          >
            {config.label}
          </Badge>
        </div>

        {/* Description */}
        <p 
          className="text-muted-foreground text-base md:text-lg animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          {config.description}
        </p>

        {/* Confidence Progress */}
        <div 
          className="w-full max-w-md space-y-3 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-muted-foreground">Nivel de Confianza</span>
            <span className="text-foreground font-bold text-lg">{confidence}%</span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className={`h-full ${config.gradientClass} transition-all duration-1000 ease-out rounded-full`}
              style={{ 
                width: `${confidence}%`,
                animation: "progress-fill 1s ease-out forwards"
              }}
            />
          </div>
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          className="mt-4 h-12 px-8 text-base font-medium
                     border-2 border-primary/30 text-primary
                     hover:bg-primary hover:text-primary-foreground
                     transition-all duration-300 rounded-xl
                     animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Analizar otro texto
        </Button>
      </div>

      {/* Estilos de animaciones personalizadas */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes float-small {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
      `}</style>
    </Card>
  );
};

export default SentimentResult;