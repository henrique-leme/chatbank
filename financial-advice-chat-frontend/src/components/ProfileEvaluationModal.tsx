import React from "react";

interface ProfileEvaluationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ProfileEvaluationModal: React.FC<ProfileEvaluationModalProps> = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Avaliação de Perfil</h2>
          <p className="mb-6">
            Seu perfil é básico. Deseja realizar a avaliação para aprimorá-lo?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onConfirm}
            >
              Sim
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={onClose}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEvaluationModal;
