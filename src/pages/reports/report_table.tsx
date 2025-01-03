import React, { useState } from "react";
import * as XLSX from "xlsx";

const formatDate = (date: string | null): string => {
  if (!date) return "N/A";
  const newDate = new Date(date);
  const day = String(newDate.getUTCDate()).padStart(2, "0");
  const month = String(newDate.getUTCMonth() + 1).padStart(2, "0");
  const year = newDate.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateLetters = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {day: "numeric", month: "long", year: "numeric", timeZone: "UTC"})
  ;
};

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
  ship: Ship;
}

interface Ship {
  flag: string | null;
  id: string | null;
  imo: string | null;
  name: string | null;
  type: string | null;
}

interface Range {
  startDate: string | null;
  endDate: string | null;
}

const FilteredReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [range, setRange] = useState<Range>({ startDate: "", endDate: "" });
  const [loading, setLoading] = useState(false);
  const [flagFilter, setFlagFilter] = useState<string>("");

  const fetchReports = async () => {
    if (!range.startDate || !range.endDate) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/reports/getFilterReport?startDate=${range.startDate}&endDate=${range.endDate}`
      );
      const data = await response.json();
      if (data.reports) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const flagOptions = ["panama", "honduras", "belize"];

  // Función de filtrado
  const filteredReports = reports.filter((report) => {
    if (!flagFilter.trim()) return true; // Mostrar todo si no hay filtro seleccionado

    const flagLower = flagFilter.toLowerCase().trim();
    const reportFlag = (report?.ship.flag || "").toLowerCase();

    return reportFlag.includes(flagLower);
  });

  const downloadExcel = () => {
    const worksheetData = filteredReports.map((report, index) => ({
      ID: index,
      Name: report.name,
      IMO: report.imo,
      Certificate: report.certificate,
      "Certificate Number": report.certificateNumber,
      Type: report.type,
      "Date Issuance": formatDate(report.dateIssuance),
      "Date Expire": formatDate(report.dateExpire),
      "Date Endorsement": formatDate(report.dateEndorsement),
      "Date Plan Approval": formatDate(report.datePlanApproval),
      "Date Created": formatDate(report.dateCreate),
      Price: `$${report.price.toLocaleString()}`,
    }));

    const totalPrice = filteredReports.reduce((acc, report) => acc + (report.price || 0), 0);
    worksheetData.push({
      ID: "Total",
      Name: "Total",
      IMO: "",
      Certificate: "",
      "Certificate Number": "",
      Type: "",
      "Date Issuance": "",
      "Date Expire": "",
      "Date Endorsement": "",
      "Date Plan Approval": "",
      "Date Created": "",
      Price: `$${totalPrice.toLocaleString()}`,
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "reports.xlsx");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="date"
          className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          value={range.startDate || ""}
          onChange={(e) => setRange({ ...range, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          value={range.endDate || ""}
          onChange={(e) => setRange({ ...range, endDate: e.target.value })}
        />

        {/* Dropdown filter for flag */}
        <select
          className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          value={flagFilter}
          onChange={(e) => setFlagFilter(e.target.value)}
        >
          <option value="">Select Flag</option>
          {flagOptions.map((flag, index) => (
            <option key={index} value={flag}>
              {flag}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={fetchReports}
          disabled={!range.startDate || !range.endDate}
        >
          {loading ? "Loading..." : "Buscar"}
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          onClick={downloadExcel}
        >
          Descargar Reporte
        </button>
      </div>

      {range.startDate && range.endDate && (
        <div className="mb-4 text-xl font-semibold">
          Reporte de Fechas: {formatDateLetters(range.startDate)} al {formatDateLetters(range.endDate)}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">IMO</th>
              <th className="border p-2">Certificate</th>
              <th className="border p-2">Certificate Number</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Flag</th>
              <th className="border p-2">Date Issuance</th>
              <th className="border p-2">Date Expire</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={report?.id} className="hover:bg-gray-50">
                <td className="border p-2">{index}</td>
                <td className="border p-2">{report?.name}</td>
                <td className="border p-2">{report?.imo}</td>
                <td className="border p-2">{report?.certificate}</td>
                <td className="border p-2">{report?.certificateNumber}</td>
                <td className="border p-2">{report?.type}</td>
                <td className="border p-2">{report?.flag}</td>
                <td className="border p-2">{formatDate(report?.dateIssuance)}</td>
                <td className="border p-2">{formatDate(report?.dateExpire)}</td>
                <td className="border p-2">${report?.price?.toLocaleString()}</td>
              </tr>
            ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan={9} className="border p-2 text-right">Total</td>
                <td className="border p-2">${filteredReports.reduce((acc, report) => acc + (report.price || 0), 0).toLocaleString()}</td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilteredReports;
