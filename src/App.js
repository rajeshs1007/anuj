import logo from './logo.svg';
import './App.css';
import Excelf from './Excelf';
import Compexcel from './Compexcel';

function App() {
  return (
    <div className="App">
      {/* <Excelf/> */}
    Only Use .XLSX File to compare don't use any other File type
      <Compexcel/>
    </div>
  );
}

export default App;
