import logo from './logo.svg';
import './App.css';
import Excelf from './Excelf';
import Compexcel from './Compexcel';

function App() {
  return (
    <div className="App">
      {/* <Excelf/> */}
    <h2> Don't use any other File type , Only Use .XLSX File to compare </h2>
      <Compexcel/>
    </div>
  );
}

export default App;
