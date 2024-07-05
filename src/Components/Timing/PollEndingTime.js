import React, { useContext, useEffect, useState } from "react";
import { TimerContext } from "../Polling";


function PollEndingTime({endingTime,setpollEndtime}) {
  // console.log(createdTime)
  let [date, setDate] = useState(endingTime);
  const [result, setResult] = useState("");
 



  useEffect(() => {
    let dateTimer;

    const timer = () => {
      const currentTime = parseInt(Date.now());
      // console.log(currentTime)
    
      const targetTime = parseInt(new Date(date).getTime());
      // console.log(typeof(targetTime))
      let timeDifference = ((targetTime - currentTime)-5.5*60*60*1000);
      // console.log(timeDifference)
      //  timeDifference = parseInt(timeDifference)

    
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

     
     
     if (days > 0) {

        setResult(` Poll Ends in ${days} 
     
           days`);
        
      } else if (hours > 0) {
        setResult(`Poll Ends in ${hours} 
      
          hours`);
        
      } else if (minutes > 0) {
        setResult( ` Poll Ends in ${minutes}
            minutes`);
        
      } else {
        setResult(` Poll Ends in ${seconds} seconds`);
        
      }

      if (timeDifference <= 0) {
       
        setResult("Poll Ended !");
        clearInterval(dateTimer);
        // setpollEndtime(false)
        return;
      }
    };

    


    if (date) {
      dateTimer = setInterval(timer, 1000);
    }

    return () => {
      clearInterval(dateTimer);
    };
  }, [date]);
  // console.log(result)

  return (
    <div >
      
    
      <div> {result}</div>
    </div>
  );
}

export default PollEndingTime;
