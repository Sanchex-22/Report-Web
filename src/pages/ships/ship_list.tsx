import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Flag from '../../components/utils/images';

interface Ships {
    id: number;
    name: string;
    imo: string;
    type: string;
    flag: Country;
}
type Country = 'panama' | 'honduras' | 'belize';

const ShipsTable: React.FC = () => {
    const [ships, setShips] = useState<Ships[]>([]);
    const [pagina, setPagina] = useState<number>(1);
    const [totalShips, setTotalShips] = useState<number>(0);
    const [selectedShip, setSelectedShip] = useState<Ships | null>(null); // Barco seleccionado para eliminación
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para manejar la modal
    const [loading, setLoading] = useState<boolean>(false); // Estado de carga
    const [message, setMessage] = useState<string>(''); // Mensaje para error o éxito
    const [messageType, setMessageType] = useState<'error' | 'success' | 'loading'>('loading'); // Tipo de mensaje (error, success, loading)

    useEffect(() => {
        fetchShips();
    }, [pagina]);

    const fetchShips = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/ships/getAll`, {
                params: {
                    page: pagina,
                    limit: 50,
                },
            });
            setShips(response.data.ships || []);
            setTotalShips(response.data.total || 0);
        } catch (error) {
            console.error('Error al obtener los barcos:', error);
            setShips([]);
        }
    };

    const openModal = (ship: Ships) => {
        setSelectedShip(ship);
        setIsModalOpen(true);
        setMessage(''); // Limpiar mensaje al abrir la modal
    };

    const closeModal = () => {
        setSelectedShip(null);
        setIsModalOpen(false);
    };

    const handleDeleteShip = async () => {
        if (!selectedShip) return;

        setLoading(true); // Activar estado de carga
        setMessageType('loading'); // Mostrar mensaje de carga
        setMessage('Eliminando barco...');

        try {
            await axios.delete(`http://localhost:3001/api/ships/delete`,{
                params: {uid: selectedShip.id}
            });
            setShips((prevShips) => prevShips.filter((ship) => ship.id !== selectedShip.id));
            setMessageType('success');
            setMessage('Barco eliminado con éxito');
            closeModal();
        } catch (error) {
            console.error('Error al eliminar el barco:', error);
            setMessageType('error');
            setMessage('No se pudo eliminar el barco. Intente nuevamente.');
        } finally {
            setLoading(false); // Desactivar estado de carga
        }
    };

    const handleChangePage = (nuevaPagina: number) => {
        setPagina(nuevaPagina);
    };

    const totalPaginas = Math.ceil(totalShips / 50);

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Ships and Companies</h2>

            <div className="mb-4">
                <Link
                    to={"/ships/new"}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Agregar barco o compañía
                </Link>
            </div>

            {/* Mostrar el mensaje de error, éxito o carga */}
            <div className="mb-4">
                {message && (
                    <div
                        className={`p-4 rounded mb-4 ${messageType === 'error' ? 'bg-red-100 text-red-800' : messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                        {message}
                    </div>
                )}
            </div>

            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">#</th>
                        <th className="border p-2 text-left">Imo</th>
                        <th className="border p-2 text-left">Nombre</th>
                        <th className="border p-2 text-right">Tipo</th>
                        <th className="border p-2 text-left">Bandera</th>
                        <th className="border p-2 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(ships) && ships.length > 0 ? (
                        ships.map((ship) => (
                            <tr key={ship.id}>
                                <td className="border p-2">{ship.id}</td>
                                <td className="border p-2">{ship.imo}</td>
                                <td className="border p-2">{ship.name}</td>
                                <td className="border p-2 text-right">{ship.type}</td>
                                <td className="border p-2"><Flag className='w-6 h-4' country={ship?.flag} /></td>
                                <td className="border p-2 text-center">
                                    <button
                                        onClick={() => openModal(ship)}
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="border p-2 text-center text-gray-500">
                                No hay barcos
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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

            {/* Modal de confirmación */}
            {isModalOpen && selectedShip && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">¿Estás seguro de eliminar este barco?</h3>
                        <div className="mb-4">
                            <p><strong>ID:</strong> {selectedShip.id}</p>
                            <p><strong>Imo:</strong> {selectedShip.imo}</p>
                            <p><strong>Nombre:</strong> {selectedShip.name}</p>
                            <p><strong>Tipo:</strong> {selectedShip.type}</p>
                            <p><strong>Bandera:</strong> {selectedShip.flag}</p>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteShip}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShipsTable;
