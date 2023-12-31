import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import readXlsxFile from "read-excel-file";
import * as XLSX from "xlsx";
import { Container, Grid, Segment } from "semantic-ui-react";
import { Table, Button, Icon, Message } from "semantic-ui-react";

const App = () => {
  const [File1, setFile1] = useState([]);
  const [File2, setFile2] = useState([]);
  const [Result, setResult] = useState([]);
  const [ColumnIndex1, setColumnIndex1] = useState(1);
  const [ColumnIndex2, setColumnIndex2] = useState(18);
  const [ColumnIndex3, setColumnIndex3] = useState(0);
  const [ColumnIndex4, setColumnIndex4] = useState(4);
  const [ColumnIndex0File1, setColumnIndex0File1] = useState(0);
  const [ColumnIndex0File2, setColumnIndex0File2] = useState(1);
  const [file1Uploaded, setFile1Uploaded] = useState(false);
  const [file2Uploaded, setFile2Uploaded] = useState(false);
  const [showDifferenceRows, setShowDifferenceRows] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState(null);
  const [fileName1, setFileName1] = useState(null);
  const [fileName2, setFileName2] = useState(null);

  const handleFile = (e) => {
    const name = e.target.files[0].name;
    const ext = name.substring(name.lastIndexOf(".") + 1);
    let ReadFile = e.target.files[0];
    let a = [];

    if (!e || !e.target || !e.target.files || e.target.files.length === 0) {
      alert("Invalid file. Please upload a valid file.");
      window.location.reload();
      return;
    }

    if (ext.toLowerCase() !== "xlsx") {
      if (lastUploadedFile !== name) {
        alert("Invalid file type. Please upload a valid Excel file (xlsx).");
        setLastUploadedFile(name);
        window.location.reload();
      }
      return;
    }

    setLastUploadedFile(null);

    if (e.target.id === "file1") {
      readXlsxFile(ReadFile).then((rows) => {
        a = rows.map((e) => {
          return e.map((j) => {
            return j === null ? "" : j;
          });
        });
        setFile1(a);
        setFile1Uploaded(true);
        setFileName1(name);
      });
    }

    if (e.target.id === "file2") {
      readXlsxFile(ReadFile).then((rows) => {
        setFile2(rows);
        a = rows.map((e) => {
          return e.map((j) => {
            return j === null ? "" : j;
          });
        });
        setFile2(a);
        setFile2Uploaded(true);
        setFileName2(name);
      });
    }
  };


  const handleCompare = () => {
    if (!file1Uploaded && !file2Uploaded) {
      alert("File 1 and File 2 are not uploaded.");
      return;
    } else if (!file1Uploaded) {
      alert("File 1 is not uploaded.");
      return;
    } else if (!file2Uploaded) {
      alert("File 2 is not uploaded.");
      return;
    }

    fillRows();
    fillColumns();
  };






  const findExtraRowsInFile2 = () => {
    let extraRows = [];
  
    for (let i = 0; i < File2.length; i++) {
      let isRowFound = false;
  
      for (let j = 0; j < File1.length; j++) {
        const value2Col1 = File2[i][ColumnIndex3];
        const value1Col1 = File1[j][ColumnIndex1];
  
        if (value2Col1 === value1Col1) {
          isRowFound = true;
          break;
        }
      }
  
      if (!isRowFound) {
        extraRows.push(File2[i]);
      }
    }
  
    return extraRows;
  };



  const handleShowDifferenceRows = () => {
    setShowDifferenceRows(!showDifferenceRows);
  };



  const ShowResult = () => {
    if (!file1Uploaded && !file2Uploaded) {
      alert("File 1 and File 2 are not uploaded.");
      return;
    } else if (!file1Uploaded) {
      alert("File 1 is not uploaded.");
      return;
    } else if (!file2Uploaded) {
      alert("File 2 is not uploaded.");
      return;
    }

    let result = [];
    let extraRowsInFile2 = findExtraRowsInFile2(); // Find extra rows in File 2
    // let file2Column0Value = [];
    // let num =[];
    for (let rowInd = 0; rowInd < File1.length; rowInd++) {
      const value1Col0 = File1[rowInd][ColumnIndex0File1];
      const value1Col1 = File1[rowInd][ColumnIndex1];
      const value1Col2 = File1[rowInd][ColumnIndex2];
  
      if (value1Col0 === "" || value1Col1 === "" || value1Col2 === "") {
        continue; // Skip the row
      }
      if (value1Col1 === 0) {
        // Skip the row if the value in File1 column 2 is equal to 0
        break;
      }
      let foundDifference = false;
      let rowInFile2 = -1;
      let rownotFile2 = -1;
      // let rowzero = -1;

      for (let i = 0; i < File2.length; i++) {
        if (File2[i] === undefined || File2[i][ColumnIndex2] === undefined) {
          continue;
        }

        const value2Col0 = File2[i][ColumnIndex0File2];
        const value2Col1 = File2[i][ColumnIndex3];
        const value2Col2 = File2[i][ColumnIndex4];


        if (value1Col1 === value2Col1 && value2Col0 && value2Col1 === value2Col1 ) {
          rowInFile2 = i;
          
        } else {
          rownotFile2 = i;
        }
        // if(value2Col0)
        // {
        //   rowzero = i;
          
        // } 
        
      }

      if (value1Col2 === 0 ) {
        continue;
      }

      let diff = 0;
      if (File2[rowInFile2] !== undefined) {
          diff = value1Col2 - File2[rowInFile2][ColumnIndex4];
      }
      
      const isDiffCol1 = rowInFile2 === -1 || value1Col1 !== File2[rowInFile2][ColumnIndex3];
      const isDiffCol2 = rowInFile2 === -1 || value1Col2 !== File2[rowInFile2][ColumnIndex4];
      const isDiffCol2Column = isDiffCol1 ? "Isin Different" : "Isin Same"; // Added column

      if (isDiffCol1 || isDiffCol2) {
        foundDifference = true;
      }

     
      



      if (!showDifferenceRows || foundDifference) 
{    result.push(
      
      <Table.Row key={rowInd}>
        <Table.Cell  key={rowInd + "0"}>
          
          {value1Col0 === "" ? "N/A" : value1Col0}
        </Table.Cell>
        <Table.Cell
          error={isDiffCol1}
          key={rowInd + "1"}
          positive={!foundDifference && !value1Col1 ? true : false}
        >
          {isDiffCol1 ? <Icon name="arrow right" color="red" /> : null}
          {value1Col1 === "" ? "N/A" : value1Col1}
        </Table.Cell>
        <Table.Cell
          error={isDiffCol2}
          key={rowInd + "2"}
          positive={!foundDifference && !value1Col2 ? true : false}
        >
          {isDiffCol2 ? <Icon name="arrow right" color="red" /> : null}
          {value1Col2 === "" ? "N/A" : value1Col2}
        </Table.Cell>
          <Table.Cell className="truncate-cell" style={{ whiteSpace: "pre-line" }}>
            
            {File2[rowInFile2]?File2[rowInFile2][ColumnIndex0File2]:File2[rownotFile2][ColumnIndex0File2]}
          </Table.Cell>
        <Table.Cell
          error={isDiffCol1}
          key={rowInd + "3"}
          positive={!foundDifference && !File2[rowInFile2] ? true : false}
        >
          {isDiffCol1 ? <Icon name="arrow right" color="green" /> : null}
          {File2[rowInFile2]
            ? File2[rowInFile2][ColumnIndex3]
            : File2[rownotFile2][ColumnIndex3] !== File2[rowInFile2]
            ? File2[rownotFile2][ColumnIndex3]
            : "N/A"}
        </Table.Cell>
        <Table.Cell
          error={isDiffCol2}
          key={rowInd + "4"}
          positive={!foundDifference && !File2[rowInFile2] && !File2[rownotFile2] ? true : false}
        >
          {isDiffCol2 ? <Icon name="arrow right" color="green" /> : null}
          {File2[rowInFile2] ? File2[rowInFile2][ColumnIndex4] : File2[rownotFile2][ColumnIndex4]}
        </Table.Cell>
        <Table.Cell>{isDiffCol2Column}</Table.Cell> {/* Added header */}
        <Table.Cell style={{ whiteSpace: "pre-line" }}>{diff}</Table.Cell>
      </Table.Row>
    );}
    }
  

    setResult(result);


if (extraRowsInFile2.length > 0) {
    const extraRows = extraRowsInFile2.map((row, index) => (
      <Table.Row key={`extra-row-${index}`} className="extra-row">
        <Table.Cell key={`extra-cell-0`} ><Icon name="arrow right" color="red" />N/A</Table.Cell>  {/*// File 2 Column 0 */}
         <Table.Cell key={`extra-cell-1`}><Icon name="arrow right" color="red" />N/A</Table.Cell> {/* // File 2 Column 1 */}
         <Table.Cell key={`extra-cell-2`}><Icon name="arrow right" color="red" />N/A</Table.Cell>  {/*// File 2 Column 2 */}
         <Table.Cell key={`extra-cell-3`}><Icon name="arrow right" color="green" />{row[ColumnIndex0File2]}</Table.Cell> {/* // File 1 Column 0 (show "N/A") */}
         <Table.Cell key={`extra-cell-4`}><Icon name="arrow right" color="green" />{row[ColumnIndex3]}</Table.Cell> {/* // File 1 Column 1 (show "N/A") */}
         <Table.Cell key={`extra-cell-5`}><Icon name="arrow right" color="green" />{row[ColumnIndex4]}</Table.Cell> {/* // File 1 Column 2 (show "N/A") */}
         <Table.Cell key={`extra-cell-6`}>Extra Row</Table.Cell>
         <Table.Cell key={`extra-cell-7`}>{-1*row[ColumnIndex4]}</Table.Cell>
      </Table.Row>
    ));

    if (showDifferenceRows) {
      result = [...result, ...extraRows];
    } else {
      result = [...result, ...extraRows];
    }
  }
  setResult(result);

  };





  // const handleDownload = () => {
  //   if (Result.length === 0) {
  //     alert("Result is empty. Nothing to download.");
  //     return;
  //   }
  
  //   const data = [
  //     ["File 1 Column 0", "File 1 Column 1", "File 1 Column 2", "File 2 Column 0", "File 2 Column 1", "File 2 Column 2"],
  //   ];
  
  //   Result.forEach((row) => {
  //     const rowData = [];
  //     for (let i = 0; i < 6; i++) {
  //       const cellValue = row.props.children[i]?.props?.children;
  
  //       // Check the data type of the cell value
  //       if (typeof cellValue === "number") {
  //         // Handle numeric values
  //         rowData.push(cellValue);
  //       } else {
  //         // Handle non-numeric (e.g., alphanumeric) values
  //         rowData.push(cellValue || ""); // Ensure empty string for null values
  //       }
  //     }
  //     data.push(rowData);
  //   });
  
  //   // Add headers for stored values and compared values
  //   data.push([
  //     "Stored Value 1",
  //     "Stored Value 2",
  //     "Compared Value",
  //     "Formula for Stored Value 1",
  //     "Formula for Stored Value 2",
  //     "Formula for Compared Value",
  //   ]);
  
  //   // Iterate over the original data files (File1 and File2)
  //   for (let i = 0; i < File1.length; i++) {
  //     const value1Col1 = File1[i][ColumnIndex1];
  //     const value1Col2 = File1[i][ColumnIndex2];
  
  //     let rowInFile2 = -1;
  //     for (let j = 0; j < File2.length; j++) {
  //       const value2Col1 = File2[j][ColumnIndex3];
  
  //       if (value1Col1 === value2Col1) {
  //         rowInFile2 = j;
  //         break;
  //       }
  //     }
  
  //     let comparedValue = 0;
  //     if (rowInFile2 !== -1) {
  //       comparedValue = value1Col2 - File2[rowInFile2][ColumnIndex4];
  //     }
  
  //     // Determine whether to display values or formulas
  //     const showValues = true; // Change this value to false to display formulas
  
  //     data.push([
  //       File1[i][ColumnIndex0File1],
  //       File1[i][ColumnIndex1],
  //       File1[i][ColumnIndex2],
  //       showValues ? File1[i][ColumnIndex1] : `=INDEX(Result, ${i + 1}, ${ColumnIndex1 + 1})`,
  //       showValues ? File1[i][ColumnIndex2] : `=INDEX(Result, ${i + 1}, ${ColumnIndex2 + 1})`,
  //       showValues ? comparedValue : `=INDEX(Result, ${i + 1}, ${ColumnIndex2 + 1})-INDEX(File2, MATCH(INDEX(Result, ${i + 1}, ${ColumnIndex1 + 1}), File2, 0), ${ColumnIndex4 + 1})`,
  //     ]);
  //   }
  
  //   // Convert data to an XLSX-compatible format
  //   const ws = XLSX.utils.aoa_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Comparison Result");
  
  //   // Write the Excel file
  //   XLSX.writeFile(wb, "comparison_result.xlsx");
  // };
  
  
  
  





  const fillRows = () => {
    if (File1.length < File2.length) {
      setFile1((File1) => {
        return File1.concat(
          new Array(File2.length - File1.length).fill(new Array(File1[0].length).fill(""))
        );
      });
    } else {
      setFile2((File2) => {
        return File2.concat(
          new Array(File1.length - File2.length).fill(new Array(File2[0].length).fill(""))
        );
      });
    }
  };

  const fillColumns = () => {
    if (File1[0].length < File2[0].length) {
      setFile1((File1) => {
        return File1.map((e, i) => {
          return e.concat(new Array(File2[0].length - File1[0].length).fill(""));
        });
      });
    } else {
      setFile2((File2) => {
        return File2.map((e, i) => {
          return e.concat(new Array(File1[0].length - File2[0].length).fill(""));
        });
      });
    }
  };

  return (
    <Container>
      <Grid container doubling>
        <Grid.Row columns={3} divided stretched verticalAlign={"middle"}>
          <Grid.Column textAlign="center">
            <Segment>
              <div>
                <label htmlFor="file1" className="ui icon button">
                  <i className="file icon"></i>
                  Open PORTFOLIO File
                </label>
                <input
                  type="file"
                  id="file1"
                  name="File1"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>
            </Segment>
            <Segment>
              <div>
                <label>Column Index 0 in File 1:</label>
                <input
                  type="number"
                  value={ColumnIndex0File1}
                  onChange={(e) => setColumnIndex0File1(parseInt(e.target.value))}
                />
              </div>
            </Segment>
            <Segment>
              <div>
                <label>Column Index to Compare in File 1:</label>
                <input
                  type="number"
                  value={ColumnIndex1}
                  onChange={(e) => setColumnIndex1(parseInt(e.target.value))}
                />
              </div>
            </Segment>
            <Segment>
              <div>
                <label>Second Column Index to Compare in File 1:</label>
                <input
                  type="number"
                  value={ColumnIndex2}
                  onChange={(e) => setColumnIndex2(parseInt(e.target.value))}
                />
              </div>
            </Segment>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Segment className="segment-color"> Compare with</Segment>
            <Segment>
              <Button.Group>
                <Button onClick={handleCompare}>Compare</Button>
                <Button.Or text="&" />
                <Button positive onClick={ShowResult}>
                  Show Result
                </Button>
              </Button.Group>
            </Segment>
            <label>
        <input
          type="checkbox"
          checked={showDifferenceRows}
          onChange={handleShowDifferenceRows}
        />
        Show Only Differences
      </label>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Segment>
              <div>
                <label htmlFor="file2" className="ui icon button">
                  <i className="file icon"></i>
                  Open DPholding File
                </label>
                <input
                  type="file"
                  id="file2"
                  name="File2"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>
            </Segment>
            <Segment>
              <div>
                <label>Column Index 0 in File 2:</label>
                <input
                  type="number"
                  value={ColumnIndex0File2}
                  onChange={(e) => setColumnIndex0File2(parseInt(e.target.value))}
                />
              </div>
            </Segment>
            <Segment>
              <div>
                <label>Column Index to Compare in File 2:</label>
                <input
                  type="number"
                  value={ColumnIndex3}
                  onChange={(e) => setColumnIndex3(parseInt(e.target.value))}
                />
              </div>
            </Segment>
            <Segment>
              <div>
                <label>Second Column Index to Compare in File 2:</label>
                <input
                  type="number"
                  value={ColumnIndex4}
                  onChange={(e) => setColumnIndex4(parseInt(e.target.value))}
                />
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {file1Uploaded ? (
        <Message positive>
          <Message.Header>{`File 1 (${fileName1}) is uploaded!`}</Message.Header>
        </Message>
      ) : (
        <Message negative>
          <Message.Header>File 1 is not uploaded!</Message.Header>
        </Message>
      )}
      {file2Uploaded ? (
        <Message positive>
          <Message.Header>{`File 2 (${fileName2}) is uploaded!`}</Message.Header>
        </Message>
      ) : (
        <Message negative>
          <Message.Header>File 2 is not uploaded!</Message.Header>
        </Message>
      )}


{/* <Button positive onClick={handleDownload}>
        Download Result
      </Button>  */}


      



      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>PORTFOLIO Column {ColumnIndex0File1}</Table.HeaderCell>
            <Table.HeaderCell>PORTFOLIO Column {ColumnIndex1}</Table.HeaderCell>
            <Table.HeaderCell>PORTFOLIO Column {ColumnIndex2}</Table.HeaderCell>
            <Table.HeaderCell>DPholding Column {ColumnIndex0File2}</Table.HeaderCell>
            <Table.HeaderCell>DPholding Column {ColumnIndex3}</Table.HeaderCell>
            <Table.HeaderCell>DPholding Column {ColumnIndex4}</Table.HeaderCell>
            <Table.HeaderCell>Isin Diff</Table.HeaderCell>
            <Table.HeaderCell>Q Diff</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{Result}</Table.Body>
      </Table>
    </Container>
  );
};

export default App;


