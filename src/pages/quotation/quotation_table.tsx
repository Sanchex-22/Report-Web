import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Flag from '../../components/utils/images';

interface Report {
  id: string;
  name: string;
  imo: string;
  certificate: string;
  certificateNumber: string;
  type: string;
  flag: string;
  price: number;
  dateIssuance: string | null;
  dateExpire: string | null;
  dateEndorsement: string | null;
  datePlanApproval: string | null;
  dateCreate: string | null;
  createdAt: string;
  ship: Ship;
}

interface Ship {
  flag: Country;
  id: string | null;
  imo: string | null;
  name: string | null;
  type: string | null;
}

type Country = 'panama' | 'honduras' | 'belize';

type ReportCategories = {
  today: Report[];
  yesterday: Report[];
  thisWeek: Report[];
  lastMonth: Report[];
  older: Report[];
};

const Modal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  report?: Report | null;
  loading: boolean;
}> = ({ isVisible, onClose, onConfirm, report, loading }) => {
  if (!isVisible || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
        <p className="mb-4">¿Estás seguro de que deseas eliminar este dato?</p>
        <div className="mb-6 text-left">
          <p><strong>ID:</strong> {report.id}</p>
          <p><strong>Nombre:</strong> {report.name}</p>
          <p><strong>Certificado:</strong> {report.certificate}</p>
          <p><strong>Tipo:</strong> {report.type}</p>
          <p><strong>Precio:</strong> ${report.price.toFixed(2)}</p>
          <p><strong>Fecha:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-red-500'}`}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
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
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      setReports(response.data.categorizedReports);
      setTotalReports(response.data.total);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedReport) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:3001/api/reports/delete/`, {
        params: {
          uid: selectedReport.id,
        },
      });
      fetchReports(); // Refrescar la lista después de eliminar
      setAlert({ type: 'success', message: 'Reporte eliminado correctamente' });
      setShowModal(false);
      setSelectedReport(null);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar el reporte' });
      console.error('Error al eliminar el reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const totalPaginas = Math.ceil(totalReports / 50);

  const renderReports = (category: keyof ReportCategories) => {
    return reports[category].length > 0 ? (
      reports[category].map((report, index) => (
        <tr key={report.id}>
          <td className="border p-2">{index}</td>
          <td className="border p-2"><Flag className='w-6 h-4' country={report.ship.flag} /></td>
          <td className="border p-2">{report.name}</td>
          <td className="border p-2">{report.certificate}</td>
          <td className="border p-2">{report.type}</td>
          <td className="border p-2 text-right">${(report.price || 0).toFixed(2)}</td>
          <td className="border p-2">{new Date(report.createdAt).toLocaleDateString()}</td>
          <td className="border p-2 text-center">
            <button
              onClick={() => handleOpenModal(report)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7} className="border p-2 text-center text-gray-500">
          No hay reportes
        </td>
      </tr>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Últimos Reportes</h2>

      {alert && (
        <div
          className={`mb-4 p-4 rounded ${
            alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="mb-4">
        <Link to="/quotation/form" className="px-4 py-2 bg-blue-500 text-white rounded">
          Crear Reporte
        </Link>
      </div>

      {['today', 'yesterday', 'thisWeek', 'lastMonth', 'older'].map((category) => (
        <div key={category} className="mb-4">
          <h3 className="text-xl font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <table className="w-full border-collapse border border-gray-200 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left"></th>
                <th className="border p-2 text-left">Ship</th>
                <th className="border p-2 text-left">Cert. name</th>
                <th className="border p-2 text-left">Tipo</th>
                <th className="border p-2 text-right">Precio</th>
                <th className="border p-2 text-left">Fecha</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>{renderReports(category as keyof ReportCategories)}</tbody>
          </table>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPagina(pagina - 1)}
          disabled={pagina <= 1}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Anterior
        </button>
        <span className="text-sm">Página {pagina} de {totalPaginas}</span>
        <button
          onClick={() => setPagina(pagina + 1)}
          disabled={pagina >= totalPaginas}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      <Modal
        isVisible={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        report={selectedReport}
        loading={loading}
      />
    </div>
  );
};

export default QuotationTable;
