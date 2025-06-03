const ExcelJS = require('exceljs');
const fs = require('fs');

async function procesarExcel(opcion, dato) {
  const rutaEntradas = 'entradas.xlsx';
  const rutaImeis = 'IMEIS.xlsx';
  const hojaNombre = 'Sheet1';

  // Crear copia de seguridad
  fs.copyFileSync(rutaImeis, 'IMEIS_backup.xlsx');

  // Cargar datos desde entradas.xlsx
  const workbookEntradas = new ExcelJS.Workbook();
  await workbookEntradas.xlsx.readFile(rutaEntradas);
  const hojaEntradas = workbookEntradas.getWorksheet(hojaNombre);
  const datos = hojaEntradas.getRows(2, hojaEntradas.rowCount - 1).map(row => ({
    codigo: row.getCell(1).value,
    imei: row.getCell(2).value,
    sn: row.getCell(3).value
  }));

  // Cargar IMEIS.xlsx
  const workbookImeis = new ExcelJS.Workbook();
  await workbookImeis.xlsx.readFile(rutaImeis);
  const hojaImeis = workbookImeis.getWorksheet(hojaNombre);

  if (opcion === 'A') {
    // Buscar el valor en la columna C
    let filaInicio = hojaImeis.findRow(hojaImeis.rowCount); // fallback por si no se encuentra
    for (let i = 1; i <= hojaImeis.rowCount; i++) {
      if (hojaImeis.getRow(i).getCell(3).value == dato) {
        filaInicio = hojaImeis.getRow(i);
        break;
      }
    }

    // Insertar después de la fila encontrada
    let filaIndice = filaInicio.number + 1;
    for (const item of datos) {
      const fila = hojaImeis.getRow(filaIndice++);
      fila.getCell(3).value = item.imei;
      fila.getCell(4).value = item.sn;
      fila.commit();
    }

    await workbookImeis.xlsx.writeFile(rutaImeis);
    return `Datos insertados en el rango existente a partir de ${dato}.`;

  } else if (opcion === 'B') {
    // Buscar la última fila con 'RANGO' en columna B
    let ultimaRangoRow = null;
    for (let i = hojaImeis.rowCount; i >= 1; i--) {
      const valor = hojaImeis.getRow(i).getCell(2).value;
      if (valor && valor.toString().toUpperCase().includes('RANGO')) {
        ultimaRangoRow = i;
        break;
      }
    }

    if (!ultimaRangoRow) throw new Error('No se encontró ninguna fila con "RANGO" en la columna B');

    // Insertar 2 filas vacías y después el encabezado del nuevo rango
    hojaImeis.spliceRows(ultimaRangoRow + 1, 0, [], []);
    hojaImeis.insertRow(ultimaRangoRow + 3, [null, `RANGO - ${dato}`]);

    // Insertar los datos
    let filaActual = ultimaRangoRow + 4;
    for (const item of datos) {
      hojaImeis.insertRow(filaActual++, [null, null, item.imei, item.sn]);
    }

    await workbookImeis.xlsx.writeFile(rutaImeis);
    return `Nuevo rango creado para el artículo ${dato}.`;
  }

  throw new Error('Opción inválida');
}

module.exports = procesarExcel;
