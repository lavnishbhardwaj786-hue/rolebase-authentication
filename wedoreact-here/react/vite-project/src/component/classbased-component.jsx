import { Component } from "react";



class Classbasedcomponent extends Component{
    componentDidMount(){
    console.log("component did mount method called")
    };
    render(){
        return(
            <div>
                <h2>This is a class based component</h2>
            </div>
        )
    }
};

export default Classbasedcomponent;