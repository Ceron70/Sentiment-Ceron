import { Brain } from "lucide-react";

const SentimentHeader = () => {
  return (
    <header className="w-full gradient-primary py-12 md:py-20 px-4">
      <div className="container max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6 animate-fade-in">
          <div className="p-4 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm border border-primary-foreground/20">
            <Brain className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
          </div>
        </div>
        <h1 
          className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          Análisis de Sentimiento ML 
        </h1>
        <p 
          className="text-lg md:text-xl text-primary-foreground/90 font-medium animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Detecta emociones en texto usando Machine Learning
        </p>
      </div>
    </header>
  );
};

export default SentimentHeader;
