import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  RefreshCw,
  Smile,
  Frown,
  Meh,
  Activity
} from "lucide-react";
import { toast } from "sonner";

interface StatsData {
  total: number;
  positivos: number;
  negativos: number;
  neutros: number;
  porcentajePositivos: number;
  porcentajeNegativos: number;
  porcentajeNeutros: number;
}

const Estadisticas = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAnalyses, setLastAnalyses] = useState(20);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://sentiment-tech-api.onrender.com/api/v1/sentiment/stats?last=${lastAnalyses}`
      );
      
      if (!response.ok) {
        throw new Error("Error al cargar estadísticas");
      }

      const data: StatsData = await response.json();
      setStats(data);
      toast.success("Estadísticas actualizadas");
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("No se pudieron cargar las estadísticas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [lastAnalyses]);

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    percentage, 
    color 
  }: { 
    icon: any; 
    label: string; 
    value: number; 
    percentage: number; 
    color: string;
  }) => (
    <Card className={`p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{value}</p>
            <Badge variant="secondary" className="text-xs">
              {percentage.toFixed(1)}%
            </Badge>
          </div>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(percentage / 100) * 176} 176`}
              className={color.includes('green') ? 'text-green-500' : 
                         color.includes('red') ? 'text-red-500' : 'text-yellow-500'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold">{percentage.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-secondary"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Estadísticas</h1>
                  <p className="text-sm text-muted-foreground">
                    Análisis de sentimientos
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={fetchStats}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {isLoading && !stats ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Cargando estadísticas...</p>
            </div>
          </div>
        ) : stats ? (
          <div className="space-y-8 animate-fade-in">
            {/* Selector de últimos análisis */}
            <Card className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Últimos análisis</h3>
                    <p className="text-sm text-muted-foreground">
                      Mostrando datos de los últimos {lastAnalyses} análisis
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[10, 20, 50, 100].map((num) => (
                    <Button
                      key={num}
                      variant={lastAnalyses === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLastAnalyses(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Total de análisis */}
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Total de Análisis
                  </p>
                  <p className="text-5xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">
                    Textos analizados en total
                  </p>
                </div>
                <TrendingUp className="w-20 h-20 text-primary/20" />
              </div>
            </Card>

            {/* Cards de estadísticas */}
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard
                icon={Smile}
                label="Sentimientos Positivos"
                value={stats.positivos}
                percentage={stats.porcentajePositivos}
                color="border-l-green-500"
              />
              <StatCard
                icon={Frown}
                label="Sentimientos Negativos"
                value={stats.negativos}
                percentage={stats.porcentajeNegativos}
                color="border-l-red-500"
              />
              <StatCard
                icon={Meh}
                label="Sentimientos Neutrales"
                value={stats.neutros}
                percentage={stats.porcentajeNeutros}
                color="border-l-yellow-500"
              />
            </div>

            {/* Gráfico de barras visual */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Distribución de Sentimientos
              </h3>
              <div className="space-y-4">
                {/* Positivos */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Smile className="w-4 h-4 text-green-500" />
                      Positivos
                    </span>
                    <span className="text-sm font-bold">
                      {stats.positivos} ({stats.porcentajePositivos.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-8 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                      style={{ width: `${stats.porcentajePositivos}%` }}
                    >
                      {stats.porcentajePositivos > 10 && (
                        <span className="text-xs font-semibold text-white">
                          {stats.porcentajePositivos.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Negativos */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Frown className="w-4 h-4 text-red-500" />
                      Negativos
                    </span>
                    <span className="text-sm font-bold">
                      {stats.negativos} ({stats.porcentajeNegativos.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-8 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                      style={{ width: `${stats.porcentajeNegativos}%` }}
                    >
                      {stats.porcentajeNegativos > 10 && (
                        <span className="text-xs font-semibold text-white">
                          {stats.porcentajeNegativos.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Neutrales */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Meh className="w-4 h-4 text-yellow-500" />
                      Neutrales
                    </span>
                    <span className="text-sm font-bold">
                      {stats.neutros} ({stats.porcentajeNeutros.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-8 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                      style={{ width: `${stats.porcentajeNeutros}%` }}
                    >
                      {stats.porcentajeNeutros > 10 && (
                        <span className="text-xs font-semibold text-white">
                          {stats.porcentajeNeutros.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Footer info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Datos actualizados en tiempo real desde la API</p>
              <p className="mt-1">
                Última actualización: {new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No hay datos disponibles</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Estadisticas;