import React, { createContext, useState } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import axios from "axios";
import "./Trending.css";
import { useNavigate } from "react-router-dom";



function Trending() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [pollData, setPollData] = useState([]);
  // const [dataSend,setdataSend]=useState(false)
  const [trendingPoll,setTrendingPoll] =useState(false) ;

  let navigate=useNavigate()

  // Fetch top 3 trending polls
  async function handleTopThree() {
    if (loading) {
      setLoading(false);
      setData([]);
    } else {
      setLoading(true);
      try {
        const response = await axios.get("http://49.204.232.254:84/polls/top3");
        setData(response.data);
        // setTrend(response.data)
        console.log(response.data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // Fetch data for a single poll
  // async function handleData(e, id) {
  //   e.preventDefault();
  //   console.log("Clicked", id);
  //   try {
  //     const response = await axios.post("http://49.204.232.254:84/polls/getone", {
  //       poll_id: id,
  //     });
      
  //     console.log(response.data);
  //     setTrendingPoll(true)
  //     Navigate(response.data)
  //     // navigate('/polling',{state:{TrendingData:response.data,trendingPollStatus:trendingPoll}})
    
  //   } catch (err) {
  //     console.log("Error: ", err);
  //   }


  // }

  function Navigate(trendingPolldata){
    navigate('/polling',{state:{data:trendingPolldata}})
  }

  // console.log(pollData, "polldata");

  return (
   
      <Row>
        <Col
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className="TrendingContainer"
          id="trending_Bar"
        >
          <Card bg={"secondary"} style={{ width: "18rem" }} className="mb-2">
            <Button variant="primary" onClick={handleTopThree}>
              {loading ? "Close the Card" : "Show Top 3 Trending Polls"}
            </Button>
            {loading &&
              data.map((apidata, index) => {
                return (
                  <Card.Body key={index}>
                    <Card.Title>Question: {apidata.question}</Card.Title>
                    <Card.Text>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          Total Votes: {apidata.totalVotes}
                        </ListGroup.Item>
                      </ListGroup>
                      <Button onClick={() => Navigate(apidata._id)}>
                        Get to the Poll
                      </Button>
                    </Card.Text>
                  </Card.Body>
                );
              })}
          </Card>
        </Col>
      </Row>
      
            )
}

export default Trending;
