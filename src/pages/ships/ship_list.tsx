import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Ships {
    id: number;
    name: string;
    imo: string;
    type: string;
    flag: string;
}

const ShipsTable: React.FC = () => {
    const [ships, setShips] = useState<Ships[]>([]);
    const [pagina, setPagina] = useState<number>(1);
    const [totalShips, setTotalShips] = useState<number>(0);

    useEffect(() => {
        fetch();
    }, [pagina]);

    const fetch = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/ships/getAll`, {
                params: {
                    page: pagina,
                    limit: 50,
                },
            });
            setShips(response.data.ships || []); // Asegurarse de que sea un array
            setTotalShips(response.data.total || 0);
        } catch (error) {
            console.error('Error al obtener los barcos:', error);
            setShips([]); // Fallback a un array vacío
        }
    };


    //   const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     try {
    //       await axios.post('http://localhost:3000/certificados', nuevoCertificado);
    //       setMostrarFormulario(false);
    //       fetchCertificados(); // Recargar los certificados después de agregar uno nuevo
    //     } catch (error) {
    //       console.error('Error al agregar el certificado:', error);
    //     }
    //   };

    const handleChangePage = (nuevaPagina: number) => {
        setPagina(nuevaPagina);
    };

    const totalPaginas = Math.ceil(totalShips / 50);

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Ships and Companies</h2>

            {/* Botón para agregar nueva cotizacion */}
            <div className="mb-4">
                <Link
                    to={"/ships/new"}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Agregar barco o compañia
                </Link>
            </div>

            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">#</th>
                        <th className="border p-2 text-left">Imo</th>
                        <th className="border p-2 text-left">Nombre</th>
                        <th className="border p-2 text-right">Tipo</th>
                        <th className="border p-2 text-left">Bandera</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(ships) && ships.length > 0 ? (
                        ships.map((ship) => (
                            <tr key={ship.id}>
                                <td className="border p-2">{ship?.id}</td>
                                <td className="border p-2">{ship.imo}</td>
                                <td className="border p-2">{ship?.name}</td>
                                <td className="border p-2 text-right">{ship?.type}</td>
                                <td className="border p-2">{ship.flag}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="border p-2 text-center text-gray-500">
                                No hay barcos
                            </td>
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

export default ShipsTable;
