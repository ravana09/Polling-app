import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Stack, Badge, Button } from "react-bootstrap";
import RangeOutput from "./RangeOutput"; // Import the RangeOutput component
import PollStartingTime from "./Timing/PollStartingTime";

function VotedList() {
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const User_id = localStorage.getItem("Id");

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/poll/getall");
        setFetchData(res.data);
      } catch (err) {
        console.log("Error", err);
      }
    };

    const fetchVotedPolls = async () => {
      console.log(User_id)
      try {
        const url = `http://localhost:5000/poll/getvoted/${User_id}`;
      
        const response = await axios.get(url);
        const { pollIds } = response.data;
        setVotedPollIds(pollIds);
        console.log(pollIds)
        
      } catch (error) {
        console.error("Error fetching voted polls:", error);
      }
    };

    fetchPollData();
    fetchVotedPolls();
  }, [User_id]);

  // Filter fetchData based on votedPollIds
  const votedPollData = fetchData.filter((poll) =>
    votedPollIds.includes(poll.poll_id)
  );
  console.log(votedPollData.data)

  return (
    <Row className="polling_row">
      <div className="pollingBody">
        <Col md={12} sm={12}>
          {votedPollData.map((apiData) => (
            <div key={apiData.poll_id}>

              <Card className="card">
                <Card.Title className="poll-Title">{apiData.title} </Card.Title>
                <PollStartingTime
                    createdTime={apiData.created_date}
                    />
                <Card.Body
                  className={`polling ${votedPollIds.includes(apiData.poll_id) ? "polling-range" : ""}`}
                >
                  <Card.Title>{apiData.question}</Card.Title>
                  <Stack direction="horizontal" gap={2}>
                    <Badge bg="primary" className="Badge">
                      {apiData.category?.category_name}
                    </Badge>
                  </Stack>
                  {votedPollIds.includes(apiData.poll_id) ? (
                    <RangeOutput
                      pollId={apiData.poll_id}
                      selectOption={selectedOption}
                      setSelectedOption={setSelectedOption}
                      createdTime={apiData.created_date}
                      endingTime={apiData.expirationTime}
                    />
                  ) : (
                    <p>You haven't voted for this poll yet.</p>
                  )}
                </Card.Body>
              </Card>
            </div>
            
          ))}
             {/* <Row> */}
                      {/* <Col sm={3} md={3} lg={3} xl={3}>
                        <Button
                          onClick={() => handleCheckboxChange(apiData.poll_id)}
                          style={{ backgroundColor: "inherit", border: "none" }}
                        >
                          {likedPolls && likeClikedPolls === apiData.poll_id ? (
                            <FaHeart
                              style={{ color: "red", fontSize: "24px" }}
                            />
                          ) : (
                            <FaRegHeart
                              style={{ color: "black", fontSize: "24px" }}
                            />
                          )}
                        </Button>
                        <span>Like</span>
                      </Col>
                      <Col sm={3} md={3} lg={3} xl={3}>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            handlePoll(apiData.poll_id);
                          }}
                        >
                          Comments
                        </Button>
                      </Col>
                    </Row> */}
        </Col>
      </div>
    </Row>
  );
}

export default VotedList;
