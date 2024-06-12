import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Stack, Badge } from "react-bootstrap";
import RangeOutput from "./RangeOutput"; // Import the RangeOutput component

function VotedList() {
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const id = localStorage.getItem("Id");

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
      try {
        const url = `http://localhost:5000/poll/getvoted/${id}`;
        const response = await axios.get(url);
        const { pollIds } = response.data;
        setVotedPollIds(pollIds);
      } catch (error) {
        console.error("Error fetching voted polls:", error);
      }
    };

    fetchPollData();
    fetchVotedPolls();
  }, [id]);

  // Filter fetchData based on votedPollIds
  const votedPollData = fetchData.filter((poll) =>
    votedPollIds.includes(poll.poll_id)
  );

  return (
    <Row className="polling_row">
      <div className="pollingBody">
        <Col md={12} sm={12}>
          {votedPollData.map((apiData) => (
            <div key={apiData.poll_id}>
              <Card className="card">
                <Card.Title className="poll-Title">{apiData.title}</Card.Title>
                <Card.Body
                  className={`polling ${votedPollIds.includes(apiData.poll_id) ? "polling-range" : ""}`}
                >
                  <Card.Title>{apiData.question}</Card.Title>
                  <Stack direction="horizontal" gap={2}>
                    <Badge bg="primary" className="Badge">
                      {apiData.category}
                    </Badge>
                  </Stack>
                  {votedPollIds.includes(apiData.poll_id) ? (
                    <RangeOutput
                      pollId={apiData.poll_id}
                      selectOption={selectedOption}
                      setSelectedOption={setSelectedOption}
                    />
                  ) : (
                    <p>You haven't voted for this poll yet.</p>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </Col>
      </div>
    </Row>
  );
}

export default VotedList;
