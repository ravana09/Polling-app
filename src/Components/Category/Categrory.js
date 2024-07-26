import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Polling from "../Polling";

function Categrory() {
  const [categoryPolls, setCategoryPolls] = useState([]);
  const location = useLocation();

  const { pollId } = location.state || [];
  console.log(pollId);

  useEffect(() => {
    const fetchCategoriesPoll = async () => {
      try {
        const res = await axios.post(
          "http://49.204.232.254:84/polls/getbycategory",
          {
            category: pollId,
          }
        );
        console.log(res.data);
        // multiDataFetching(res.data);
        if(res.status===200){
          const response = await axios.post(
            "http://49.204.232.254:84/polls/multipoll",
            {
              poll_ids: res.data,
            }
          );
          setCategoryPolls([]);
          setCategoryPolls(response.data);
          console.log(response.data,"polls from multi polss category ")
        }
      } catch (err) {
        console.log(err);
      }
    };

    // const multiDataFetching = async (polls) => {
    //   const response = await axios.post(
    //     "http://49.204.232.254:84/polls/multipoll",
    //     {
    //       poll_ids: polls,
    //     }
    //   );
    //   setCategoryPolls([]);
    //   setCategoryPolls(response.data, "polls from multi categories");
    // };
    fetchCategoriesPoll();
  }, [pollId]);
  return (
    <>
      {categoryPolls && categoryPolls.length > 0 && (
        <Polling categoryPolls={categoryPolls} />
      )}
      {categoryPolls.length === 0 && <div>No Poll Data</div>}
    </>
  );
}

export default Categrory;
