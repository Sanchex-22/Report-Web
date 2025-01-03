import axios, { AxiosInstance } from 'axios';

// Asegúrate de que el URL esté correctamente configurado en tu archivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Tipos para la respuesta de la API

interface ReportResponse {
  success: boolean;
  message: string;
}

export class ReportServices {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
    });
  }

  // Definir el tipo de `pagina` como número
  async new(formData: FormData): Promise<ReportResponse> {
    try {
      console.log(API_URL)
      const name = formData.get('name')
      const imo = formData.get('imo')
      const certificate = formData.get('certificate')
      const certificate_number = formData.get('certificate_number')
      const type = formData.get('type')
      const price = formData.get('price')
      const date_issuance = formData.get('date_issuance')
      const date_expire = formData.get('date_expire')
      const date_endorsement = formData.get('date_endorsement')
      const date_plan_approval = formData.get('date_plan_approval')
      console.log("Form submitted:", name, imo, certificate, certificate_number, type, price, date_issuance, date_expire, date_endorsement, date_plan_approval);
      const response = await this.axiosInstance.post<ReportResponse>(`${API_URL}/api/reports/new`, {
        name, imo, certificate, certificate_number, type, price, date_issuance, date_expire, date_endorsement, date_plan_approval
      });
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener certificados');
    }
  }
}
