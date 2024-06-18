import React, { createContext, useContext, useEffect, useState } from "react";
import "../Components/Polling.css";
import { Card, Col, Form, Row, Button, Stack, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import RangeOutput from "./RangeOutput";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loadingGif from "../Images/Loading.gif";
import PollEndingTime from "./Timing/PollEndingTime";
import PollStartingTime from "./Timing/PollStartingTime";

// export  const TimerContext=createContext()

function Polling() {
  const [fetchData, setFetchData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [votedPollIds, setVotedPollIds] = useState(() => {
    const storedVotedPollIds = localStorage.getItem("votedPollIds");
    return storedVotedPollIds ? JSON.parse(storedVotedPollIds) : [];
  });
  const [pollId, setPollId] = useState("");
  const [likedPolls, setLikedPolls] = useState(false);
  const [likeClikedPolls, setLikeClickPolls] = useState("");
  const [searchingPoll, setSearchingPoll] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const [timer, setTimer] = useState(true);

  // const[catogery,setCategory]=useState({})
  const [loading, setLoading] = useState(true); // Loading state

  //user id
  const id = localStorage.getItem("Id");
  let Navigate = useNavigate();

  const handleData = (e) => {
    setSelectedOption(e.target.value);
  };

  //voating
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOption && pollId) {
      try {
        const url = `http://localhost:5000/poll/voting/${pollId}/${selectedOption}`;
        const response = await axios.post(url, { user_id: id });
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Your Poll has Been Saved",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          if (!votedPollIds.includes(pollId)) {
            const updatedVotedPollIds = [...votedPollIds, pollId];
            setVotedPollIds(updatedVotedPollIds);
            localStorage.setItem(
              "votedPollIds",
              JSON.stringify(updatedVotedPollIds)
            );
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `Error voting: ${
            error.response ? error.response.data.error : error.message
          }`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };
  //gettting all data
  useEffect(() => {
    fetchPollData();
    fetchVotedPolls();
  }, [id]);

  const fetchPollData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await axios.get("http://localhost:5000/poll/getall");
      setFetchData(res.data);
      console.log(res.data);

      // setCategory(res.data.category)
    } catch (err) {
      console.error("Error", err);
    }
    setLoading(false); // Stop loading
  };

  const fetchVotedPolls = async () => {
    setLoading(true); // Start loading
    try {
      const url = `http://localhost:5000/poll/getvoted/${id}`;
      const response = await axios.get(url);
      const { pollIds } = response.data;
      setVotedPollIds(pollIds);
    } catch (error) {
      console.error("Error fetching voted polls:", error);
    }
    setLoading(false); // Stop loading
  };

  //search
  useEffect(() => {
    const fetchPollById = async () => {
      if (searchingPoll) {
        setLoading(true); // Start loading
        try {
          const response = await axios.get(
            `http://localhost:5000/poll/getbyid/${searchingPoll}`
          );
          setFetchData([response.data]);
        } catch (err) {
          console.error(err);
        }
        setLoading(false); // Stop loading
      }
    };
    fetchPollById();
  }, [searchingPoll]);

  const displayedData = searchResults ? [searchResults] : fetchData;

  //like
  const handleCheckboxChange = async (pollId) => {
    setLikeClickPolls(pollId);
    setLikedPolls(!likedPolls);
    try {
      const response = await axios.post(
        `http://localhost:5000/poll/like/${pollId}`,
        {
          userID: id,
        }
      );
      if (response.status === 200) {
      }
    } catch (err) {
      console.error("Error in Liking ", err);
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/poll/getliked/${id}`
      );
      console.log(response);
    } catch (err) {
      console.error("Error in fetching liked polls", err);
    }
  };

  //comment
  function handlePoll(poll) {
    let pollClicked = poll;
    Navigate("/Comments", { state: [pollClicked] });
  }

  //user
  const handleUser = () => {
    Navigate("/UserDetails", { state: { UserId: id } });
  };

  return (
    // <TimerContext.Provider value={{timer,setTimer}}>
    <div>
      <Row className="polling_row">
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1 mb-7">
            <Form.Control
              type="text"
              placeholder="Enter a Poll ID"
              value={searchingPoll}
              className="searchPoll"
              onChange={(e) => setSearchingPoll(e.target.value)}
            />
          </Form.Group>
        </Form>
        <div className="pollingBody">
          <Col md={12} sm={12}>
            {loading ? (
              <div className="loading">
                <img src={loadingGif} alt="Loading..." />
              </div>
            ) : (
              displayedData.map((apiData) => (
                <div key={apiData._id}>
                  <Card className="card">
                    <Link onClick={handleUser}>
                      {apiData.createdBy.user_name}
                    </Link>

                    <h6>
                      {apiData.title}{" "}
                      <span>
                        <PollStartingTime createdTime={apiData.created_date} />
                      </span>
                    </h6>

                    <Card.Body
                      className={`polling ${
                        votedPollIds.includes(apiData._id)
                          ? "polling-range"
                          : ""
                      }`}
                    >
                      <Card.Title>{apiData.question}</Card.Title>
                      <Stack direction="horizontal" gap={2}>
                        <Badge bg="primary" className="Badge">
                          {apiData.category?.category_name}
                        </Badge>
                      </Stack>
                      {votedPollIds.includes(apiData._id) ? (
                        <RangeOutput
                          pollId={apiData._id}
                          selectOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          createdTime={apiData.created_date}
                          endingTime={apiData.expirationTime}
                        />
                      ) : (
                        <Card className="innerCard">
                          <Card.Header className="cardHeader">
                            <Row>
                              <Col sm={4} md={4} lg={4} xl={4}>
                                {" "}
                                {apiData.voters.length}. votes
                              </Col>
                              <Col sm={4} md={4} lg={4} xl={4}></Col>
                              <Col sm={4} md={4} lg={4} xl={4}>
                                <PollEndingTime
                                  createdTime={apiData.created_date}
                                  endingTime={apiData.expirationTime}
                                />
                              </Col>
                            </Row>
                          </Card.Header>
                          <Card.Body>
                            <Form onSubmit={handleSubmit}>
                              {apiData.options.map((option, index) => (
                                <Card.Title key={index} style={{ margin: 10 }}>
                                  <Form.Check
                                    type="radio"
                                    label={option.option}
                                    value={option.option}
                                    onChange={(e) => {
                                      handleData(e);
                                      setPollId(apiData._id);
                                    }}
                                    checked={selectedOption === option.option}
                                    className="formRadio custom-radio"
                                    style={{ margin: 10 }}
                                  />
                                </Card.Title>
                              ))}
                              {apiData._id === pollId && timer && (
                                <Button
                                  type="submit"
                                  style={{
                                    margin: 10,
                                    backgroundColor: "grey",
                                  }}
                                >
                                  Vote
                                </Button>
                              )}
                            </Form>
                            <hr />
                          </Card.Body>
                        </Card>
                      )}
                    </Card.Body>
                    <Row>
                      <Col sm={3} md={3} lg={3} xl={3}>
                        <Button
                          onClick={() => handleCheckboxChange(apiData._id)}
                          style={{ backgroundColor: "inherit", border: "none" }}
                        >
                          {likedPolls && likeClikedPolls === apiData._id ? (
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
                            handlePoll(apiData._id);
                          }}
                        >
                          Comments
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                  <hr />
                </div>
              ))
            )}
          </Col>
        </div>
      </Row>
    </div>
    // </TimerContext.Provider>
  );
}

export default Polling;
