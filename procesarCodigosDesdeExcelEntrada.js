const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const insertarDatos = require('./src/components/insertarDatos'); // ajusta la ruta si está en otra carpeta

//0. insertar Datos según opción
function esFilaVacia(fila) {
    return fila.values.every(value => value === null || value === undefined || value === '');
}
function verificarLuhn(numero) {
    const digits = numero.toString().split('').reverse().map(Number);
    const checksum = digits.reduce((sum, digit, index) => {
        if (index % 2 === 1) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        return sum + digit;
    }, 0);
    return checksum % 10 === 0;
}

function obtenerNumerosValidos(inicio, fin) {
    const validos = [];
    for (let i = inicio; i <= fin; i++) {
        if (verificarLuhn(i)) {
            validos.push(i);
        }
    }
    return validos;
}


// 1. Generar JSON desde entrada.xlsx
async function generarJsonDesdeExcel(rutaExcel, hojaNombre, rutaJson) {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(rutaExcel);
        const worksheet = workbook.getWorksheet(hojaNombre);

        const datos = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const codigoBuscado = row.getCell(1).value;
            const textoInsertado = row.getCell(2).value;
            const numeroInsertado = row.getCell(3).value;

            if (codigoBuscado && textoInsertado && numeroInsertado) {
                datos.push({
                    codigoBuscado: String(codigoBuscado),
                    textoInsertado: String(textoInsertado),
                    numeroInsertado: Number(numeroInsertado)
                });
            }
        });

        fs.writeFileSync(rutaJson, JSON.stringify(datos, null, 2), 'utf-8');
        console.log(`✅ Archivo ${rutaJson} generado con ${datos.length} conjuntos de datos.`);
    } catch (error) {
        console.error('❌ Error al generar el JSON desde Excel:', error);
        throw error; // Propagamos el error para que lo capture la función principal
    }
}

// 2. Buscar códigos del JSON en IMEIS.xlsx

const procesarCodigosDesdeJson = async ( rutaArchivo, nombreHoja, columna, rutaJson) => {
    try {  
          console.log('hHOLAAAAS');
          const listaCodigos = JSON.parse(fs.readFileSync(rutaJson, 'utf-8'));
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.readFile(rutaArchivo);
          const worksheet = workbook.getWorksheet(nombreHoja);

          const resultados = [];
        

            for (const  { codigoBuscado, textoInsertado, numeroInsertado } of listaCodigos) {
              let filaVacia = null;
              let codigoEncontrado = false;
              const imeisGenerados = [];

          for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
              const row = worksheet.getRow(rowNumber);
              const celda = row.getCell(columna + 1);

              if (celda.value === codigoBuscado && !codigoEncontrado) {
                  for (let i = rowNumber + 1; i <= worksheet.rowCount + 1; i++) {
                      const siguienteFila = worksheet.getRow(i);
                      if (esFilaVacia(siguienteFila)) {
                          filaVacia = i;
                          break;
                      }
                  }

                  if (filaVacia === null) {
                      filaVacia = worksheet.rowCount + 1;
                  }

                  const resultado = await insertarDatos(
                      worksheet, filaVacia, columna,
                      codigoBuscado, textoInsertado, numeroInsertado,
                      workbook, 'C'
                  );

                  imeisGenerados.push(...resultado.flat());
                  console.log('IMEIS GENERADOOOOOOSSSSSSSSSSSSS');
                  console.log(JSON.stringify(imeisGenerados));

                  codigoEncontrado = true;
              }
          }



                resultados.push({
                  codigo: codigoBuscado,
                  encontrado: codigoEncontrado,
                  imeisCreados: imeisGenerados,
                  numeroInsertado: numeroInsertado,
                  textoInsertado: textoInsertado
                });
            }





            
            await workbook.xlsx.writeFile(rutaArchivo);
            console.log(`Archivo final guardado como ${rutaArchivo}`);

            return {
              estado: true,
              resultados,
          };
    } catch (error) {
            console.error('Error al procesar el archivo:', error);
      }
};

// 3. Función principal: lo hace todo en orden con control de errores
async function procesarCodigosDesdeExcelEntrada(rutaArchivo, nombreHoja, columna, rutaJson, rutaExcelEntrada) {
    try {
        await generarJsonDesdeExcel(rutaExcelEntrada, nombreHoja, rutaJson);
        const resultados = await procesarCodigosDesdeJson(rutaArchivo, nombreHoja, columna, rutaJson);
        return resultados;
    } catch (error) {
        console.error('❌ Error en el procesamiento completo:', error);
        return []; // Devuelve un array vacío si falla
    }
}

module.exports = {
    procesarCodigosDesdeExcelEntrada
};
