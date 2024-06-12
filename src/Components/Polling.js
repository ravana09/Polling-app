import React, { useEffect, useState } from "react";
import "../Components/Polling.css";
import {
  Card,
  Col,
  Form,
  Row,
  Button,
  Stack,
  Badge,
} from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import RangeOutput from "./RangeOutput";
import { FaRegHeart, FaHeart } from 'react-icons/fa';

function Polling() {
  const [fetchData, setFetchData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [votedPollIds, setVotedPollIds] = useState(() => {
    const storedVotedPollIds = localStorage.getItem("votedPollIds");
    return storedVotedPollIds ? JSON.parse(storedVotedPollIds) : [];
  });
  const [pollId, setPollId] = useState("");

  const[votedPoll,setVOtedPoll]=useState(false)
  // const [pollCounts, setPollCounts] = useState([]);
  // const [liked, setLiked] = useState(false);

  // const handleCheckboxChange = () => {
  //   setLiked(!liked);
  // };

  const id = localStorage.getItem("Id");

  function handleData(e) {
    setSelectedOption(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedOption && pollId) {
      try {
        const url = `http://localhost:5000/poll/voting/${pollId}/${selectedOption}`;
        const response = await axios.post(url, { userID: id });

        if (response.status === 200) {
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
          

          if (!votedPollIds.includes(pollId)) {
            const updatedVotedPollIds = [...votedPollIds, pollId];
            setVotedPollIds(updatedVotedPollIds);
            localStorage.setItem("votedPollIds", JSON.stringify(updatedVotedPollIds));
            setVOtedPoll(true)
          }
        }
      } catch (error) {
        console.error("Error voting:",  error.message);
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
          title: `Error voting: ${error.response ? error.response.data.error : error.message}`,
        });
      }
    }
  }

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

  return (
    <Row className="polling_row">
      <div className="pollingBody">
        <Col md={12} sm={12}>
        {fetchData.map((apiData) => (
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
                        <hr />
                        {/* <Row>
                          <Col sm={3} md={3} lg={3} xl={3}>
                            <input
                              type="checkbox"
                              checked={liked}
                              onChange={handleCheckboxChange}
                              style={{ display: "none" }}
                              id="like-checkbox"
                            />
                            <label
                              htmlFor="like-checkbox"
                              style={{ cursor: "pointer" }}
                            >
                              {liked ? (
                                <FaHeart style={{ color: "red", fontSize: "24px" }} />
                              ) : (
                                <FaRegHeart style={{ fontSize: "24px" }} />
                              )}
                            </label>
                            <span style={{ marginLeft: "8px" }}>Like</span>
                          </Col>
                          <Col sm={3} md={3} lg={3} xl={3}></Col>
                          <Col sm={3} md={3} lg={3} xl={3}></Col>
                          <Col sm={3} md={3} lg={3} xl={3}></Col>
                        </Row> */}
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