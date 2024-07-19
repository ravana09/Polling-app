import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Stack, Badge, Button, Image } from "react-bootstrap";
import RangeOutput from "./RangeOutput"; // Import the RangeOutput component
import PollStartingTime from "./Timing/PollStartingTime";
import Nullprofile from "../Components/Images/NullProfileImg.jpg";
import { useNavigate } from "react-router-dom";
import Polling from "./Polling";

function VotedList() {
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  const [sendVotedPolls, setSendVotedPolls] = useState([]);
  const User_id = sessionStorage.getItem("Id");

  useEffect(() => {
    const fetchVotedPolls = async () => {
      if (!User_id) {
        console.error("User_id is not defined");
        return;
      } else {
        try {
          const response = await axios.post(
            "http://49.204.232.254:84/api/getProfile",
            { user_id: User_id }
          );
          setVotedPollIds(response.data.user);
          if (response.status === 200) {
            console.log(response.data.user, "polls from vote polls");
            let UserVotedPolls = votedPollIds?.voted_polls||response.data.user.voted_polls;
            console.log(UserVotedPolls,'UserVotedPolls')

            const res=await axios.post(
                  "http://49.204.232.254:84/polls/multipoll",
                  {
                    poll_ids: UserVotedPolls,
                  }
                );
                setSendVotedPolls(res.data);
                console.log(res.data, "fetchMultiplePolls");
                if (res.status === 200) {
                  setFetchData(true);
                }
            

          }

        } catch (error) {
          console.error("Error fetching voted polls:", error);
        }
      }
    };
    fetchVotedPolls();
    
  }, [User_id]);

 


  return(
   <>
   
   {fetchData && <Polling pollUserVoted={sendVotedPolls} />}

   </>)
}

export default VotedList;
