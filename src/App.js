import logo from './logo.svg';
import './App.css';
import Excelf from './Excelf';
import Compexcel from './Compexcel';

function App() {
  return (
    <div className="App">
      {/* <Excelf/> */}
    <h2>Only Use .XLSX File to compare don't use any other File type</h2>
      <Compexcel/>
    </div>
  );
}

export default App;
