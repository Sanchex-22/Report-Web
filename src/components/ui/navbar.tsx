import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ICSLOGO from '../utils/logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getWordAfterBaseURL = () => {
    const currentPath = window.location.pathname; // Obtiene la ruta después del dominio
    const relativePath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath; // Elimina la barra inicial si existe
    const firstWord = relativePath.split('/')[0]; // Toma la primera palabra o segmento de la ruta
    return firstWord;
  };

  const word = getWordAfterBaseURL();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ICSLOGO className='w-10 h-10 select-none'/>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="/home"
                  className={`${
                    word === 'home' ? 'outline outline-2 outline-purple-500' : ''
                  } text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Inicio
                </a>
                <a
                  href="/reports"
                  className={`${
                    word === 'reports' ? 'outline outline-2 outline-purple-500' : ''
                  } text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Reportes
                </a>
                <a
                  href="/certificates"
                  className={`${
                    word === 'certificates' ? 'outline outline-2 outline-purple-500' : ''
                  } text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Certificados
                </a>
                <a
                  href="/ships"
                  className={`${
                    word === 'ships' ? 'outline outline-2 outline-purple-500' : ''
                  } text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Barcos & Co.
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex gap-2 items-center justify-center">
              <img src="" alt="" className='rounded-full w-8 h-8 bg-white'/>
              <span className='select-none'>Usuario</span>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-200 inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/home"
              className={`${
                word === 'home' ? 'outline outline-2 outline-purple-500' : ''
              } text-gray-800 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium`}
            >
              Inicio
            </a>
            <a
              href="/reports"
              className={`${
                word === 'reports' ? 'outline outline-2 outline-purple-500' : ''
              } text-gray-800 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium`}
            >
              Servicios
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
