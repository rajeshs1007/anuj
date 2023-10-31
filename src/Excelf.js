
import React, { useState , useEffect } from 'react';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import Dropzone from 'react-dropzone';




export default function Excelf() {
    
  const [workbook1, setWorkbook1] = useState(null);
  const [workbook2, setWorkbook2] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedColumns, setSelectedColumns] = useState('');
  const [differingCells, setDifferingCells] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  // State for the separate files
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  // State for column mapping
  const [columnMapping, setColumnMapping] = useState('');
  const [mappedColumns, setMappedColumns] = useState([]);

  useEffect(() => {
    if (workbook1 && workbook2 && selectedSheet && columnMapping) {
      compareWorkbooks();
    }
  }, [workbook1, workbook2, selectedSheet, columnMapping]);

  const handleFileDrop = (files, workbookNum) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      const workbook = XLSX.read(fileData, { type: 'array' });

      if (workbookNum === 1) {
        setWorkbook1(workbook);
        setFile1(files[0]);
      } else if (workbookNum === 2) {
        setWorkbook2(workbook);
        setFile2(files[0]);
      }
    };
    reader.readAsArrayBuffer(files[0]);
  };

  const handleColumnMappingChange = (e) => {
    setColumnMapping(e.target.value);
  };

  const compareWorkbooks = () => {
    setIsComparing(true);
    const differingCellsData = [];

    const sheet1 = workbook1.Sheets[selectedSheet];
    const sheet2 = workbook2.Sheets[selectedSheet];

    const sheet1Data = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
    const sheet2Data = XLSX.utils.sheet_to_json(sheet2, { header: 1 });

    // Split the columnMapping string into an array
    const mappingPairs = columnMapping.split(',');

    mappingPairs.forEach((pair) => {
      const [col1, col2] = pair.split('-');
      const col1Index = parseInt(col1) - 1;
      const col2Index = parseInt(col2) - 1;

      sheet1Data.forEach((row, rowIndex) => {
        if (
          sheet2Data[rowIndex] &&
          sheet2Data[rowIndex][col2Index] !== row[col1Index]
        ) {
          differingCellsData.push({
            sheet: selectedSheet,
            cell: row[col1Index],
            newCell: sheet2Data[rowIndex][col2Index],
            rowIndex,
            columnIndex: col1Index,
          });
        }
      });
    });

    setDifferingCells(differingCellsData);
    setIsComparing(false);
    setMappedColumns(mappingPairs);
  };

  const downloadDifferingCells = () => {
    if (differingCells.length > 0) {
      const newWorkbook = XLSX.utils.book_new();

      const ws = XLSX.utils.json_to_sheet(differingCells);
      XLSX.utils.book_append_sheet(newWorkbook, ws, 'DifferingCells');

      const excelBlob = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'blob' });

      FileSaver.saveAs(excelBlob, 'differing_cells.xlsx');
    }
  };

  const differingCellElements = differingCells.map((cell, index) => (
    <div key={index} className="differing-cell">
      <p>Sheet: {cell.sheet}</p>
      <p>Row: {cell.rowIndex + 1}</p>
      <p>Column: {cell.columnIndex + 1}</p>
      <p>Old Value: {cell.cell}</p>
      <p>New Value: {cell.newCell}</p>
    </div>
  ));

  return (
    <div className="container">
      <h2>Excel Comparator</h2>
      <div className="file-inputs">
        <div className="file-input">
          <Dropzone onDrop={(files) => handleFileDrop(files, 1)}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag and drop or click to upload the first workbook.</p>
              </div>
            )}
          </Dropzone>
          {file1 && <p>File 1: {file1.name}</p>}
        </div>
        <div className="file-input">
          <Dropzone onDrop={(files) => handleFileDrop(files, 2)}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag and drop or click to upload the second workbook.</p>
              </div>
            )}
          </Dropzone>
          {file2 && <p>File 2: {file2.name}</p>}
        </div>
      </div>
      <div className="dropdowns">
        <label>Select a Sheet:</label>
        <select onChange={(e) => setSelectedSheet(e.target.value)}>
          {workbook1 && workbook2 ? (
            workbook1.SheetNames.map((sheetName, index) => (
              <option key={index} value={sheetName}>
                {sheetName}
              </option>
            ))
          ) : (
            <option value="">No Workbook Loaded</option>
          )}
        </select>
        <label>Column Mapping (e.g., 1-2, 3-4):</label>
        <input
          type="text"
          placeholder="e.g., 1-2, 3-4"
          value={columnMapping}
          onChange={handleColumnMappingChange}
        />
      </div>
      <button onClick={compareWorkbooks} disabled={isComparing}>
        Compare Workbooks
      </button>
      <button onClick={downloadDifferingCells}>Download Differing Cells</button>
      <div className="results">
        {isComparing ? (
          <p>Comparing...</p>
        ) : differingCells.length > 0 ? (
          <div>
            <h3>Differing Cells:</h3>
            {differingCellElements}
          </div>
        ) : (
          <p>No differing cells found.</p>
        )}
        {mappedColumns.length > 0 && (
          <div>
            <h3>Column Mapping:</h3>
            {mappedColumns.map((mapping, index) => (
              <p key={index}>{mapping}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


 


















// import React, { useState, useEffect } from 'react';
// import XLSX from 'xlsx';
// import FileSaver from 'file-saver';
// import Dropzone from 'react-dropzone';
// import './ExcelComparator.css';

// function ExcelComparator() {
//   const [workbook1, setWorkbook1] = useState(null);
//   const [workbook2, setWorkbook2] = useState(null);
//   const [selectedSheet, setSelectedSheet] = useState('');
//   const [selectedColumns, setSelectedColumns] = useState('');
//   const [differingCells, setDifferingCells] = useState([]);
//   const [isComparing, setIsComparing] = useState(false);

//   // State for the separate files
//   const [file1, setFile1] = useState(null);
//   const [file2, setFile2] = useState(null);

//   useEffect(() => {
//     if (workbook1 && workbook2 && selectedSheet && selectedColumns) {
//       compareWorkbooks();
//     }
//   }, [workbook1, workbook2, selectedSheet, selectedColumns]);

//   const handleFileDrop = (files, workbookNum) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const fileData = event.target.result;
//       const workbook = XLSX.read(fileData, { type: 'array' });

//       if (workbookNum === 1) {
//         setWorkbook1(workbook);
//         setFile1(files[0]);
//       } else if (workbookNum === 2) {
//         setWorkbook2(workbook);
//         setFile2(files[0]);
//       }
//     };
//     reader.readAsArrayBuffer(files[0]);
//   };

//   const compareWorkbooks = () => {
//     setIsComparing(true);
//     const differingCellsData = [];

//     const sheet1 = workbook1.Sheets[selectedSheet];
//     const sheet2 = workbook2.Sheets[selectedSheet];

//     const sheet1Data = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
//     const sheet2Data = XLSX.utils.sheet_to_json(sheet2, { header: 1 });

//     sheet1Data.forEach((row, rowIndex) => {
//       row.forEach((cell, columnIndex) => {
//         if (
//           sheet2Data[rowIndex] &&
//           selectedColumns.includes(columnIndex) &&
//           sheet2Data[rowIndex][columnIndex] !== cell
//         ) {
//           differingCellsData.push({
//             sheet: selectedSheet,
//             cell,
//             newCell: sheet2Data[rowIndex][columnIndex],
//             rowIndex,
//             columnIndex,
//           });
//         }
//       });
//     });

//     setDifferingCells(differingCellsData);
//     setIsComparing(false);
//   };

//   const downloadDifferingCells = () => {
//     if (differingCells.length > 0) {
//       const newWorkbook = XLSX.utils.book_new();

//       const ws = XLSX.utils.json_to_sheet(differingCells);
//       XLSX.utils.book_append_sheet(newWorkbook, ws, 'DifferingCells');

//       const excelBlob = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'blob' });

//       FileSaver.saveAs(excelBlob, 'differing_cells.xlsx');
//     }
//   };

//   const differingCellElements = differingCells.map((cell, index) => (
//     <div key={index} className="differing-cell">
//       <p>Sheet: {cell.sheet}</p>
//       <p>Row: {cell.rowIndex + 1}</p>
//       <p>Column: {cell.columnIndex + 1}</p>
//       <p>Old Value: {cell.cell}</p>
//       <p>New Value: {cell.newCell}</p>
//     </div>
//   ));

//   return (
//     <div className="container">
//       <h2>Excel Comparator</h2>
//       <div className="file-inputs">
//         <div className="file-input">
//           <Dropzone onDrop={(files) => handleFileDrop(files, 1)}>
//             {({ getRootProps, getInputProps }) => (
//               <div {...getRootProps()} className="dropzone">
//                 <input {...getInputProps()} />
//                 <p>Drag and drop or click to upload the first workbook.</p>
//               </div>
//             )}
//           </Dropzone>
//           {file1 && <p>File 1: {file1.name}</p>}
//         </div>
//         <div className="file-input">
//           <Dropzone onDrop={(files) => handleFileDrop(files, 2)}>
//             {({ getRootProps, getInputProps }) => (
//               <div {...getRootProps()} className="dropzone">
//                 <input {...getInputProps()} />
//                 <p>Drag and drop or click to upload the second workbook.</p>
//               </div>
//             )}
//           </Dropzone>
//           {file2 && <p>File 2: {file2.name}</p>}
//         </div>
//       </div>
//       <div className="dropdowns">
//         <label>Select a Sheet:</label>
//         <select onChange={(e) => setSelectedSheet(e.target.value)}>
//           {workbook1 && workbook2 ? (
//             workbook1.SheetNames.map((sheetName, index) => (
//               <option key={index} value={sheetName}>
//                 {sheetName}
//               </option>
//             ))
//           ) : (
//             <option value="">No Workbook Loaded</option>
//           )}
//         </select>
//         <label>Select Columns to Compare (comma-separated):</label>
//         <input
//           type="text"
//           placeholder="e.g., 1, 2, 3"
//           value={selectedColumns}
//           onChange={(e) => setSelectedColumns(e.target.value)}
//         />
//       </div>
//       <button onClick={compareWorkbooks} disabled={isComparing}>
//         Compare Workbooks
//       </button>
//       <button onClick={downloadDifferingCells}>Download Differing Cells</button>
//       <div className="results">
//         {isComparing ? (
//           <p>Comparing...</p>
//         ) : differingCells.length > 0 ? (
//           <div>
//             <h3>Differing Cells:</h3>
//             {differingCellElements}
//           </div>
//         ) : (
//           <p>No differing cells found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ExcelComparator;

