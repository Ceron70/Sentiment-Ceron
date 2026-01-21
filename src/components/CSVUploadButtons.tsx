import { useState } from 'react';
import { Upload, Loader2, FileText } from 'lucide-react';
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

  // Cargar example.csv automáticamente
  const handleLoadExampleCSV = async () => {
    setIsLoading(true);

    try {
      const fileResponse = await fetch('/example.csv');
      
      if (!fileResponse.ok) {
        throw new Error('No se pudo cargar el archivo example.csv. Asegúrate de que esté en la carpeta public');
      }

      const blob = await fileResponse.blob();
      const file = new File([blob], 'example.csv', { type: 'text/csv' });

      await uploadCSV(file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al procesar el archivo');
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

    try {
      await uploadCSV(file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al procesar el archivo');
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  // Función común para subir CSV
  const uploadCSV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://sentiment-tech-api.onrender.com/api/v1/sentiment/batch', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data: BatchResponse = await res.json();
    
    // Mostrar notificación de éxito
    toast.success(data.message);
    
    // Callback opcional para manejar los resultados
    if (onBatchAnalyzed) {
      onBatchAnalyzed(data);
    }
  };

  return (
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
  );
};

export default CSVUploadButtons;