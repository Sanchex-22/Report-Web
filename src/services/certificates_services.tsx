import axios, { AxiosInstance } from 'axios';

// Asegúrate de que el URL esté correctamente configurado en tu archivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Tipos para la respuesta de la API
interface Certificate {
  id: string;
  certificate_number: string | null;
  abbreviations: string;
  name: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

interface CertResponse {
  certificates: Certificate[];
  total: number;
}

export class CertServices {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
    });
  }

  // Definir el tipo de `pagina` como número
  async getAll(pagina: number): Promise<CertResponse> {
    try {
      console.log(API_URL)
      const response = await this.axiosInstance.get<CertResponse>(`${API_URL}/api/certificates/getAll`, {
        params: {
          page: pagina,
          limit: 50,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener certificados');
    }
  }
}
