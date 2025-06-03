// insertarDatos.js
const ExcelJS = require('exceljs');

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

const insertarDatos = async (worksheet, filaVacia, columna, codigoBuscado, textoInsertado, numeroInsertado, workbook, opcion) => {
    console.log('HOLA ESTOY EN INSERTAR DATOS OPCIÓN:' + opcion);
    try {
        const nuevaFila = worksheet.getRow(filaVacia);
        const fechaActual = new Date().toLocaleDateString();
        const resultados = [];
        let inicio = 0;
        let fin = 0;

        nuevaFila.getCell(1).value = fechaActual;
        nuevaFila.getCell(columna + 1).value = codigoBuscado;
        nuevaFila.getCell(columna + 2).value = textoInsertado;
        nuevaFila.getCell(columna + 5).value = numeroInsertado;
        nuevaFila.getCell(columna + 3).value = numeroInsertado * 10;

        worksheet.insertRow(filaVacia + 1, []);

        if (opcion.toUpperCase() === 'A' || opcion.toUpperCase() === 'C') {
            console.log('HA ELEGIDO LA OPCIÓN A');
            const valorAnteriorCuartaCelda = worksheet.getRow(filaVacia - 1).getCell(4).value || 0;
            nuevaFila.getCell(3).value = valorAnteriorCuartaCelda + 1;
        } else if (opcion.toUpperCase() === 'B') {
        console.log('HA ELEGIDO LA OPCIÓN B');
        const valorAnteriorCuartaCelda = worksheet.getRow(filaVacia - 1).getCell(3).value || 0;
        nuevaFila.getCell(3).value = valorAnteriorCuartaCelda + 1;
        }

        const valorTerceraCelda = nuevaFila.getCell(3).value || 0;
        const valorCelda9 = nuevaFila.getCell(9).value || 0;
        nuevaFila.getCell(4).value = valorTerceraCelda + valorCelda9 - 1;
        inicio = nuevaFila.getCell(3).value || 0;
        fin = nuevaFila.getCell(4).value || 0;

        const numerosValidos = obtenerNumerosValidos(inicio, fin);
        console.log(`Código ${codigoBuscado}: ${numerosValidos.length} números válidos`);

        let hojaLuhn = workbook.getWorksheet('Números Luhn');
        if (!hojaLuhn) {
            hojaLuhn = workbook.addWorksheet('Números Luhn');
        }

        let primeraColumnaVacia = 1;
        while (hojaLuhn.getColumn(primeraColumnaVacia).values.some(v => v !== undefined)) {
            primeraColumnaVacia++;
        }

        hojaLuhn.getRow(1).getCell(primeraColumnaVacia).value = {
            richText: [
                { text: codigoBuscado, font: { bold: true, size: 12 } },
                { text: '\n', font: { size: 12 } },
                { text: textoInsertado, font: { italic: true, size: 11 } }
            ]
        };
        hojaLuhn.getRow(1).getCell(primeraColumnaVacia).alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true
        };
        hojaLuhn.getColumn(primeraColumnaVacia).width = 30;

        numerosValidos.forEach((numero, index) => {
            const fila = hojaLuhn.getRow(index + 2);
            fila.getCell(primeraColumnaVacia).value = numero;
            fila.getCell(primeraColumnaVacia).numFmt = '0';
        });

        resultados.push(numerosValidos);
        console.log(resultados);
        return resultados;

    } catch (error) {
        console.error('❌ Error AL generar números de Luhn, OPCION C:', error);
        return error;
    }
};

module.exports = insertarDatos;
