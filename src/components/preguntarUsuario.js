const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// 3. Función principal: lo hace todo en orden con control de errores
async function preguntarUsuario(rutaArchivo, nombreHoja, columna, rutaJson, rutaExcelEntrada) {
    try {
        await generarJsonDesdeExcel(rutaExcelEntrada, nombreHoja, rutaJson);
        const resultados = await procesarCodigosDesdeJson(rutaArchivo, nombreHoja, columna, rutaJson);
        return resultados;
    } catch (error) {
        console.error('❌ Error en el formulario de usuario:', error);
        return []; // Devuelve un array vacío si falla
    }
}

module.exports = {
    preguntarUsuario
};
