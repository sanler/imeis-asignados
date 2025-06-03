const fs = require('fs');
const ExcelJS = require('exceljs');

function esFilaVacia(fila) {
  return fila.values.every((cell) => cell === null || cell === undefined || cell === '');
}

const buscarCodigoEnExcel = async ( rutaArchivo, nombreHoja, columna, rutaJson, rutaExcelEntrada) => {
  console.log('hHOLAAAAS');
  const listaCodigos = JSON.parse(fs.readFileSync(rutaJson, 'utf-8'));
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(rutaArchivo);
  const worksheet = workbook.getWorksheet(nombreHoja);

  const resultados = [];

  for (const { codigoBuscado } of listaCodigos) {
    let codigoEncontrado = false;

    worksheet.eachRow((row, rowNumber) => {
      const celda = row.getCell(columna + 1); // columna es base 0
      if (celda.value === codigoBuscado && !codigoEncontrado) {
        console.log(celda.value+ ' '+ codigoBuscado);
        codigoEncontrado = true;
      }
    });

    resultados.push({
      codigo: codigoBuscado,
      encontrado: codigoEncontrado,
    });
  }

  return {
    estado: true,
    resultados,
  };
};

module.exports = { buscarCodigoEnExcel };
