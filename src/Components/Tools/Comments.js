import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { MdNavigateBefore } from "react-icons/md";
import PollStartingTime from "../Timing/PollStartingTime";
import PollEndingTime from "../Timing/PollEndingTime";
import RangeOutput from "../RangeOutput";

function Comments() {
  let navigate = useNavigate();
  const location = useLocation();
  const { pollID } = location.state || { pollID: null };

  const userId = sessionStorage.getItem("Id");
  const userName = sessionStorage.getItem("Users_Name");

  const [fetchData, setFetchData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [pollId, setPollId] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState([]);
  const [replyComment, setReplyComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState("");
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    fetchPollData();
    fetchVotedPolls();
    fetchComments();
  }, [newComment]);

  //fetch poll data

  const fetchPollData = async () => {
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/polls/getone",
        {
          poll_id: pollID,
        }
      );
      setFetchData(response.data);
    } catch (error) {
      console.error("Error fetching poll data:", error);
    }
  };
  //fetch voted poll
  const fetchVotedPolls = async () => {
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/polls/getvoted",
        {
          user_id: userId,
        }
      );
      const { pollIds } = response.data;
      setVotedPollIds(pollIds);
    } catch (error) {
      console.error("Error fetching voted polls:", error);
    }
  };

  //fetch comment s
  const fetchComments = async () => {
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/comment/getbyid",
        {
          poll_id: pollID,
        }
      );
      setShowComments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleData = (e, pollId) => {
    setSelectedOption(e.target.value);
    setPollId(pollId);
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
            user_id: userId,
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
          const updatedVotedPollIds = [...votedPollIds, pollId];
          setVotedPollIds(updatedVotedPollIds);
          sessionStorage.setItem(
            "votedPollIds",
            JSON.stringify(updatedVotedPollIds)
          );
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

  //comment submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/comment/createcomment",
          {
            poll_id: pollID,
            user_id: userId,
            comment: newComment,
          }
        );

        if (response.status === 200) {
          setNewComment("");
          fetchComments(); // Refresh comments after adding a new one
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleReply = (commentId) => {
    setReplyCommentId(commentId);
    console.log(commentId, "COmment id");
  };

  //Reply post
  const replyPost = async () => {
    if (replyComment !== "") {
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/comment/replycomment",
          {
            poll_id: pollID,
            user_id: userId,
            reply_msg: replyComment,
            comment_id: replyCommentId,
          }
        );

        if (response.status === 201) {
          setReplyCommentId(null);
          setReplyComment("");
          fetchComments(); // Refresh comments after adding a reply
        }
      } catch (error) {
        console.error("Error replying to comment:", error);
      }
    }
  };

  //get replies button
  const toggleReplies = (commentId) => {
    setShowReplies({
      ...showReplies,
      [commentId]: !showReplies[commentId],
    });
  };

  //reply for reply
  const handleReplyReply = (commentId) => {
    console.log(commentId, "Reply for reply ");
    return <div className="reply-for-reply">hi</div>;
  };

  return (
    <div className="comments-section">
      <Card className="card">
        <div>
          <Card.Link
            onClick={() =>
              navigate("/UserDetails", {
                state: { userID: fetchData.createdBy?._id },
              })
            }
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
                          onChange={(e) => handleData(e, fetchData._id)}
                          checked={selectedOption === option.option}
                          className="formRadio custom-radio"
                          style={{ margin: 10 }}
                        />
                      </Card.Title>
                    ))}
                  {fetchData._id === pollId && (
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
            <Card className="Comments_Card">
              <Card.Body>
                <Form onSubmit={handleCommentSubmit}>
                  <Row>
                    <Col sm={12} md={9} lg={9} xl={9}>
                      <Form.Group
                        className="mb-3 mt-2"
                        controlId="exampleForm.ControlInput1"
                      >
                        {/* MAIN comment */}
                        <Form.Control
                          type=""
                          placeholder="Add a MAIN Comment"
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
                        {/* REPLY Comment  */}
                        <p style={{ marginBottom: "5px" }}>
                          <strong>{comment.user_id.user_name}:</strong>{" "}
                          {comment.comment}
                          <Button
                            onClick={() => handleReply(comment._id)}
                            style={{ marginLeft: "10px" }}
                          >
                            Reply
                          </Button>
                          <a
                            href="/"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleReplies(comment._id);
                            }}
                          >
                            {showReplies[comment._id]
                              ? "Hide replies"
                              : "Get replies"}
                          </a>
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
                                    placeholder="Add a Reply"
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
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Reply for Reply comment */}
                        {showReplies[comment._id] && comment.replies && (
                          <ul
                            style={{
                              listStyleType: "none",
                              paddingLeft: "20px",
                            }}
                          >
                            {comment.replies.map((reply, replyIndex) => (
                              <li
                                key={replyIndex}
                                style={{
                                  marginBottom: "10px",
                                  borderBottom: "1px solid #ccc",
                                  paddingBottom: "5px",
                                }}
                              >
                                <p style={{ marginBottom: "5px" }}>
                                  <strong>{reply.user_id.user_name}:</strong>{" "}
                                  {reply.reply_msg}
                                  <Button
                                    onClick={() => handleReplyReply(reply._id)}
                                    style={{ marginLeft: "10px" }}
                                  >
                                    Reply
                                  </Button>
                                  <a
                                    href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleReplies(reply._id);
                                    }}
                                  >
                                    {showReplies[reply._id]
                                      ? "Hide replies"
                                      : "Get replies"}
                                  </a>
                                </p>
                              </li>
                            ))}
                          </ul>
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
