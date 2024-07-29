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
  console.log(pollID)

  const userId = sessionStorage.getItem("Id");
  const userName = sessionStorage.getItem("Users_Name");

  
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState([]);
  const [replyComment, setReplyComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [showReplyForReply, setShowReplyForReply] = useState(false);
  const [showReplyForReplyId, setShowReplyForReplyId] = useState("");
  const [ReplyForReplyComment, setReplyForReplyComment] = useState("");

 
  //fetch single poll

  useEffect(()=>{
    const fetchPoll = async () => {

const response=await axios.post

    }

  })

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

  //reply for reply  comment
  const replyForReplyPost = async () => {
    
    console.log(showReplyForReplyId, "Reply comments");
    console.log(ReplyForReplyComment, "reply for reply comment ");
    if (ReplyForReplyComment !== "") {  
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/comment/replycomment",
 {
            poll_id: pollID,
            user_id: userId,
            reply_msg: ReplyForReplyComment,
            comment_id: showReplyForReplyId,
          }
        );
        console.log(response.data, "response");

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

  

  //reply for reply
  const handleReplyReply = (commentId) => {
    console.log(commentId, "Reply for reply ");
    setShowReplyForReplyId(commentId);
    setShowReplyForReply(!showReplyForReply);
    
  };
  console.log(showReplyForReplyId);

  return (
    <div className="comments-section">
      <Card className="poll_card">
      
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
                                 {showReplies[comment._id] === comment.replies? "Close Reply" : "Reply"}

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
                                  
                                    <a href={"/"}>
                                      @{comment.user_id.user_name}:
                                    </a>
                                    <span>{reply.reply_msg}</span>{" "}
                                  
                                  <Button
                                    onClick={() => handleReplyReply(reply._id)}
                                    style={{ marginLeft: "10px" }}
                                  >
                                    {showReplyForReply &&
                                    showReplyForReplyId === reply._id
                                      ? "Close Reply"
                                      : "Reply"}
                                  </Button>
                                  <a
                                    href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleReplies(reply._id);
                                    }}
                                  >
                                    {showReplyForReplyId[reply._id]
                                      ? "Hide replies"
                                      : "Get replies"}
                                  </a>
                                </p>
                                <ul>
                                  {showReplyForReply &&
                                    showReplyForReplyId === reply._id && (
                                      <li>
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
                                                value={ReplyForReplyComment}
                                                onChange={(e) =>
                                                  setReplyForReplyComment(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </Form.Group>
                                          </Col>
                                          <Col sm={3} md={3} lg={3} xl={3}>
                                            <Button
                                              variant="primary"
                                              type="submit"
                                              className="mb-3 mt-2"
                                              onClick={replyForReplyPost}
                                            >
                                              Reply
                                            </Button>
                                          </Col>
                                        </Row>
                                      </li>
                                    )}
                                </ul>
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
      {/* <hr /> */}
    </div>
  );
}

export default Comments;
