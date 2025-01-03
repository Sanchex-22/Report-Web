import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Certificate = {
  id: string;
  certificate_number: string | null;
  abbreviations: string;
  name: string;
  price: string;
  createdAt: string;
  updatedAt: string;
};


const CertificateTable: React.FC = () => {
  const [certificados, setCertificados] = useState<Certificate[]>([]);
  const [pagina, setPagina] = useState<number>(1);
  const [totalCert, setTotalCert] = useState<number>(0);

  useEffect(() => {
    fetchCertificados();
  }, [pagina]);

  const fetchCertificados = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/certificates/getAll`, {
        params: {
          page: pagina,
          limit: 50,
        },
      });
      // Verifica si la respuesta contiene los datos correctos
      if (response.data && Array.isArray(response.data.certificates)) {
        setCertificados(response.data.certificates);
        setTotalCert(response.data.total || 0);
      } else {
        console.error('Respuesta inesperada:', response.data);
        setCertificados([]);
      }
    } catch (error) {
      console.error('Error al obtener los certificados:', error);
      setCertificados([]);
    }
  };
  

  const handleChangePage = (nuevaPagina: number) => {
    setPagina(nuevaPagina);
  };
  const totalPaginas = Math.ceil(totalCert / 50);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Certificados Registrados</h2>

      {/* Botón para agregar nuevo certificado */}
      <div className="mb-4">
        <Link
          to={"/certificates/form"}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Agregar Certificado
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Certificate Number</th>
            <th className="px-4 py-2 text-left">Abbreviations</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(certificados) && certificados.length > 0 ? (
            certificados.map((cert, index) => (
              <tr key={cert.id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{cert?.certificate_number ?? 'N/A'}</td>
                <td className="px-4 py-2">{cert?.abbreviations}</td>
                <td className="px-4 py-2">{cert?.name}</td>
                <td className="px-4 py-2">${parseFloat(cert?.price || '0').toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(cert?.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border p-2 text-center text-gray-500">No hay certificados para este mes</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handleChangePage(pagina - 1)}
          disabled={pagina <= 1}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Anterior
        </button>
        <span className="text-sm">Página {pagina} de {totalPaginas}</span>
        <button
          onClick={() => handleChangePage(pagina + 1)}
          disabled={pagina >= totalPaginas}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Siguiente
        </button>
      </div>

    </div>
  );
};

export default CertificateTable;
