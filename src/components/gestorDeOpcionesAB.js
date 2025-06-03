const insertarDatos = require('./insertarDatos'); // ajusta la ruta si está en otra carpeta
const ExcelJS = require('exceljs');

function esFilaVacia(fila) {
    return fila.values.every(value => value === null || value === undefined || value === '');
}


async function gestorDeOpcionesAB({ opcion, nombreHoja, columna, codigoBuscado, textoInsertado, numeroInsertado, rutaArchivo, primerNumero, nombreArticulo }) {
    try {

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(rutaArchivo);
        const worksheet = workbook.getWorksheet(nombreHoja);

            if (opcion.toUpperCase() === 'A') {
                    let filaInicial = null;
                    console.log('opcion:', opcion, 'worksheet:', worksheet, 'columna:', columna, 'codigoBuscado:', codigoBuscado,  'textoInsertado:', textoInsertado, 'numeroInsertado:', numeroInsertado, 'workbook:', workbook, 'primerNumero:', primerNumero, 'nombreArticulo:', nombreArticulo);

                    worksheet.eachRow((row, rowNumber) => {
                    if (row.getCell(3).value == primerNumero && filaInicial === null) {
                        filaInicial = rowNumber;
                    }
                    });

                    if (filaInicial !== null) {
                    for (let i = filaInicial + 1; i <= worksheet.rowCount + 1; i++) {
                        const fila = worksheet.getRow(i);
                        if (esFilaVacia(fila)) {
                            insertarDatos(worksheet, i, columna, codigoBuscado, textoInsertado, numeroInsertado, workbook, opcion);
                            await workbook.xlsx.writeFile(rutaArchivo);
                            console.log(`Archivo final guardado como ${rutaArchivo}`);
                            return { estado: true, mensaje: `Insertado en fila ${i}` };
                        }
                    }
                    return { estado: false, mensaje: 'No se encontró una fila vacía después del rango.' };
                    } else {
                    return { estado: false, mensaje: 'No se encontró el primer número del rango en la columna C.' };
                    }
            }

            if (opcion.toUpperCase() === 'B') {

                    console.log('ÉXITO OPCIÓN B!!');
                 //   return { estado: true, mensaje: `ÉXITO OPCIÓN B!!` };

                
                let ultimaFilaRango = null;

                worksheet.eachRow((row, rowNumber) => {
                if (row.getCell(2).value === 'RANGO') {
                    ultimaFilaRango = rowNumber;
                }
                });

                if (ultimaFilaRango !== null) {
                let filaRango = null;
                let filasVaciasEncontradas = 0;

                for (let i = ultimaFilaRango + 1; i <= worksheet.rowCount + 1; i++) {
                    const fila = worksheet.getRow(i);
                    if (esFilaVacia(fila)) {
                    filasVaciasEncontradas++;
                    if (filasVaciasEncontradas === 3) {
                        filaRango = i;
                        break;
                    }
                    }
                }

                if (filaRango !== null) {
                    worksheet.insertRow(filaRango, []);
                    worksheet.insertRow(filaRango, []);
                    worksheet.insertRow(filaRango, []);

                    const valorAnterior = worksheet.getRow(ultimaFilaRango).getCell(4).value || 0;
                    const nuevoInicio = Number(valorAnterior) + 1;
                    const nuevoFin = nuevoInicio + 9999999;

                    console.log('nuevoIniciooooo', nuevoInicio, 'nuevoFinnnnnnn', nuevoFin);

                    const fila = worksheet.getRow(filaRango);
                    fila.getCell(2).value = 'RANGO';
                    fila.getCell(3).value = nuevoInicio;
                    fila.getCell(4).value = nuevoFin;
                    fila.getCell(7).value = nombreArticulo;

                    insertarDatos(worksheet, filaRango + 1, columna, codigoBuscado, textoInsertado, numeroInsertado, workbook, opcion);
                    await workbook.xlsx.writeFile(rutaArchivo);
                    console.log(`Archivo final guardado como ${rutaArchivo}`);

                    return { estado: true, mensaje: `Rango ${nuevoInicio} - ${nuevoFin} creado en la fila ${filaRango}` };
                }

                return { estado: false, mensaje: 'No se encontró espacio para insertar el nuevo rango.' };
                }

                return { estado: false, mensaje: 'No se encontró ninguna fila con RANGO en la columna B.' };
            
            }

 
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        return { estado: false, mensaje: 'Opción no válida.' };
    }
       

}

module.exports = { gestorDeOpcionesAB };
