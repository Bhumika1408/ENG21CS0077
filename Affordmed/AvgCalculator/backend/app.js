const express=require('express');
const axios=require('axios');
const cors=require('cors');
const app=express();
const port=9876;
const windowsize=10;
let window=[];
const third_party_server={
    'p':'http://20.244.56.144/test/primes',
    'f':'http://20.244.56.144/test/fibo',
    'e':'http://20.244.56.144/test/even',
    'r':'http://20.244.56.144/test/rand',

};
const Auth_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjI0NDI2LCJpYXQiOjE3MTcyMjQxMjYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBiZTczOTY3LWE4NjMtNGM5OS04YTg3LTFlZTg5ZjljMTZkYyIsInN1YiI6ImJodW1pa2FtYWxsYXB1cjE0MDhAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkbWVkIiwiY2xpZW50SUQiOiIwYmU3Mzk2Ny1hODYzLTRjOTktOGE4Ny0xZWU4OWY5YzE2ZGMiLCJjbGllbnRTZWNyZXQiOiJCSktpZ1Zob3VkaWpxT2FTIiwib3duZXJOYW1lIjoiQmh1bWlrYSBNYWxsYXB1ciIsIm93bmVyRW1haWwiOiJiaHVtaWthbWFsbGFwdXIxNDA4QGdtYWlsLmNvbSIsInJvbGxObyI6IkVORzIxQ1MwMDc3In0.0VHPIBebbWrsNInyo_UHY781DtkYsh5BG9skMw_Mad4"
app.use(cors());
const fetchNumbers=async(numberId)=>{
    const url=third_party_server[numberId];
    if(!url)return [];
    try{
        const response=await axios.get(url,{
            headers:{'Authorization':`Bearer ${Auth_token}`},
            timeout:500});
        return response.data.numbers;
    }catch(error){
        if(error.response){
            console.error(`Error fetching the numbers:${error.response.status}-${JSON.stringify(error.response.data)}`);
            return {error:`Error: ${error.response.status}-${JSON.stringify(error.response.data)}`};

        }
        else if(error.request){
            console.error("no response",error.request);
            return {error:'No respomse is obtained from the server'};
        }
        else{
            console.error("error setting up the request ",error.message);
            return {error:`Error while setting up the request= ${error.message}`};
        }
        
       
    }
};

const updateSlidingWindow=(newNumbers)=>{
    if(newNumbers.errors){
        return {previouState:[...window],currentState:[...window],error:newNumbers.error};
    }
    const uniqueNew=Array.isArray(newNumbers)?newNumbers.filter(num=>!window.includes(num)):[];
    const previouState=[...window];

    uniqueNew.forEach(num=>{
        if(window.length>=windowsize){
            window.shift();

        }
        window.push(num);
    });
    const currentState=[...window];
    return {previouState,currentState};
};

const AvgCalu=(numbers)=>{
    if(numbers.length==0) return 0;
    const summ=numbers.reduce((a,b)=>a+b,0);
    return summ/numbers.length;

};

app.get('/numbers/:numberId',async(req,res)=>{
    const{numberId}=req.params;
    if(!third_party_server[numberId]){
        return res.status(400).json({error:'Invalid id'});

    }
    const result=await fetchNumbers(numberId);
    if(result.error){
        return res.status(409).json({error:result.error});
    }
    const{previouState,currentState}=updateSlidingWindow(result);
    if(updateSlidingWindow.error){
        return res.status(409).json({error:updateSlidingWindow.error});
    }
    const average=AvgCalu(currentState);
    res.json({
        windowPrevSta:previouState,
        windowCurr:currentState,
        numbers:result,
        avg:parseFloat(average.toFixed(2))
    });
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});

