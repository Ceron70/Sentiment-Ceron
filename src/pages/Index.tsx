import { useState } from "react";
import SentimentHeader from "@/components/SentimentHeader";
import SentimentForm from "@/components/SentimentForm";
import SentimentResult, { SentimentType } from "@/components/SentimentResult";
import { toast } from "sonner";

interface AnalysisResult {
  sentiment: SentimentType;
  confidence: number;
  text: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    prevision: "Positivo" | "Negativo" | "Neutral";
    probabilidad: number;
  };
  message: string;
}

interface AnalysisRecord {
  id: string;
  text: string;
  sentiment: SentimentType;
  confidence: number;
  timestamp: number;
  date: string;
}

const mapPrevisionToSentiment = (prevision: string): SentimentType => {
  switch (prevision.toLowerCase()) {
    case "positivo":
      return "positive";
    case "negativo":
      return "negative";
    default:
      return "neutral";
  }
};

// Función para guardar análisis en localStorage
const saveAnalysisToHistory = (text: string, sentiment: SentimentType, confidence: number) => {
  try {
    const stored = localStorage.getItem("sentiment-analyses");
    const analyses: AnalysisRecord[] = stored ? JSON.parse(stored) : [];
    
    const newAnalysis: AnalysisRecord = {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.substring(0, 200), // Guardar solo primeros 200 caracteres
      sentiment,
      confidence,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    
    analyses.push(newAnalysis);
    
    // Mantener solo los últimos 100 análisis
    if (analyses.length > 100) {
      analyses.splice(0, analyses.length - 100);
    }
    
    localStorage.setItem("sentiment-analyses", JSON.stringify(analyses));
  } catch (error) {
    console.error("Error saving to history:", error);
  }
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeSentiment = async (text: string) => {
    setIsLoading(true);
    
    try {
      // Intentar con la API real
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
      
      const response = await fetch("https://sentiment-tech-api.onrender.com/api/v1/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("API no disponible");
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      const sentiment = mapPrevisionToSentiment(data.data.prevision);
      const confidence = Math.round(data.data.probabilidad * 100);
      
      // Guardar en historial
      saveAnalysisToHistory(text, sentiment, confidence);
      
      setResult({ sentiment, confidence, text });
      
    } catch (error) {
      console.warn("API no disponible, usando análisis local:", error);
      toast.warning("Usando modo de demostración (API no disponible)");
      
      // Análisis simple local
      const textLower = text.toLowerCase();
      
      const palabrasPositivas = [
        "bueno", "excelente", "genial", "feliz", "amor", "increíble", 
        "maravilloso", "fantástico", "perfecto", "alegre", "contento",
        "bien", "mejor", "éxito", "logro"
      ];
      
      const palabrasNegativas = [
        "malo", "terrible", "triste", "odio", "horrible", "pésimo",
        "desastre", "fracaso", "dolor", "problema", "error", "fallo",
        "mal", "peor", "difícil"
      ];
      
      const positivas = palabrasPositivas.filter(p => textLower.includes(p)).length;
      const negativas = palabrasNegativas.filter(p => textLower.includes(p)).length;
      
      let sentiment: SentimentType = "neutral";
      let confidence = 70;
      
      if (positivas > negativas && positivas > 0) {
        sentiment = "positive";
        confidence = Math.min(70 + (positivas * 5), 95);
      } else if (negativas > positivas && negativas > 0) {
        sentiment = "negative";
        confidence = Math.min(70 + (negativas * 5), 95);
      } else if (positivas === 0 && negativas === 0) {
        confidence = 60;
      }
      
      // Simular delay para parecer real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar en historial también en modo local
      saveAnalysisToHistory(text, sentiment, confidence);
      
      setResult({ sentiment, confidence, text });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SentimentHeader />

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div 
          className="animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {result ? (
            <SentimentResult
              sentiment={result.sentiment}
              confidence={result.confidence}
              text={result.text}
              onReset={handleReset}
            />
          ) : (
            <div className="bg-card rounded-2xl p-6 md:p-10 shadow-card">
              <SentimentForm onAnalyze={analyzeSentiment} isLoading={isLoading} />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <p>
            Powered by Machine Learning • Análisis de texto en tiempo real
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;