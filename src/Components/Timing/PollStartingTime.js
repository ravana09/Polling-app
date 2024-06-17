import React, { useEffect, useState } from 'react'

function PollStartingTime({createdTime,}) {
    const [date, setDate] = useState(createdTime);
  const [result, setResult] = useState("");

  useEffect(() => {
    let dateTimer;

    const timer = () => {
      const currentTime = parseInt(Date.now());
    
      const targetTime = parseInt(new Date(date).getTime());
      // console.log(typeof(targetTime))
      let timeDifference = targetTime - currentTime;
      // console.log(timeDifference)
      //  timeDifference = parseInt(timeDifference)

      if (timeDifference <= 0) {
        setResult("Poll has been Ended !");
        clearInterval(dateTimer);
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      if (days > 0) {
        setResult(`${days} days`);
      } else if (hours > 0) {
        setResult(`${hours} hours`);
      } else if (minutes > 0) {
        setResult(`${minutes} minutes`);
      } else {
        setResult(`${seconds} seconds`);
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
      
    
      <div>{result}</div>
    </div>
  );
}

export default PollStartingTime