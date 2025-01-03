import React, { useState } from "react";

type FormData = {
  shipname: string;
  imoNumber: string;
  certificateType: string;
  certificateName: string;
  certificateNo: string;
  dateIssuance: string;
  dateExpire: string;
  dateEndorsement: string;
  datePlanApproval: string;
  price: string;
};

function CertificateForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    shipname: "",
    imoNumber: "",
    certificateType: "FULL TERM",
    certificateName: "",
    certificateNo: "",
    dateIssuance: "",
    dateExpire: "",
    dateEndorsement: "",
    datePlanApproval: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-4 shadow-md rounded-lg sm:w-full lg:w-3/4 xl:w-1/2 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <h1 className="text-2xl font-bold mb-2 text-center col-span-2">Certificate Form</h1>
      
      <div className="mb-2">
        <label className="block text-gray-700">Shipname/company</label>
        <input
          type="text"
          name="shipname"
          value={formData.shipname}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">IMO No.</label>
        <input
          type="text"
          name="imoNumber"
          value={formData.imoNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">Certificate Name</label>
        <select
          name="certificateName"
          value={formData.certificateName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Safety Certificate">Safety Certificate</option>
          <option value="Pollution Certificate">Pollution Certificate</option>
          <option value="Equipment Certificate">Equipment Certificate</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">Certificate Type</label>
        <select
          name="certificateType"
          value={formData.certificateType}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Full Term">Full Term</option>
          <option value="Interim">Interim</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">Certificate No.</label>
        <input
          type="text"
          name="certificateNo"
          value={formData.certificateNo}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">Date Issuance</label>
        <input
          type="date"
          name="dateIssuance"
          value={formData.dateIssuance}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">Date of Expire</label>
        <input
          type="date"
          name="dateExpire"
          value={formData.dateExpire}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">Date of Endorsement</label>
        <input
          type="date"
          name="dateEndorsement"
          value={formData.dateEndorsement}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">Date of Plan Approval</label>
        <input
          type="date"
          name="datePlanApproval"
          value={formData.datePlanApproval}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 col-span-2"
      >
        Enviar
      </button>
    </form>
  );
}

export default CertificateForm;
