import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SentimentResult {
  text: string;
  sentiment: {
    prevision: string;
    probabilidad: number;
  };
}

interface BatchResponse {
  success: boolean;
  data: {
    totalProcessed: number;
    successful: number;
    failed: number;
    totalPositives: number;
    totalNeutrals: number;
    totalNegatives: number;
    results: SentimentResult[];
  };
  message: string;
}

interface BatchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: BatchResponse | null;
}

const BatchResultsModal = ({ isOpen, onClose, results }: BatchResultsModalProps) => {
  if (!results) return null;

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positivo":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "negativo":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positivo":
        return "bg-green-50 border-green-200 text-green-800";
      case "negativo":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positivo":
        return "😊";
      case "negativo":
        return "😞";
      default:
        return "😐";
    }
  };

  // Datos para el gráfico de torta
  const chartData = [
    {
      name: "Positivos",
      value: results.data.totalPositives,
      percentage: ((results.data.totalPositives / results.data.totalProcessed) * 100).toFixed(1),
      color: "#16a34a",
      emoji: "😊"
    },
    {
      name: "Neutrales",
      value: results.data.totalNeutrals,
      percentage: ((results.data.totalNeutrals / results.data.totalProcessed) * 100).toFixed(1),
      color: "#6b7280",
      emoji: "😐"
    },
    {
      name: "Negativos",
      value: results.data.totalNegatives,
      percentage: ((results.data.totalNegatives / results.data.totalProcessed) * 100).toFixed(1),
      color: "#dc2626",
      emoji: "😞"
    }
  ].filter(item => item.value > 0); // Solo mostrar categorías con valores

  const COLORS = chartData.map(item => item.color);

  // Custom label para el gráfico
  const renderCustomLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                ¡Análisis Completado!
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                {results.message}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Contenedor principal con scroll */}
        <ScrollArea className="max-h-[calc(90vh-200px)]">
          {/* Sección de gráfico y resumen */}
          <div className="px-6 py-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de torta */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
                  📊 Distribución de Sentimientos
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} textos`, '']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Leyenda personalizada */}
                <div className="flex flex-col gap-2 mt-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {item.emoji} {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{item.value}</span>
                        <span className="text-xs text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarjetas de resumen */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">📈 Resumen General</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Total Procesados</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {results.data.totalProcessed}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Exitosos</p>
                    <p className="text-3xl font-bold text-green-600">
                      {results.data.successful}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Detalles por Sentimiento</h4>
                  <div className="space-y-3">
                    {/* Positivos */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">😊 Positivos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(results.data.totalPositives / results.data.totalProcessed) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-8 text-right">
                          {results.data.totalPositives}
                        </span>
                      </div>
                    </div>

                    {/* Neutrales */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span className="text-sm font-medium text-gray-700">😐 Neutrales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-500 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(results.data.totalNeutrals / results.data.totalProcessed) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-8 text-right">
                          {results.data.totalNeutrals}
                        </span>
                      </div>
                    </div>

                    {/* Negativos */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium text-gray-700">😞 Negativos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(results.data.totalNegatives / results.data.totalProcessed) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-8 text-right">
                          {results.data.totalNegatives}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados detallados */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              📝 Resultados Detallados ({results.data.results.length})
            </h3>
            
            <div className="space-y-3">
              {results.data.results.map((result, index) => (
                <div
                  key={index}
                  className="border-2 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white"
                >
                  {/* Número del texto */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(result.sentiment.prevision)}
                      <span className="text-sm text-gray-600">
                        {(result.sentiment.probabilidad * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Texto analizado */}
                  <p className="text-gray-800 mb-3 leading-relaxed">
                    {result.text}
                  </p>

                  {/* Etiqueta de sentimiento */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border-2 ${getSentimentColor(
                        result.sentiment.prevision
                      )}`}
                    >
                      {getSentimentEmoji(result.sentiment.prevision)}
                      {result.sentiment.prevision.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Footer con botones */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cerrar
          </Button>
          <Button
            onClick={onClose}
            className="gradient-primary text-primary-foreground flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchResultsModal;