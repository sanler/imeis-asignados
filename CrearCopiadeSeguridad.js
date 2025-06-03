const { Console } = require('console');
const fs = require('fs');

async function CrearCopiadeSeguridad(rutaArchivo) {
  const backupRuta = rutaArchivo.replace(/\.xlsx$/, '_backup.xlsx');

  try {
    console.log('ESTOY AQUIIIII');
    fs.copyFileSync(rutaArchivo, backupRuta);
    console.log(`Copia de seguridad creada: ${backupRuta}`);
    console.log('ESTOY 22222');

    return {
      mensaje: `Copia de seguridad creada correctamente con el nombre ${backupRuta}`,
      estado: true
    };
  } catch (error) {
    console.error('Error al crear la copia de seguridad:', error);
    return {
      mensaje: 'No se ha podido crear la copia de seguridad.',
      estado: false
    };
  }
}

module.exports = { CrearCopiadeSeguridad };
