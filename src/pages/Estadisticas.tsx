import { ArrowLeft, TrendingUp, TrendingDown, MessageSquare, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Estadisticas = () => {
  const navigate = useNavigate();

  const stats = {
    totalAnalisis: 1234,
    positivos: 802,
    negativos: 432,
    porcentajePositivo: 65,
    porcentajeNegativo: 35
  };

  return (
    <div className="min-h-screen gradient-primary">
      <header className="w-full py-6 px-4 border-b border-white/10">
        <div className="container max-w-6xl mx-auto">
          <Button
            onClick={() => navigate('/')}
            className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105"
            variant="ghost"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Análisis
          </Button>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary-foreground/10 rounded-xl backdrop-blur-sm border border-primary-foreground/20">
              <BarChart3 className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Estadísticas de Análisis
            </span>
          </h1>
          <p className="text-primary-foreground/90 text-lg">
            Resumen de todos los análisis de sentimiento realizados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:scale-105 transition-transform duration-300 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary-foreground">
                <MessageSquare className="w-5 h-5" />
                Total de Análisis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-extrabold text-primary-foreground">
                {stats.totalAnalisis.toLocaleString()}
              </p>
              <p className="text-primary-foreground/70 mt-2 text-sm">
                Textos analizados hasta la fecha
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-sm border-green-400/30 hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                Sentimientos Positivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-extrabold text-green-300">
                {stats.porcentajePositivo}%
              </p>
              <p className="text-white/80 mt-2 text-sm">
                {stats.positivos.toLocaleString()} análisis positivos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/20 to-rose-500/10 backdrop-blur-sm border-red-400/30 hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingDown className="w-5 h-5" />
                Sentimientos Negativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-extrabold text-red-300">
                {stats.porcentajeNegativo}%
              </p>
              <p className="text-white/80 mt-2 text-sm">
                {stats.negativos.toLocaleString()} análisis negativos
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-primary-foreground">Distribución de Sentimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative h-12 bg-white/10 rounded-full overflow-hidden border border-white/20">
                <div 
                  className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center font-bold text-white transition-all duration-1000 ease-out"
                  style={{ width: `${stats.porcentajePositivo}%` }}
                >
                  {stats.porcentajePositivo > 15 && `${stats.porcentajePositivo}% Positivo`}
                </div>
                <div 
                  className="absolute h-full bg-gradient-to-r from-red-500 to-rose-400 flex items-center justify-center font-bold text-white transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${stats.porcentajeNegativo}%`,
                    left: `${stats.porcentajePositivo}%`
                  }}
                >
                  {stats.porcentajeNegativo > 15 && `${stats.porcentajeNegativo}% Negativo`}
                </div>
              </div>

              <div className="flex justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
                  <span className="text-primary-foreground/90">Positivo ({stats.positivos})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-rose-400"></div>
                  <span className="text-primary-foreground/90">Negativo ({stats.negativos})</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p className="text-primary-foreground/70 text-sm">
            💡 Los datos se actualizan en tiempo real con cada nuevo análisis
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Estadisticas;