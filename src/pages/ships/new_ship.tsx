import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import Alert from '../../components/alerts/alert';
import { ShipServices } from '../../services/ships_services';

interface Ships {
    id: number;
    name: string;
    imo: string;
    type: string;
    flag: string;
}

const NewShip: React.FC = () => {
    const [shipData, setShipData] = useState<Ships>({
        id: 0,
        name: '',
        imo: '',
        type: 'Ship', // Predeterminado a Ship
        flag: 'Panama',
    });

    // loaders
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShipData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    try {
        const instance = new ShipServices();
        const response = await instance.new(formData);
      
        // Si hay un mensaje de respuesta, se establece el mensaje de éxito y se resetea el formulario
        if (response.message) {
          setSuccessMessage(response.message);
          form.reset();
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
    } catch (error: any) {
        console.error("Error submitting form:", error.message);
      
        // Verifica si el error es del tipo esperado (de la API)
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An error occurred while submitting the form.");
        }
      } finally {
        setSubmitLoading(false);
      }      
  };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
            {submitLoading && <Loader />}
            {successMessage && (
                <Alert type="success" message={successMessage} onClose={() => setSuccessMessage("")} />
            )}
            {errorMessage && (
                <Alert type="error" message={errorMessage} onClose={() => setErrorMessage("")} />
            )}
            <h2 className="text-2xl font-bold mb-4">Ships and Companies</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="imo">IMO Number</label>
                    <input
                        type="text"
                        id="imo"
                        name="imo"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="type">Type (Ship/Company)</label>
                    <div className="relative">
                        <select
                            id="type"
                            name='type'
                            className="block w-full px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        >
                            <option value="Ship">Ship</option>
                            <option value="Company">Company</option>
                        </select>
                    </div>
                </div>



                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="flag">Flag</label>
                    <select
                        id="flag"
                        name="flag"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Panama">Panama</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Belize">Belize</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewShip;
