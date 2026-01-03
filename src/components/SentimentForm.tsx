import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SentimentFormProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const SentimentForm = ({ onAnalyze, isLoading }: SentimentFormProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length >= 5) {
      onAnalyze(text);
    }
  };

  const isValid = text.trim().length >= 5;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí el texto que quieres analizar (mínimo 5 caracteres)..."
          className="min-h-[200px] md:min-h-[300px] text-base md:text-lg p-6 resize-none 
                     bg-card border-2 border-border/50 rounded-xl
                     focus:border-primary focus:ring-4 focus:ring-primary/10
                     placeholder:text-muted-foreground/60
                     transition-all duration-300 shadow-soft"
          disabled={isLoading}
        />
        <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
          {text.length} caracteres
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full h-14 md:h-16 text-lg md:text-xl font-semibold
                   gradient-primary text-primary-foreground
                   hover:opacity-90 hover:shadow-glow
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300 rounded-xl"
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin-slow" />
            Analizando...
          </span>
        ) : (
          <span className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            Analizar Sentimiento
          </span>
        )}
      </Button>

      {!isValid && text.length > 0 && (
        <p className="text-sm text-muted-foreground text-center animate-fade-in">
          Escribe al menos 5 caracteres para analizar
        </p>
      )}
    </form>
  );
};

export default SentimentForm;
