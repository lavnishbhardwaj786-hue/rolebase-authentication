
import { Component } from 'react' 
import './App.css'
import Something from './component/user/index.jsx';
import Classbasedcomponent from './component/classbased-component.jsx'
import Functionalcomponent  from './component/functional-component.jsx'
function App() {
  return (
    <div>
      <h1>react js compotnents</h1>
      <Classbasedcomponent/>
      <Functionalcomponent/> 
      <Something/>
    </div>
  )
}


export default App
