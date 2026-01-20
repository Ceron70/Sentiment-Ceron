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
  Activity,
  FileText,
  CheckCircle,
  XCircle
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

interface BatchResult {
  text: string;
  sentiment: {
    prevision: "Positivo" | "Negativo" | "Neutral";
    probabilidad: number;
  };
}

interface BatchData {
  success: boolean;
  data: {
    totalProcessed: number;
    successful: number;
    failed: number;
    totalPositives: number;
    totalNeutrals: number;
    totalNegatives: number;
    results: BatchResult[];
  };
  message: string;
}

const Estadisticas = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [batchData, setBatchData] = useState<BatchData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingBatch, setIsLoadingBatch] = useState(true);
  const [lastAnalyses, setLastAnalyses] = useState(20);

  const fetchStats = async () => {
    setIsLoadingStats(true);
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
      setIsLoadingStats(false);
    }
  };

  const fetchBatchData = async () => {
    setIsLoadingBatch(true);
    try {
      const response = await fetch(
        "https://sentiment-tech-api.onrender.com/api/v1/sentiment/batch"
      );
      
      if (!response.ok) {
        throw new Error("Error al cargar análisis por lotes");
      }

      const data: BatchData = await response.json();
      setBatchData(data);
    } catch (error) {
      console.error("Error fetching batch data:", error);
      toast.error("No se pudieron cargar los análisis por lotes");
    } finally {
      setIsLoadingBatch(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBatchData();
  }, [lastAnalyses]);

  const handleRefreshAll = () => {
    fetchStats();
    fetchBatchData();
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positivo":
        return "bg-green-100 text-green-800 border-green-300";
      case "negativo":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positivo":
        return <Smile className="w-4 h-4" />;
      case "negativo":
        return <Frown className="w-4 h-4" />;
      default:
        return <Meh className="w-4 h-4" />;
    }
  };

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

  const isLoading = isLoadingStats || isLoadingBatch;

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
              onClick={handleRefreshAll}
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
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {isLoading && !stats && !batchData ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Cargando estadísticas...</p>
            </div>
          </div>
        ) : (
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

            {/* Sección de Estadísticas Generales */}
            {stats && (
              <>
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
              </>
            )}

            {/* Sección de Análisis por Lotes */}
            {batchData && batchData.success && (
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Último Análisis por Lotes
                  </h3>
                  <Badge variant="secondary" className="gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {batchData.data.totalProcessed} textos procesados
                  </Badge>
                </div>

                {/* Resumen del batch */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="p-4 bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">Total Procesados</p>
                    <p className="text-2xl font-bold">{batchData.data.totalProcessed}</p>
                  </Card>
                  <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm text-muted-foreground mb-1">Exitosos</p>
                    <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {batchData.data.successful}
                    </p>
                  </Card>
                  <Card className="p-4 bg-red-50 border-red-200">
                    <p className="text-sm text-muted-foreground mb-1">Fallidos</p>
                    <p className="text-2xl font-bold text-red-600 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      {batchData.data.failed}
                    </p>
                  </Card>
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Positivos</p>
                    <p className="text-2xl font-bold text-primary">{batchData.data.totalPositives}</p>
                  </Card>
                </div>

                {/* Tabla de resultados */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Resultados Detallados ({batchData.data.results.length})
                  </h4>
                  {batchData.data.results.map((result, index) => (
                    <Card 
                      key={index} 
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getSentimentIcon(result.sentiment.prevision)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground mb-2 line-clamp-2">
                            {result.text}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className={`${getSentimentColor(result.sentiment.prevision)} border`}
                            >
                              {result.sentiment.prevision}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Confianza: {(result.sentiment.probabilidad * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Mensaje del batch */}
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Resumen:</strong> {batchData.message}
                  </p>
                </div>
              </Card>
            )}

            {/* Footer info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Datos actualizados en tiempo real desde la API</p>
              <p className="mt-1">
                Última actualización: {new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Estadisticas;