import React, { createContext, useContext, useEffect, useState } from "react";
import "./polling.css";

import { Card, Col, Form, Row, Button, Stack, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import RangeOutput from "./RangeOutput";
import { useLocation, useNavigate } from "react-router-dom";
import PollEndingTime from "./Timing/PollEndingTime";
import PollStartingTime from "./Timing/PollStartingTime";
// import { userDetailsContext } from "./User/UserDetails";
import { SearchContext } from "./Header";
import Like from "./Tools/Like ";
// import Comments, { CommentContext } from "./Tools/Comments";
// import { TrendingPollContext } from "./Trending/Trending";

export const TimerContext = createContext();
export const likeContext = createContext();

function Polling({ pollingState, userDeatilsPoll, UserID }) {
  const [fetchData, setFetchData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [votedPollIds, setVotedPollIds] = useState(() => {
    const storedVotedPollIds = sessionStorage.getItem("votedPollIds");
    return storedVotedPollIds ? JSON.parse(storedVotedPollIds) : [];
  });
  const [pollId, setPollId] = useState("");

  const [searchingPoll, setSearchingPoll] = useState();
  // const [searchResults, setSearchResults] = useState(null);

  const [voteCount, setVoteCount] = useState(0);

  const searchText = useContext(SearchContext);
  const [timer, setTimer] = useState(true);

  const [loading, setLoading] = useState(true);
  let [userDetails, setUserDetails] = useState(false);

  const [likepoll, setLikepoll] = useState(false);

  const [pollEndTime, setpollEndtime] = useState(true);

  //Trending Poll id
  const location = useLocation();

  let { data } = location.state || {};

  // console.log(data);

  const otherUserID = UserID;
  let UserId = sessionStorage.getItem("Id");
  let navigate = useNavigate();

  const handleData = (e) => {
    setSelectedOption(e.target.value);
  };

  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOption && pollId) {
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/polls/voteonpoll",
          {
            poll_id: pollId,
            user_id: UserId,
            option: selectedOption,
          }
        );
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
            sessionStorage.setItem(
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

  //fetching data
  useEffect(() => {
    if (userDeatilsPoll) {
      setLoading(false);
      setFetchData(pollingState);
      // console.log(pollingState,"pollid from user")
      UserVotedPolls();
    } else if (data) {
      // console.log(data)
      fetchPollDetails(data);
      fetchVotedPolls();
    } else {
      fetchPollData();
      fetchVotedPolls();
      // console.log("polling");
    }
  }, [userDetails, data]);

  //polling fetching
  const fetchPollData = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://49.204.232.254:84/polls/getall", {
        user_id: UserId,
      });
      setFetchData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching poll data:", err);
    }
    setLoading(false);
  };
  //polling voted polls
  const fetchVotedPolls = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/polls/getvoted",
        {
          user_id: UserId,
        }
      );
      const { pollIds } = response.data;
      // console.log(response.data)
      setVotedPollIds(pollIds);
    } catch (error) {
      console.error("Error fetching voted polls:", error);
    }
    setLoading(false);
  };

  //uservoted polls
  const UserVotedPolls = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/polls/getvoted",
        {
          user_id: otherUserID,
        }
      );
      const { pollIds } = response.data;
      // console.log(response.data)
      setVotedPollIds(pollIds);
    } catch (error) {
      console.error("Error fetching voted polls:", error);
    }
    setLoading(false);
  };

  //trendinPoll
  async function fetchPollDetails(pollId) {
    // console.log(pollId,'function trendingPoll')
    try {
      // console.log(pollId,"try")
      const response = await axios.post(
        "http://49.204.232.254:84/polls/getone",
        {
          poll_id: pollId,
        }
      );
      setFetchData([response.data]);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching poll details:", err);
    }
  }

  //search
  useEffect(() => {
    const fetchPollById = async () => {
      if (searchingPoll) {
        setLoading(true);
        try {
          const response = await axios.get(
            "http://49.204.232.254:84/polls/search",
            {
              query: searchText,
            }
          );
          setFetchData([response.data]);
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      }
    };
    fetchPollById();
  }, [searchingPoll]);

  // const displayedData = searchResults ? [searchResults] : fetchData;

  //Comments
  const handlePoll = (poll) => {
    console.log(poll);

    navigate("/Comments", { state: { pollID: poll } });
  };

  //UserDeatils
  const handleUser = (userId) => {
    setUserDetails(!userDetails);

    navigate("/UserDetails", { state: { userID: userId } });
  };

  //category
  const handleCatergory = (id) => {
    console.log(id);
  };

  return (
    <TimerContext.Provider value={{ timer, setTimer }}>
      <div>
        <Row className="polling_row">
          <Form>{/* Search functionality can be added here */}</Form>
          <div className="pollingBody">
            <Col md={12} sm={12}>
              {loading ? (
                <div className="loading">
                  <h1>Loading......</h1>
                </div>
              ) : (
                fetchData.map((apiData) => (
                  <div key={apiData._id}>
                    <Card className="card">
                      <div>
                        <Card.Link
                          onClick={() => handleUser(apiData.createdBy._id)}
                          style={{ fontSize: 20 }}
                        >
                          {apiData.createdBy?.user_name}
                        </Card.Link>
                      </div>
                      <h6>
                        {apiData.title}{" "}
                        <span>
                          <PollStartingTime createdTime={apiData.createdAt} />
                        </span>
                      </h6>
                      <Card.Body
                      // className={`polling
                      //   ${votedPollIds.includes(apiData._id) ? "polling-range" : ""}`}
                      >
                        <Card.Title>{apiData.question}</Card.Title>
                        <Stack direction="horizontal" gap={2}>
                          <Button onClick={handleCatergory(apiData.category._id)}>
                            
                              {apiData.category[0]?.category_name}
                           
                          </Button>
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
                                <Col sm={4}>{apiData.voters.length} votes</Col>
                                <Col sm={4}></Col>
                                <Col sm={4}>
                                  <PollEndingTime
                                    createdTime={apiData.created_date}
                                    endingTime={apiData.expirationTime}
                                    // pollEndTime={pollEndTime}
                                    setpollEndtime={setpollEndtime}
                                  />
                                </Col>
                              </Row>
                            </Card.Header>
                            <Card.Body>
                              <Form onSubmit={handleSubmit}>
                                {apiData.options.map((option, index) => (
                                  <Card.Title
                                    key={index}
                                    style={{ margin: 10 }}
                                  >
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
                                {apiData._id === pollId &&
                                  timer &&
                                  (
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
                              {/* <hr /> */}
                            </Card.Body>
                          </Card>
                        )}
                      </Card.Body>
                      <Row>
                        <Col sm={3}>
                          <div>
                            <Like
                              pollId={apiData._id}
                              setLikepoll={setLikepoll}
                              likepoll={likepoll}
                            />
                            {apiData.likers.length} Like
                          </div>
                        </Col>
                        <Col sm={3}>
                          <Button
                            variant="primary"
                            onClick={() => handlePoll(apiData._id)}
                          >
                            Comments
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                    <hr/>
                  </div>
                ))
              )}
            </Col>
          </div>
        </Row>
      </div>
    </TimerContext.Provider>
  );
}

export default Polling;
