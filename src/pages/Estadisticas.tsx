import { ArrowLeft, TrendingUp, TrendingDown, Minus, MessageSquare, BarChart3, Calendar, Percent, Trash2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AnalysisRecord {
  id: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  timestamp: number;
  date: string;
}

const Estadisticas = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = () => {
    try {
      const stored = localStorage.getItem("sentiment-analyses");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAnalyses(parsed);
      }
    } catch (error) {
      console.error("Error loading analyses:", error);
      toast.error("Error al cargar análisis");
    }
  };

  const clearHistory = () => {
    if (confirm("¿Estás seguro de que quieres borrar todo el historial?")) {
      localStorage.removeItem("sentiment-analyses");
      setAnalyses([]);
      toast.success("Historial eliminado");
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(analyses, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success("Datos exportados");
  };

  // Calcular estadísticas
  const stats = {
    totalAnalisis: analyses.length,
    positivos: analyses.filter(a => a.sentiment === "positive").length,
    negativos: analyses.filter(a => a.sentiment === "negative").length,
    neutrales: analyses.filter(a => a.sentiment === "neutral").length,
    porcentajePositivo: analyses.length > 0 ? Math.round((analyses.filter(a => a.sentiment === "positive").length / analyses.length) * 100) : 0,
    porcentajeNegativo: analyses.length > 0 ? Math.round((analyses.filter(a => a.sentiment === "negative").length / analyses.length) * 100) : 0,
    porcentajeNeutral: analyses.length > 0 ? Math.round((analyses.filter(a => a.sentiment === "neutral").length / analyses.length) * 100) : 0,
    promedioConfianza: analyses.length > 0 ? Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length) : 0
  };

  // Datos para gráfico de pie
  const pieData = [
    { name: "Positivo", value: stats.positivos, color: "#10b981" },
    { name: "Neutral", value: stats.neutrales, color: "#3b82f6" },
    { name: "Negativo", value: stats.negativos, color: "#ef4444" }
  ].filter(d => d.value > 0);

  // Datos para gráfico de línea (últimos 7 días)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const lineData = getLast7Days().map(date => {
    const dayAnalyses = analyses.filter(a => a.date === date);
    return {
      date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      positivos: dayAnalyses.filter(a => a.sentiment === "positive").length,
      negativos: dayAnalyses.filter(a => a.sentiment === "negative").length,
      neutrales: dayAnalyses.filter(a => a.sentiment === "neutral").length,
      total: dayAnalyses.length
    };
  });

  // Datos para gráfico de barras (confianza promedio por sentimiento)
  const confidenceData = [
    {
      sentiment: "Positivo",
      confianza: analyses.filter(a => a.sentiment === "positive").length > 0 
        ? Math.round(analyses.filter(a => a.sentiment === "positive").reduce((sum, a) => sum + a.confidence, 0) / analyses.filter(a => a.sentiment === "positive").length)
        : 0,
      color: "#10b981"
    },
    {
      sentiment: "Neutral",
      confianza: analyses.filter(a => a.sentiment === "neutral").length > 0 
        ? Math.round(analyses.filter(a => a.sentiment === "neutral").reduce((sum, a) => sum + a.confidence, 0) / analyses.filter(a => a.sentiment === "neutral").length)
        : 0,
      color: "#3b82f6"
    },
    {
      sentiment: "Negativo",
      confianza: analyses.filter(a => a.sentiment === "negative").length > 0 
        ? Math.round(analyses.filter(a => a.sentiment === "negative").reduce((sum, a) => sum + a.confidence, 0) / analyses.filter(a => a.sentiment === "negative").length)
        : 0,
      color: "#ef4444"
    }
  ];

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-white/10">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105"
            variant="ghost"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={exportData}
              disabled={analyses.length === 0}
              className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
              variant="ghost"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button
              onClick={clearHistory}
              disabled={analyses.length === 0}
              className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 hover:bg-red-500/30 text-red-100"
              variant="ghost"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Título */}
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
            {analyses.length > 0 ? `${stats.totalAnalisis} análisis realizados` : "No hay análisis todavía"}
          </p>
        </div>

        {analyses.length === 0 ? (
          <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20">
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-16 h-16 text-primary-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary-foreground mb-2">No hay datos disponibles</h3>
              <p className="text-primary-foreground/70 mb-6">Realiza tu primer análisis para ver estadísticas</p>
              <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground">
                Ir a Análisis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:scale-105 transition-transform duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-primary-foreground text-sm">
                    <MessageSquare className="w-4 h-4" />
                    Total Análisis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold text-primary-foreground">
                    {stats.totalAnalisis}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/30 to-emerald-500/20 backdrop-blur-sm border-green-400/40 hover:scale-105 transition-transform duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white text-sm font-bold">
                    <TrendingUp className="w-4 h-4" />
                    Positivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold text-white drop-shadow-lg">
                    {stats.porcentajePositivo}%
                  </p>
                  <p className="text-white/90 text-sm mt-1 font-semibold">{stats.positivos} análisis</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/30 to-cyan-500/20 backdrop-blur-sm border-blue-400/40 hover:scale-105 transition-transform duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white text-sm font-bold">
                    <Minus className="w-4 h-4" />
                    Neutrales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold text-white drop-shadow-lg">
                    {stats.porcentajeNeutral}%
                  </p>
                  <p className="text-white/90 text-sm mt-1 font-semibold">{stats.neutrales} análisis</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/30 to-rose-500/20 backdrop-blur-sm border-red-400/40 hover:scale-105 transition-transform duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white text-sm font-bold">
                    <TrendingDown className="w-4 h-4" />
                    Negativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold text-white drop-shadow-lg">
                    {stats.porcentajeNegativo}%
                  </p>
                  <p className="text-white/90 text-sm mt-1 font-semibold">{stats.negativos} análisis</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/30 to-pink-500/20 backdrop-blur-sm border-purple-400/40 hover:scale-105 transition-transform duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white text-sm font-bold">
                    <Percent className="w-4 h-4" />
                    Confianza Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold text-white drop-shadow-lg">
                    {stats.promedioConfianza}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de distribución (Pie) */}
              <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20">
                <CardHeader>
                  <CardTitle className="text-primary-foreground">Distribución de Sentimientos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de confianza por sentimiento */}
              <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20">
                <CardHeader>
                  <CardTitle className="text-primary-foreground">Confianza Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={confidenceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="sentiment" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="confianza" fill="#8884d8">
                        {confidenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de tendencia temporal */}
            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 mb-8">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Tendencia (Últimos 7 días)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="positivos" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="neutrales" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="negativos" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Últimos análisis */}
            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Últimos 10 Análisis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyses.slice(-10).reverse().map((analysis) => (
                    <div
                      key={analysis.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-primary-foreground/90 text-sm truncate">
                            {analysis.text}
                          </p>
                          <p className="text-primary-foreground/50 text-xs mt-1">
                            {new Date(analysis.timestamp).toLocaleString('es-ES')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            analysis.sentiment === 'positive' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                            analysis.sentiment === 'negative' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                            'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                          }`}>
                            {analysis.sentiment === 'positive' ? '😊 Positivo' :
                             analysis.sentiment === 'negative' ? '😢 Negativo' :
                             '😐 Neutral'}
                          </div>
                          <div className="text-primary-foreground/70 text-sm font-semibold">
                            {analysis.confidence}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
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