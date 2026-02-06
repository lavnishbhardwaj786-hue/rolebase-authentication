import { useEffect, useState } from "react";



export default function something() {

    const [userlist, setuserlist] = useState([]);
    const fetchall = async () => {
        try {
            const apiresponse = await fetch('https://jsonplaceholder.typicode.com/posts');
            const result = await apiresponse.json();
            console.log(result);
            if (result)
                setuserlist(result)
            else {
                console.log("it's an error oops")
            }
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        fetchall();
    }, []);



    return (
        <div>       
            <h1>the heading</h1>
            <ul>
                {userlist.map(item => (
                <li key={item.title}>{item.title}</li>
                ))}
            </ul>

        </div>
    );
}