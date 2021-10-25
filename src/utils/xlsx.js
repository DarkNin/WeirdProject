import XLSX from 'xlsx';
import {
    saveAs
} from 'file-saver';

export function exportToExcelByJson(jsonGroup, fileName) {
    return new Promise((resolve, reject) => {
        let sheetData = XLSX.utils.aoa_to_sheet(jsonGroup);
        sheetData['!cols'] = [{wch: 16},{wch: 30}]
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, sheetData);
        try {
            let wopts = {
                bookType: 'xlsx',
                bookSST: false,
                type: 'array'
            };
            let wbout = XLSX.write(wb, wopts);

            saveAs(new Blob([wbout], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }), fileName + ".xlsx");
            resolve('生成表格成功，请等待下载。')
        } catch (e) {
            reject(e)
        }
    })
}