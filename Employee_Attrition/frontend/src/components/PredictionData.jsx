import React , {useState, useEffect} from "react";
import { predictData } from "../utils/httpsUtil";
import Card from "./Card";

function PredictionData(){
    const [data,setData]=useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await predictData();
                setData(response); 
            } catch (error) {
                console.error("Error fetching prediction data:", error);
            }
        };
    
        fetchData();
    }, []);

    return(
        <>
            <h1 className="text-3xl m-4 text-center">Pre Filled Employee Data</h1>
            {
                data && (
                    <div className="w-screen h-screen flex flex-row flex-wrap justify-between mr-2 ml-3">
                    {data.map(item => (
                        <Card
                        key={item.employeeNumber}
                        EmployeeNumber={item.employeeNumber}
                        />
                    ))}
                    </div>
                )
            }

        </>
    );
}

export default PredictionData