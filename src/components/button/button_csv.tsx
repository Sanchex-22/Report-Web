import React from 'react';
import axios from 'axios';

interface DownloadCSVButtonProps {
  mes: string;
}

const DownloadCSVButton: React.FC<DownloadCSVButtonProps> = ({ mes }) => {
  const handleDownload = async () => {
    if (!mes) {
      alert('Por favor selecciona un mes antes de descargar el archivo.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/certificados/csv?mes=${mes}`, {
        responseType: 'blob', // Para manejar archivos binarios
      });

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificados_${mes}.csv`); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el archivo CSV:', error);
      alert('Error al intentar descargar el archivo CSV.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
    >
      Descargar CSV
    </button>
  );
};

export default DownloadCSVButton;
