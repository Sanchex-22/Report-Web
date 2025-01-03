// src/assets/images.ts
import React from 'react';
import logo from './../../images/logo.png';

// Crear un componente Flag que reciba el nombre del país como prop
interface Props {
  className?: string; // Prop opcional para clases CSS
}

const IcsLogo: React.FC<Props> = ({ className }) => {
  // Retorna la imagen correspondiente al país con la clase adicional si existe
  return <img src={logo} alt={logo} className={className} draggable={false}/>;
};

export default IcsLogo;
