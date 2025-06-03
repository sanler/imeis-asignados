const express = require('express');
const cors = require('cors');
const { buscarCodigoEnExcel } = require('./buscarCodigoEnExcel');
const { CrearCopiadeSeguridad } = require('./CrearCopiadeSeguridad');
const { procesarCodigosDesdeExcelEntrada } = require('./procesarCodigosDesdeExcelEntrada');
const { insertarDatos } = require('./src/components/insertarDatos'); // <-- importa aquí
const { gestorDeOpcionesAB } = require('./src/components/gestorDeOpcionesAB'); 
// Constantes
const rutaArchivo = 'C:/Users/t151744/OneDrive - Telefonica/IMEI/imeis-asignados/IMEIS.xlsx';
const nombreHoja = 'Sheet1';
const columna = 6;
const rutaExcelEntrada = 'C:/Users/t151744/OneDrive - Telefonica/IMEI/imeis-asignados/entrada.xlsx';
const rutaJson = 'C:/Users/t151744/OneDrive - Telefonica/IMEI/imeis-asignados/datos.json';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Opción A
app.post('/procesarA', async (req, res) => {
  const { codigo, numeroInicio, numeroInsertado, textoInsertado } = req.body;
  console.log('Procesando opción A para:', codigo, 'con primer número:', numeroInicio, 'Unidades:', numeroInsertado, 'Texto:', textoInsertado);

  try {
    //const datos = require(`./${rutaJson}`);
    const resultado = await gestorDeOpcionesAB({
      opcion: 'A',
      nombreHoja,
      columna,    
      codigoBuscado: codigo,
      textoInsertado,
      numeroInsertado,
      rutaArchivo,
      primerNumero: numeroInicio,
      nombreArticulo:' '
    });

 //opcion, worksheet, columna, codigoBuscado, textoInsertado, numeroInsertado, workbook, primerNumero, nombreArticulo 

  
  res.json(resultado);
  } catch (error) {
    console.error('Error en /procesarA:', error);
    res.status(500).json({ estado: false, mensaje: 'Error al procesar la opción A.' });
  }
});

// ✅ Opción B
app.post('/procesarB', async (req, res) => {
  const { codigo, nombreArticulo, numeroInsertado, textoInsertado } = req.body;
  console.log('Procesando opción B para:', codigo, 'con nombre Artículo:', nombreArticulo, 'Unidades:', numeroInsertado, 'Texto:', textoInsertado);

  try {
    //const datos = require(`./${rutaJson}`);
    const resultado = await gestorDeOpcionesAB({
      opcion: 'B',
      nombreHoja,
      columna,    
      codigoBuscado: codigo,
      textoInsertado,
      numeroInsertado,
      rutaArchivo,
      primerNumero: ' ',
      nombreArticulo
    });
    res.json(resultado);
  } catch (error) {
    console.error('Error en /procesarB:', error);
    res.status(500).json({ estado: false, mensaje: 'Error al procesar la opción B.' });
  }
});

app.post('/copiaSeguridad', async (req, res) => {
  try {
    const resultado = await CrearCopiadeSeguridad(
      rutaArchivo,
      nombreHoja,
      columna,
      rutaJson,
      rutaExcelEntrada
    );
    res.json(resultado); // <-- ✅ ESTA LÍNEA CAMBIADA
  } catch (error) {
    console.error('Error en CrearCopiadeSeguridad:', error);
    res.status(500).json({
      mensaje: 'Error al crear la copia de seguridad.',
      estado: false
    });
  }
});

app.post('/buscarCodigos', async (req, res) => {
  try {
    const resultado = await procesarCodigosDesdeExcelEntrada(
      rutaArchivo,
      nombreHoja,
      columna,
      rutaJson,
      rutaExcelEntrada
    );
    res.json(resultado);
  } catch (error) {
    console.error('Error en procesarCodigosDesdeExcelEntrada:', error);
    res.status(500).json({
      mensaje: 'Error al buscar los códigos.',
      estado: false
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
