
import styles from './yothestyle.module.css';
const product=["So", "the", "product", "is"];

const Producterender=( props)=>{
    console.log(props);
        return(
        <div className={styles.work}>
            <ul>
            {product.map((item,index)=>(
               <li key={index}>{item} {props.name} {props.city}</li>
            ))}
            </ul>
        </div>
    )
}

export default Producterender;