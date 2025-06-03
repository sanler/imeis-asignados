const ExcelJS = require('exceljs');
const fs = require('fs');

async function buscarCodigoEnExcel(rutaIMEIS, nombreHoja, columna, rutaJson, rutaEntrada) {
  const resultados = [];

  try {
    // Leer entrada.xlsx y sacar los códigos
    const wbEntrada = new ExcelJS.Workbook();
    await wbEntrada.xlsx.readFile(rutaEntrada);
    const hojaEntrada = wbEntrada.getWorksheet(1);
    const codigosEntrada = [];

    hojaEntrada.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Ignorar encabezado
        const codigo = row.getCell(1).value?.toString().trim();
        if (codigo) codigosEntrada.push(codigo);
      }
    });

    // Leer IMEIS.xlsx y buscar los códigos
    const wbIMEIS = new ExcelJS.Workbook();
    await wbIMEIS.xlsx.readFile(rutaIMEIS);
    const hojaIMEIS = wbIMEIS.getWorksheet(nombreHoja);

    for (const codigo of codigosEntrada) {
      let encontrado = false;
      hojaIMEIS.eachRow((row) => {
        const celda = row.getCell(columna).value;
        if (celda && celda.toString().trim() === codigo) {
          encontrado = true;
        }
      });

      resultados.push({ codigo, encontrado });
    }

    return { estado: true, resultados };
  } catch (error) {
    console.error('Error en buscarCodigoEnExcel:', error);
    return { estado: false, mensaje: 'Error al buscar los códigos.' };
  }
}

module.exports = { buscarCodigoEnExcel };
