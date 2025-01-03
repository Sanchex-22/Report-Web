import React, { useState } from "react";
import { CertServices } from "../../services/certificates_services";
import Alert from "../alerts/alert";
import { Loader } from "lucide-react";


function CertificateForm(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);

    try {
      const instance = new CertServices();
      const response = await instance.new(formData);
      console.log(response)

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
        <h1 className="text-2xl font-bold mb-2 text-center col-span-2">Create Certificate</h1>

        <div className="mb-2">
          <label className="block text-gray-700">Name</label>
          <input
            type="name"
            name="name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 col-span-2"
        >
          Create
        </button>
      </form>
    </>
  );
}

export default CertificateForm;
