import React,{useState} from 'react';
import axios from 'axios';
function App() {
  const [numberId,setNumberId]=useState('e');
  const [responseData,setResponseData]=useState(null);
  const handleFetchNumbers=async()=>{
    try{
      const response=await axios.get(`http://localhost:9876/numbers/${numberId}`);
      setResponseData(response.data);
    }
    catch(error){
      console.error("Error while fetching ",error);
    }
  };
  return(
    <div className="App">
      <h2>Average Calculator with microservices</h2>
      <div>
        <label>
          Select Type of Number:
          <select value={numberId} onChange={(e)=>setNumberId(e.target.value)}>
            <option value='p'>Prime</option>
            <option value='f'>Fibonacci</option>
            <option value='e'>Even</option>
            <option value='r'>Random</option>
          </select>
        </label>
        <button onClick={handleFetchNumbers}>Fetch the Numbers</button>
      </div>
      {responseData&&(
        <div>
          <h3>Results are =</h3>
          <p><strong>Previous window state is = </strong>{JSON.stringify(responseData.windowPrevSta)}</p>
          <p><strong>Current State is= </strong>{JSON.stringify(responseData.windowCurr)}</p>
          <p><strong>Fetched numbers are= </strong>{JSON.stringify(responseData.numbers)}</p>
          <p><strong>Average is : </strong>{responseData.avg}</p>
          </div>
      )}
    </div>
  );
}

export default App;
