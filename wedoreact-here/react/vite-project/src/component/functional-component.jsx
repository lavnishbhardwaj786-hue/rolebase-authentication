// function Functionalcomponent(){
//     return(
//         <div>
//             <h5> funcitonal compotnents</h5>
//         </div>
//     )
// }

import { useEffect, useState } from 'react';
import Producterender from './products/index.jsx';

const Functionalcomponent=()=>{
    const [flag,toggleflag]=useState(false);
    const handlefunction=()=>{
    toggleflag(!flag);
    }
    return(
        <div>
            <h3> This is an arrow function component</h3>
            <button onClick={handlefunction} style={flag?{color:"red"}:{color:"blue"}}> clicked </button>
            <Producterender name="love" city="avc"/> 
            {/* passing props to child component */}
        </div>
    )
}
export default Functionalcomponent;