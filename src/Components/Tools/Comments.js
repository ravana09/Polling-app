import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import Swal from "sweetalert2";
import { MdNavigateBefore } from "react-icons/md";
import PollStartingTime from "../Timing/PollStartingTime";
import PollEndingTime from "../Timing/PollEndingTime";
import RangeOutput from "../RangeOutput";

function Comments() {
  let navigate = useNavigate();

  let userName = sessionStorage.getItem("Users_Name");

  const [fetchData, setFetchData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [pollId, setPollId] = useState("");
  const [timer, setTimer] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(false);
  const UserId = sessionStorage.getItem("Id");

  const [newComment, setNewComment] = useState("");

  const [showComments, setShowComments] = useState([]);

  const [replyComment, setReplyComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState("");

  const location = useLocation();
  const { pollID } = location.state || null;

  const userID = sessionStorage.getItem("Id");
  // console.log(userID, "user Id");

  const handleData = (e) => {
    setSelectedOption(e.target.value);
  };

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

  useEffect(() => {
    fetchPollData();
    fetchVotedPolls();
  }, [userDetails]);

  const fetchPollData = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://49.204.232.254:84/polls/getone", {
        poll_id: pollID,
      });
      setFetchData(res.data);
      // console.log(res.data);
      console.log();
    } catch (err) {
      console.error("Error fetching poll data:", err);
    }
    setLoading(false);
  };

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
      setVotedPollIds(pollIds);
    } catch (error) {
      console.error("Error fetching voted polls:", error);
    }
    setLoading(false);
  };

  const handleUser = (userId) => {
    setUserDetails(!userDetails);
    navigate("/UserDetails", { state: { userID: userId } });
  };

  //comments

  //post a comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      if (newComment !== "") {
        const res = await axios.post(
          "http://49.204.232.254:84/comment/createcomment",
          {
            poll_id: pollID,
            user_id: UserId,
            comment: newComment,
          }
        );
        // console.log(res.data , "comments");
      }
      setNewComment("");
    } catch (err) {
      console.log(err);
    }
  };

  //view all comments
  useEffect(() => {
    const showwAllComments = async () => {
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/comment/getbyid",
          {
            poll_id: pollID,
          }
        );

        if (response.status === 200) {
          setShowComments(response.data);
          console.log(response.data, "Comment list");
        } else {
          console.log("comment is Not ADDDED");
        }
      } catch (err) {
        console.log(err);
      }
    };
    showwAllComments();
  }, [newComment]);

  //reply to comment
  const handleReply = (commentId) => {
    setReplyCommentId(commentId);
    // replyPost(commentId)
    // console.log(`Replying to comment with ID: ${commentId}`);
  };

  // console.log(replyComment,"reply Command")

  //reply post 
  const replyPost = async () => {
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/comment/replycomment",
        {
          poll_id: pollID,
          user_id: userID,
          reply_msg: replyComment,
          comment_id: replyCommentId,
        }
      );
      console.log(response.data, "reply comment");
      if (response.status === 201) {
        setReplyCommentId(null);
        setReplyComment("");
        setShowComments(response.data);
        console.log(response.data, "Comment list");
      }
    } catch (err) {
      console.log(err);
    }

    // console.log(replyCommentId, "reply post");
  };

  //like to comment
  const handleLike = (commentId) => {
    // Implement like functionality here, e.g., increment likes for the comment
    // console.log(`Liking comment with ID: ${commentId}`);
  };

  return (
    <div className="comments-section">
      <Card className="card">
        <div>
          <Card.Link
            onClick={() => handleUser(fetchData.createdBy?._id)}
            style={{ fontSize: 20 }}
          >
            {fetchData.createdBy?.user_name}
          </Card.Link>
        </div>
        <h6>
          {fetchData.title}{" "}
          <span>
            <PollStartingTime createdTime={fetchData.created_date} />
          </span>
        </h6>
        <Card.Body>
          <Card.Title>{fetchData.question}</Card.Title>
          <Stack direction="horizontal" gap={2}>
            <Badge bg="primary" className="Badge">
              {fetchData.category?.category_name}
            </Badge>
          </Stack>
          {votedPollIds.includes(fetchData._id) ? (
            <RangeOutput
              pollId={fetchData._id}
              selectOption={selectedOption}
              setSelectedOption={setSelectedOption}
              createdTime={fetchData.created_date}
              endingTime={fetchData.expirationTime}
            />
          ) : (
            <Card className="innerCard">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {fetchData.options &&
                    fetchData.options.map((option, index) => (
                      <Card.Title key={index} style={{ margin: 10 }}>
                        <Form.Check
                          type="radio"
                          label={option.option}
                          value={option.option}
                          onChange={(e) => {
                            handleData(e);
                            setPollId(fetchData._id);
                          }}
                          checked={selectedOption === option.option}
                          className="formRadio custom-radio"
                          style={{ margin: 10 }}
                        />
                      </Card.Title>
                    ))}

                  {fetchData._id === pollId && timer && (
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
          <Col>
            {/* Like Button */}

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
                  </Row>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {showComments.map((comment, index) => (
                      
                      <li
                        key={index}
                        style={{
                          marginBottom: "15px",
                          borderBottom: "1px solid #ccc",
                          paddingBottom: "10px",
                        }}
                      >
                        <p style={{ marginBottom: "5px" }}>
                          <strong>{comment.user_id.user_name}:</strong>{" "}
                          {comment.comment}
                          <Button
                            onClick={() => handleReply(comment._id)}
                            style={{ marginRight: "10px" }}
                          >
                            Reply
                          </Button>
                          <button onClick={() => handleLike(comment._id)}>
                            Like
                          </button>
                        </p>
                        {comment._id === replyCommentId && (
                          <div>
                            <Row>
                              <Col sm={9} md={9} lg={9} xl={9}>
                                <Form.Group
                                  className="mb-3 mt-2"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    type=""
                                    placeholder="Add a Comment"
                                    name="Comments"
                                    value={replyComment}
                                    onChange={(e) =>
                                      setReplyComment(e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col sm={3} md={3} lg={3} xl={3}>
                                <Button
                                  variant="primary"
                                  type="submit"
                                  className="mb-3 mt-2"
                                  onClick={replyPost}
                                >
                                  Reply
                                </Button>
                              <ol>
                                <li>

                                </li>
                              </ol>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </li>
                      
                    ))}
                  </ul>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card>
      <hr />
    </div>
  );
}

export default Comments;
