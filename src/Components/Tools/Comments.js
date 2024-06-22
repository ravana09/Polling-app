import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Tools/Comments.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import RangeOutput from "../RangeOutput";
import Swal from "sweetalert2";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdNavigateBefore } from "react-icons/md";

function Comments() {
  let location = useLocation();
  const [pollData, setPollData] = useState(null);
  const pollClicked = location.state;

  const [fetchData, setFetchData] = useState([]);

  //options
  const [selectedOption, setSelectedOption] = useState("");

  //voting
  const [votedPollIds, setVotedPollIds] = useState(() => {
    const storedVotedPollIds = localStorage.getItem("votedPollIds");
    return storedVotedPollIds ? JSON.parse(storedVotedPollIds) : [];
  });

  //poolid
  const [pollId, setPollId] = useState("");

  //like
  const [likedPolls, setLikedPolls] = useState(false);

  const [likeClikedPolls, setLikeClickPolls] = useState("");

  //comments

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  //user id from local stroraghe (login)
  const id = localStorage.getItem("Id");

  //userName
  const UserName = localStorage.getItem("Users_Name");

  //Navigation
  let Navigate = useNavigate();

  //options handling
  const handleData = (e) => {
    setSelectedOption(e.target.value);
  };

  //voting function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedOption && pollId) {
      try {
        const url = `http://localhost:5000/poll/voting/${pollId}/${selectedOption}`;
        const response = await axios.post(url, { userID: id });

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

  //Fetching Data

  useEffect(() => {
    fetchPollData();
    fetchVotedPolls();
  }, [id]);

  const fetchPollData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/poll/getall");
      setFetchData(res.data);
    } catch (err) {
      console.error("Error", err);
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

  //Like function

  //liking a poll
  const handleCheckboxChange = async (pollId) => {
    setLikeClickPolls(pollId);
    console.log(pollId);

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

  useEffect(() => {
    const fetchPollById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/poll/getbyid/${pollClicked}`
        );
        setPollData(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (pollClicked) {
      fetchPollById();
    }
  }, [pollClicked]);

  if (!pollData) {
    return <div>Loading...</div>;
  }

  //comments

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setComments([...comments, newComment]);
    setNewComment("");
  };

  if (!pollData) {
    return <div>Loading...</div>;
  }

  const handleBackBUtton=()=>{
    Navigate("/polling")
  }

  return (
    <div className="comments-section">
      <div>
        <Card className="card">
          <Card.Title className="poll-Title">{pollData.title}</Card.Title>
          <Button onClick={()=>{
            handleBackBUtton()
          }}
          className="BackButton"
          
          >
         
            <MdNavigateBefore />
          </Button>

          <Card.Body
            className={`polling ${
              votedPollIds.includes(pollData._id) ? "polling-range" : ""
            }`}
          >
            <Card.Title>{pollData.question}</Card.Title>
            <Stack direction="horizontal" gap={2}>
              <Badge bg="primary" className="Badge">
                {pollData.category?.category_name}
              </Badge>
            </Stack>
            {votedPollIds.includes(pollData.poll_id) ? (
              <RangeOutput
                pollId={pollData._id}
                selectOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            ) : (
              <Card className="innerCard">
                <Card.Header className="cardHeader">Featured</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    {pollData.options.map((option, index) => (
                      <Card.Title key={index} style={{ margin: 10 }}>
                        <Form.Check
                          type="radio"
                          label={option.option}
                          value={option.option}
                          onChange={(e) => {
                            handleData(e);
                            setPollId(pollData._id);
                          }}
                          checked={selectedOption === option.option}
                          className="formRadio custom-radio"
                          style={{ margin: 10 }}
                        />
                      </Card.Title>
                    ))}
                    {pollData._id === pollId && (
                      <Button
                        type="submit"
                        style={{ margin: 10, backgroundColor: "grey" }}
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
            <Col>
              {/* Like Button */}
              <Button
                onClick={() => handleCheckboxChange(pollData._id)}
                style={{ backgroundColor: "inherit", border: "none" }}
              >
                {likedPolls && likeClikedPolls === pollData._id ? (
                  <FaHeart style={{ color: "red", fontSize: "24px" }} />
                ) : (
                  <FaRegHeart style={{ color: "black", fontSize: "24px" }} />
                )}
              </Button>
              <span>Like</span>

              <Card className="Comments_Card">
                <Card.Body>
                  <Form onSubmit={handleCommentSubmit}>
                    <Row>
                      <Col sm={12} md={9} lg={9} xl={9}>
                        <Form.Group
                          className="mb-3 mt-2"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Control
                            type=""
                            placeholder="Add a Comment"
                            name="Comments"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={3} lg={3} xl={3}>
                        <Button
                          variant="primary"
                          type="submit"
                          className="mb-3 mt-2"
                        >
                          Submit
                        </Button>
                      </Col>
                      <ul>
                        {comments.map((comment, index) => (
                          <li key={index}>
                            {UserName}: {comment}{" "}
                            <Button
                              onClick={() =>
                                handleCheckboxChange(pollData._id)
                              }
                              style={{
                                backgroundColor: "inherit",
                                border: "none",
                              }}
                            >
                              {likedPolls &&
                              likeClikedPolls === pollData.poll_id ? (
                                <FaHeart
                                  style={{ color: "red", fontSize: "24px" }}
                                />
                              ) : (
                                <FaRegHeart
                                  style={{ color: "black", fontSize: "24px" }}
                                />
                              )}
                            </Button>{" "}
                          </li>
                        ))}
                      </ul>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card>
        <hr />
      </div>
      ;
    </div>
  );
}

export default Comments;