const XLSX = require('xlsx');
const fs = require('fs');

// Función para convertir el Excel a JSON
function excelToArray(filePath) {
    // Leer el archivo Excel
    const workbook = XLSX.readFile(filePath);
    
    // Obtener la primera hoja (sheet FIME)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const data = XLSX.utils.sheet_to_json(worksheet, {
        header: ['MATERIA', 'DEPARTAMENTO', 'CREDITOS', 'DESCRIPCION'],
        range: 1 // Saltar la fila de encabezado
    });
    
    // Filtrar y formatear los datos
    return data.map(row => ({
        MATERIA: row.MATERIA || row['__EMPTY'],
        DEPARTAMENTO: row.DEPARTAMENTO || row['__EMPTY_1'],
        CREDITOS: parseInt(row.CREDITOS || row['__EMPTY_2'], 10),
        DESCRIPCION: row.DESCRIPCION || row['__EMPTY_3']
    }));
}

// Uso
const materiasArray = excelToArray('profescore_excel.xlsx');

// Guardar resultado en archivo
fs.writeFileSync('materias.json', JSON.stringify(materiasArray, null, 2));

console.log('Arreglo generado correctamente en materias.json');
console.log('Total de materias procesadas:', materiasArray.length);