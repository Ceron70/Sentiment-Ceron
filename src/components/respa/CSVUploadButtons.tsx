import { useState } from 'react';
import { Upload, Loader2, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

interface CSVUploadButtonsProps {
  onBatchAnalyzed?: (response: BatchResponse) => void;
}

const CSVUploadButtons = ({ onBatchAnalyzed }: CSVUploadButtonsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Función para esperar X segundos
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Cargar example.csv automáticamente
  const handleLoadExampleCSV = async () => {
    setIsLoading(true);
    toast.loading('Cargando archivo example.csv...', { id: 'csv-loading' });

    try {
      const fileResponse = await fetch('/example.csv');
      
      if (!fileResponse.ok) {
        throw new Error('No se pudo cargar el archivo example.csv. Asegúrate de que esté en la carpeta public');
      }

      const blob = await fileResponse.blob();
      const file = new File([blob], 'example.csv', { type: 'text/csv' });

      await uploadCSVWithRetry(file);
    } catch (err) {
      toast.dismiss('csv-loading');
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el archivo';
      toast.error(errorMessage, {
        description: 'Verifica que el archivo esté en la carpeta public',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar archivo personalizado
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Por favor selecciona un archivo CSV válido');
      return;
    }

    setIsLoading(true);
    toast.loading(`Procesando ${file.name}...`, { id: 'csv-loading' });

    try {
      await uploadCSVWithRetry(file);
    } catch (err) {
      toast.dismiss('csv-loading');
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el archivo';
      toast.error(errorMessage, {
        description: 'El servidor no está disponible en este momento.',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  // Función con reintentos automáticos
  const uploadCSVWithRetry = async (file: File, maxRetries = 3) => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Mostrar mensaje de reintento si no es el primer intento
        if (attempt > 1) {
          toast.loading(`Reintentando... (intento ${attempt} de ${maxRetries})`, { 
            id: 'csv-retry',
            description: 'El servidor puede estar activándose, espera un momento...'
          });
          // Esperar 5 segundos entre reintentos
          await sleep(5000);
        } else {
          toast.loading('Conectando con el servidor...', { id: 'csv-connecting' });
        }

        await uploadCSV(file);
        
        // Si llegamos aquí, fue exitoso
        toast.dismiss('csv-retry');
        toast.dismiss('csv-connecting');
        toast.dismiss('csv-loading');
        return; // Salir de la función si fue exitoso
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Error desconocido');
        
        // Si no es el último intento, continuar con el siguiente
        if (attempt < maxRetries) {
          console.log(`Intento ${attempt} falló, reintentando...`);
          continue;
        }
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    toast.dismiss('csv-retry');
    toast.dismiss('csv-connecting');
    toast.dismiss('csv-loading');
    
    throw new Error(`No se pudo conectar con el servidor después de ${maxRetries} intentos. ${lastError?.message || ''}`);
  };

  // Función para subir CSV (un solo intento)
  const uploadCSV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    // Timeout de 30 segundos para la petición
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch('https://sentiment-tech-api.onrender.com/api/v1/sentiment/batch', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // Intentar leer el error del servidor
        let errorDetail = `Error ${res.status}: ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorDetail = errorData.message || errorDetail;
        } catch {
          // Si no se puede parsear, usar el error por defecto
        }
        throw new Error(errorDetail);
      }

      const data: BatchResponse = await res.json();
      
      // Verificar si hubo textos procesados
      if (data.data.totalProcessed === 0) {
        throw new Error('No se procesaron textos. Verifica el formato del archivo CSV.');
      }

      // Verificar si todos fallaron
      if (data.data.successful === 0 && data.data.failed > 0) {
        toast.warning('Todos los textos fallaron al procesarse', {
          description: 'El formato del CSV podría no ser el correcto. Asegúrate de que cada línea contenga un texto entre comillas.',
          duration: 7000
        });
        return;
      }
      
      // Mostrar notificación de éxito con detalles
      toast.success('¡Análisis completado!', {
        description: `${data.data.successful} exitosos de ${data.data.totalProcessed} textos procesados`,
        duration: 5000
      });
      
      // Mostrar resumen de sentimientos
      if (data.data.successful > 0) {
        toast.info('Resumen de sentimientos', {
          description: `😊 ${data.data.totalPositives} positivos • 😐 ${data.data.totalNeutrals} neutrales • 😞 ${data.data.totalNegatives} negativos`,
          duration: 7000
        });
      }
      
      // Callback opcional para manejar los resultados
      if (onBatchAnalyzed) {
        onBatchAnalyzed(data);
      }

      // Guardar resultados en localStorage para estadísticas
      try {
        const stored = localStorage.getItem("sentiment-batch-analyses");
        const batches = stored ? JSON.parse(stored) : [];
        
        batches.push({
          id: `batch-${Date.now()}`,
          timestamp: Date.now(),
          date: new Date().toISOString().split('T')[0],
          totalProcessed: data.data.totalProcessed,
          successful: data.data.successful,
          positives: data.data.totalPositives,
          neutrals: data.data.totalNeutrals,
          negatives: data.data.totalNegatives,
          results: data.data.results
        });

        // Mantener solo los últimos 50 análisis batch
        if (batches.length > 50) {
          batches.splice(0, batches.length - 50);
        }

        localStorage.setItem("sentiment-batch-analyses", JSON.stringify(batches));
      } catch (error) {
        console.error("Error saving batch to history:", error);
      }

    } catch (error) {
      clearTimeout(timeoutId);
      
      // Si es error de abort (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('El servidor tardó demasiado en responder (timeout de 30s)');
      }
      
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Botón para cargar example.csv */}
        <Button
          onClick={handleLoadExampleCSV}
          disabled={isLoading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 h-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Cargar Datos
            </>
          )}
        </Button>

        {/* Botón para cargar archivo personalizado */}
        <label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="hidden"
            id="csv-file-input"
          />
          <Button
            type="button"
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 h-auto"
            onClick={() => document.getElementById('csv-file-input')?.click()}
          >
            <Upload className="w-5 h-5" />
            Cargar Otro Archivo
          </Button>
        </label>
      </div>

      {/* Información sobre el formato */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Formato del CSV:</p>
            <p className="text-blue-700">
              Cada línea debe contener un texto entre comillas. Ejemplo:
            </p>
            <code className="block mt-2 bg-white p-2 rounded text-xs text-gray-800 border border-blue-200">
              "Este producto es increíble"<br/>
              "El servicio fue terrible"<br/>
              "La experiencia fue regular"
            </code>
            <p className="text-blue-600 mt-2 text-xs">
              💡 <strong>Nota:</strong> El sistema reintentará automáticamente hasta 3 veces si el servidor tarda en responder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUploadButtons;