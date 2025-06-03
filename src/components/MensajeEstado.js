import React from 'react';
import './MensajeEstado.css';

const MensajeEstado = ({ mensaje, estado }) => {
  if (!mensaje) return null;

  const getColorClass = () => {
    switch (estado) {
      case 'procesando':
        return 'mensaje-estado procesando';
      case 'success':
        return 'mensaje-estado success';
      case 'error':
        return 'mensaje-estado error';
      default:
        return 'mensaje-estado';
    }
  };

  return (
    <div className={getColorClass()}>
      {estado === 'procesando' && <span className="spinner">⏳</span>}
      {mensaje}
    </div>
  );
};

export default MensajeEstado;
