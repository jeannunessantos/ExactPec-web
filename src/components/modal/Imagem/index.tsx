import React from 'react';
import { ImCross} from "react-icons/im";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
  }

  const ModalImagem: React.FC<ModalProps> = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;
    return (
        <div id='imagemAnimal' className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto hover:scale-105 transition-all">
                <div className="modal-content p-4">
                    <div className="flex justify-between">
                        <img src={imageUrl} alt="Imagem" className="w-full " />
                        <div onClick={onClose}>
                            <ImCross size={10} color="#000" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalImagem;