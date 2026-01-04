import { RefreshCw, Copy, Share2, Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

  // Calcular estadísticas del texto
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Función para copiar resultado
  const handleCopy = () => {
    const resultText = `Texto: "${text}"\nSentimiento: ${config.label}\nConfianza: ${confidence}%`;
    navigator.clipboard.writeText(resultText);
    toast.success("Resultado copiado al portapapeles");
  };

  // Función para compartir
  const handleShare = async () => {
    const shareData = {
      title: 'Análisis de Sentimiento ML',
      text: `Analicé: "${text}" - Resultado: ${config.label} (${confidence}% confianza)`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Compartido exitosamente");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error("Error al compartir");
        }
      }
    } else {
      handleCopy();
      toast.info("Resultado copiado para compartir");
    }
  };

  // Función para descargar como texto
  const handleDownload = () => {
    const content = `ANÁLISIS DE SENTIMIENTO\n\nTexto analizado:\n"${text}"\n\nResultado: ${config.label}\nConfianza: ${confidence}%\nPalabras: ${wordCount}\nCaracteres: ${charCount}\n\nFecha: ${new Date().toLocaleString('es-ES')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisis-sentimiento-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Archivo descargado");
  };

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
          style={{ animationDelay: "0.3s" }}
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
          style={{ animationDelay: "0.4s" }}
        >
          {config.description}
        </p>

        {/* Confidence Progress */}
        <div 
          className="w-full max-w-md space-y-3 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
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

        {/* Estadísticas del Texto */}
        <div 
          className="grid grid-cols-3 gap-3 w-full max-w-md animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="text-center p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
            <p className="text-2xl font-bold text-foreground">{wordCount}</p>
            <p className="text-xs text-muted-foreground">Palabras</p>
          </div>
          <div className="text-center p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
            <p className="text-2xl font-bold text-foreground">{charCount}</p>
            <p className="text-xs text-muted-foreground">Caracteres</p>
          </div>
          <div className="text-center p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
            <p className="text-2xl font-bold text-foreground">{sentenceCount}</p>
            <p className="text-xs text-muted-foreground">Frases</p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div 
          className="flex flex-wrap gap-3 justify-center animate-fade-in"
          style={{ animationDelay: "0.7s" }}
        >
          <Button
            variant="outline"
            onClick={handleCopy}
            className="h-11 px-5 hover:bg-secondary transition-all duration-300"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="h-11 px-5 hover:bg-secondary transition-all duration-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
          
          <Button
            variant="outline"
            onClick={handleDownload}
            className="h-11 px-5 hover:bg-secondary transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
        </div>

        {/* Info adicional */}
        <div 
          className="text-xs text-muted-foreground p-3 bg-secondary/20 rounded-lg w-full max-w-md animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>Análisis realizado con IA</span>
          </div>
          <p className="text-center">
            {new Date().toLocaleString('es-ES')}
          </p>
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
          style={{ animationDelay: "0.9s" }}
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