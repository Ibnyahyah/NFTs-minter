import Install from './components/Install';
import Home from './components/Home';
import './App.css'

function App() {
  if(!window.ethereum){
    return <Install/>
  }else if(window.ethereum){
    return <Home/>
  }
}

export default App
