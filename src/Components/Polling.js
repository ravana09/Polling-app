import React, { useEffect, useState } from "react";
import "../Components/Polling.css";
import { Card, Col, Form, Row, Button, Stack, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import RangeOutput from "./RangeOutput";

function Polling() {
  const [fetchData, setFetchData] = useState([]); // State to fetch data
  const [selectedOption, setSelectedOption] = useState("");
  const [votedPollIds, setVotedPollIds] = useState([]); // State to store voted poll IDs
  const [pollId, setPollId] = useState("");
  const [pollCounts, setPollCounts] = useState([]); // State to store the poll ID

  function handleData(e) {
    setSelectedOption(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedOption && pollId) {
      try {
        const url = `http://localhost:5000/poll/voting/${pollId}/${selectedOption}`;
        await axios.post(url);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Your Poll has Been Saved",
        });

        // Check if the poll ID has already been voted on
        if (votedPollIds.includes(pollId)) {
          // Increment the counter for the poll ID
          const updatedCounts = pollCounts.map((count) =>
            count.pollId === pollId
              ? { ...count, count: count.count + 1 }
              : count
          );
          setPollCounts(updatedCounts);
        } else {
          // Add the voted poll ID to the list of voted poll IDs
          setVotedPollIds([...votedPollIds, pollId]);
          // Initialize the counter for the poll ID
          setPollCounts([...pollCounts, { pollId: pollId, count: 1 }]);
        }
      } catch (error) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: `Error voting: ${error.message}`,
        });
      }
    }
  }

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/poll/getall");
        setFetchData(res.data);
        console.log(res.data);
      } catch (err) {
        console.log("Error", err);
      }
    };

    fetchPollData();
  }, []);

  return (
    <Row className="polling_row">
      <div className="pollingBody">
        <Col md={12} sm={12}>
          {fetchData.map((apiData) => (
            <div key={apiData.poll_id}>
              <Card className="card">
                <Card.Title className="poll-Title">{apiData.title}</Card.Title>

                <Card.Body
                  className={`polling ${
                    votedPollIds.includes(apiData.poll_id)
                      ? "polling-range"
                      : ""
                  }`}
                >
                  <Card.Title>{apiData.question}</Card.Title>
                  <Stack direction="horizontal" gap={2}>
                    <Badge bg="primary" className="Badge">{apiData.category}</Badge>
                  </Stack>

                  {votedPollIds.includes(apiData.poll_id) ? (
                    <RangeOutput
                      pollId={apiData.poll_id}
                      selectOption={selectedOption}
                    />
                  ) : (
                    <Card className="innerCard">
                      <Card.Header className="cardHeader">Featured</Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleSubmit}>
                          {apiData.options.map((option, _id) => (
                            <Card.Title key={_id} style={{ margin: 10 }}>
                              <Form.Check
                                type="radio"
                                label={option.option}
                                value={option.option}
                                onChange={(e) => {
                                  handleData(e);
                                  setPollId(apiData.poll_id);
                                }}
                                checked={selectedOption === option.option}
                                className="formRadio custom-radio"
                                style={{ margin: 10 }}
                              />
                            </Card.Title>
                          ))}
                          {apiData.poll_id === pollId && (
                            <Button
                              type="submit"
                              style={{ margin: 10, backgroundColor: "grey" }}
                            >
                              Vote
                            </Button>
                          )}
                        </Form>
                      </Card.Body>
                    </Card>
                  )}
                </Card.Body>
              </Card>
              <hr />
            </div>
          ))}
        </Col>
      </div>
    </Row>
  );
}

export default Polling;
