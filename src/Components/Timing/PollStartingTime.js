import React, { useEffect, useState } from "react";
import { TimerContext } from "../Polling";
function PollStartingTime({ createdTime }) {
  const [result, setResult] = useState("");



  useEffect(() => {
    let dateTimer;

    const timer = () => {
      const currentTime = +new Date() ;//current time 
      // console.log(currentTime,"current")
      const targetTime = +new Date(createdTime);//poll created time 
      // console.log(targetTime,"target")
      const timeDifference = (currentTime - targetTime + 5.5 * 60 * 60 * 1000);

      // console.log(timeDifference,"differenc3")
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);


      // let seconds = Math.floor((timeDifference / 1000) % 60);
      // let minutes = Math.floor((timeDifference / 1000 / 60) % 60);
      // let hours = Math.floor((timeDifference / 1000 / 60 / 60) % 24);
      // let days = Math.floor((timeDifference / 1000 / 60 / 60 / 24) % 30);
      let months = Math.floor((timeDifference / 1000 / 60 / 60 / 24 / 30) % 12);
      let years = Math.floor(timeDifference / 1000 / 60 / 60 / 24 / 365);

      if (years > 0) {
        setResult(`${years} years ${months} months`);
      } else if (months > 0) {
        setResult(`${months} months`);
      } else if (days > 0) {
        setResult(`${days} days`);
      } else if (hours > 0) {
        setResult(`${hours} hours`);
      } else if (minutes > 0) {
        setResult(`${minutes} minutes`);
      } else if (seconds > 0) {
        setResult(`${seconds} seconds`);
      }
    };

    if (createdTime) {
      dateTimer = setInterval(timer, 1000);
    }

    return () => {
      clearInterval(dateTimer);
    };
  }, [createdTime]);

  return (
    <div>
      <div>Created : {result} ago</div>
    </div>
  );
}

export default PollStartingTime;
