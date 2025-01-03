import axios, { AxiosInstance } from 'axios';

// Asegúrate de que el URL esté correctamente configurado en tu archivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Tipos para la respuesta de la API
interface Ships {
  id: number;
  name: string;
  imo: string;
  type: string;
}

interface ShipResponse {
  ships: Ships[];
  message: string;
}

export class ShipServices {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
    });
  }

  async new(formData: FormData): Promise<ShipResponse> {
    try {
      const imo = formData.get('imo')
      const name = formData.get('name')
      const type = formData.get('type')
      const flag = formData.get('flag')

      // Hacer la solicitud a la API
      const response = await this.axiosInstance.post<ShipResponse>(`${API_URL}/api/ships/new`, { imo, name, type, flag });
      console.log(response.data);
      return response.data;

    } catch (error: any) {
      // Manejar el error
      if (axios.isAxiosError(error) && error.response) {
        // Si el error proviene de una respuesta de la API
        const message = error.response.data?.message || 'Error desconocido';
        throw new Error(message);
      } else {
        // Manejar cualquier otro tipo de error
        throw new Error('Error al realizar la solicitud');
      }
    }
  }

  // Definir el tipo de `pagina` como número
  async getSearch(term: string): Promise<ShipResponse> {
    try {
      console.log(API_URL);
      const response = await this.axiosInstance.get<ShipResponse>(`${API_URL}/api/ships/search`, {
        params: {
          searchTerm: term,
        },
      });
      console.log(response.data);
      return response.data;

    } catch (error: any) {
      // Manejar el error
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || 'Error desconocido';
        throw new Error(message);
      } else {
        throw new Error('Error al realizar la solicitud');
      }
    }
  }
}
