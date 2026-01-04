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

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeSentiment = async (text: string) => {
   setIsLoading(true);
  
  try {
    toast.info("Conectando con el servidor...");
    
    // Primer intento
    let response = await fetch("https://sentiment-tech-api.onrender.com/api/v1/sentiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    // Si falla, reintentar después de 3 segundos
    if (!response.ok && response.status === 503) {
      toast.info("Despertando el servidor, espera un momento...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      response = await fetch("https://sentiment-tech-api.onrender.com/api/v1/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || `Error del servidor (${response.status})`);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Error al analizar el sentimiento");
    }

    const sentiment = mapPrevisionToSentiment(data.data.prevision);
    const confidence = Math.round(data.data.probabilidad * 100);
    
    setResult({ sentiment, confidence, text });
    toast.success("Análisis completado!");
    
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("No se pudo conectar con el servidor. Intenta más tarde.");
    }
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
