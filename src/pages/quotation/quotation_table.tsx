import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Report {
  id: number;
  name: string;
  price: number;
  type: string;
  certificate: string;
  createdAt: string;
}

type ReportCategories = {
  today: Report[];
  yesterday: Report[];
  thisWeek: Report[];
  lastMonth: Report[];
  older: Report[];
};

const QuotationTable: React.FC = () => {
  const [reports, setReports] = useState<ReportCategories>({
    today: [],
    yesterday: [],
    thisWeek: [],
    lastMonth: [],
    older: [],
  });
  const [pagina, setPagina] = useState<number>(1);
  const [totalReports, setTotalReports] = useState<number>(0);

  useEffect(() => {
    fetchReports();
  }, [pagina]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/reports/ultimosCreados`, {
        params: {
          page: pagina,
          limit: 50,
        },
      });
      setReports(response.data.categorizedReports);  // Asegúrate de que `categorizedReports` tenga la estructura de `ReportCategories`
      setTotalReports(response.data.total);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
    }
  };

  const handleChangePage = (nuevaPagina: number) => {
    setPagina(nuevaPagina);
  };

  const totalPaginas = Math.ceil(totalReports / 50);

  // Asegúrate de que `category` sea uno de los valores de `ReportCategories`
  const renderReports = (category: keyof ReportCategories) => {
    return reports[category].length > 0 ? (
      reports[category].map((report, index) => (
        <tr key={report.id}>
          <td className="border p-2">{index}</td>
          <td className="border p-2">{report.name}</td>
          <td className="border p-2">{report.certificate}</td>
          <td className="border p-2">{report.type}</td>
          <td className="border p-2 text-right">${(report.price || 0).toFixed(2)}</td>
          <td className="border p-2">{new Date(report.createdAt).toLocaleDateString()}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={4} className="border p-2 text-center text-gray-500">No hay reportes</td>
      </tr>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Ultimos Reportes</h2>

      <div className="mb-4">
        <Link to="/quotation/form" className="px-4 py-2 bg-blue-500 text-white rounded">
          Crear Reporte
        </Link>
      </div>

      {/* Mostrar reportes categorizados */}
      {['today', 'yesterday', 'thisWeek', 'lastMonth', 'older'].map((category) => (
        <div key={category} className="mb-4">
          <h3 className="text-xl font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <table className="w-full border-collapse border border-gray-200 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Ship</th>
                <th className="border p-2 text-left">Cert. name</th>
                <th className="border p-2 text-left">Tipo</th>
                <th className="border p-2 text-right">Precio</th>
                <th className="border p-2 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {renderReports(category as keyof ReportCategories)} {/* Usar `keyof ReportCategories` para asegurar el tipo */}
            </tbody>
          </table>
        </div>
      ))}

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

export default QuotationTable;
