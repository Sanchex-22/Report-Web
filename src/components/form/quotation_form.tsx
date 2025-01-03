import React, { useEffect, useRef, useState } from "react";
import { CertServices } from "../../services/certificates_services";
import { ShipServices } from "../../services/ships_services";
import { ReportServices } from "../../services/report_services";
import { Loader } from "lucide-react";
import Alert from "../alerts/alert";

interface Certificate {
  id: string;
  certificate_number: string | null;
  abbreviations?: string;
  name: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

interface Ship {
  id: number;
  name: string;
  imo: string;
  type: string;
}

const QuotationForm = (): JSX.Element => {
  const [certificados, setCertificados] = useState<Certificate[]>([]);
  const [pagina, setPagina] = useState<number>(1);
  const [shipImo, setShipImo] = useState<string>("");
  const [shipName, setShipName] = useState<string>("");
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shipImo.length > 1) {
      fetchShips();
      setIsDropdownOpen(true);
    } else {
      setShips([]);
      setIsDropdownOpen(false);
    }
  }, [shipImo]);

  useEffect(() => {
    fetchCertificados();
  }, [pagina]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const fetchShips = async (): Promise<void> => {
    setLoading(true);
    try {
      const instance = new ShipServices();
      const response = await instance.getSearch(shipImo);
      setShips(response.ships || []);
    } catch (error) {
      console.error("Error al buscar barcos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificados = async (): Promise<void> => {
    try {
      const instance = new CertServices();
      const response = await instance.getAll(pagina);
      setCertificados(Array.isArray(response.certificates) ? response.certificates : []);
    } catch (error) {
      console.error("Error al obtener los certificados:", error);
      setCertificados([]);
    }
  };

  const handleSelectShip = (ship: Ship): void => {
    setShipImo(ship.imo);
    setShipName(ship.name);
    setSelectedShip(ship);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    if (selectedShip) formData.set("imo", selectedShip.imo);

    try {
      const instance = new ReportServices();
      const response = await instance.new(formData);
      console.log(response)
      if (response.message) {
        setSuccessMessage(response.message);
        form.reset();
        setShipImo("");
        setShipName("");
        setSelectedShip(null); 
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
    <>
      {submitLoading && <Loader />}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage("")} />
      )}
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage("")} />
      )}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-4 shadow-md rounded-lg sm:w-full lg:w-3/4 xl:w-1/2 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <h1 className="text-2xl font-bold mb-2 text-center col-span-2">Quotation Form</h1>

        <div className="mb-2 relative col-span-2">
          <label className="block text-gray-700">IMO No. <span className="text-red-600">(*)</span></label>
          <input
            type="text"
            name="imo"
            value={shipImo}
            onChange={(e) => setShipImo(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a ship..."
          />
          {isDropdownOpen && shipImo.length > 1 && (
            <div
              ref={dropdownRef}
              className="absolute z-10 bg-white border border-gray-300 shadow-md mt-1 w-full max-h-60 overflow-y-auto"
            >
              {loading ? (
                <div className="p-2 text-center text-gray-600">Loading...</div>
              ) : ships.length > 0 ? (
                ships.map((ship) => (
                  <div
                    key={ship.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectShip(ship)}
                  >
                    {ship.name} ({ship.imo})
                  </div>
                ))
              ) : (
                <div className="p-2 text-center text-gray-500">No ships found</div>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="">Shipname / company <span className="text-red-600">(*)</span></label>
          <input
            type="text"
            name="name"
            value={shipName}
            readOnly
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Certificate Name <span className="text-red-600">(*)</span></label>
          <select
            name="certificate"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {certificados.length > 0 ? (
              certificados.map((cert) => (
                <option key={cert.id} value={cert.name}>
                  {cert.name}
                </option>
              ))
            ) : (
              <option value="">No certificates available</option>
            )}
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Certificate Type <span className="text-red-600">(*)</span></label>
          <select
            name="type"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Full Term">Full Term</option>
            <option value="Interim">Interim</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Certificate No. <span className="text-red-600">(*)</span></label>
          <input
            type="text"
            name="certificate_number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Date Issuance</label>
          <input
            type="date"
            name="date_issuance"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Date of Expire</label>
          <input
            type="date"
            name="date_expire"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Date of Endorsement</label>
          <input
            type="date"
            name="date_endorsement"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Date of Plan Approval</label>
          <input
            type="date"
            name="date_plan_approval"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Price <span className="text-red-600">(*)</span></label>
          <input
            type="number"
            name="price"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 col-span-2"
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default QuotationForm;