import React, { useState } from 'react';
import { ImCross, ImSearch } from 'react-icons/im';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: () => void;
    NmPesquisa: string;
  }

const ModalPesquisa:React.FC<ModalProps> =  ({ isOpen, onClose, onSearch, NmPesquisa }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const handleSearch = () => {
      onSearch();
    };


    
    return(
        <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-500 opacity-50"></div>
        <div className="bg-white p-4 rounded-lg shadow-lg z-10 w-2/3">
          <button className="absolute top-2 right-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 p-2" onClick={onClose}>
            <ImCross size={20} color="#000" />
          </button>
          <h1>ascascasc</h1>
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="mb-4">
              <label htmlFor="searchInput" className="block font-semibold">Código</label>
              <input
                id="searchInput"
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="searchInput" className="block font-semibold">{NmPesquisa}</label>
              <input
                id="searchInput"
                type="text"
                className="w-full lg:w-96 border border-gray-300 rounded px-2 py-1" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSearch}
            >
              <ImSearch size="20px"/>
            </button>
            <button
              className="bg-gray-300 text-gray-700 ml-2 px-4 py-2 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
}

export default ModalPesquisa;