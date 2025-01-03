// src/assets/images.ts
import React from 'react';
import panama from './../../images/PA.png';
import honduras from './../../images/HN.png';
import belize from './../../images/LA.png';

// Definir los tipos para las banderas
export type Country = 'panama' | 'honduras' | 'belize';

// Crear un componente Flag que reciba el nombre del país como prop
interface FlagProps {
  country: Country;
  className?: string; // Prop opcional para clases CSS
}

const Flag: React.FC<FlagProps> = ({ country, className }) => {
  // Un objeto que mapea los países a las imágenes
  const flags: Record<Country, string> = {
    panama,
    honduras,
    belize,
  };

  // Si no se encuentra el país, retorna una imagen por defecto o un mensaje
  if (!flags[country]) {
    return <div>Bandera no disponible</div>;
  }

  // Retorna la imagen correspondiente al país con la clase adicional si existe
  return <img src={flags[country]} alt={country} className={className} />;
};

export default Flag;
