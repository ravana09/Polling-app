import React, { useState } from "react";
import { Button, Card, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import "./Trending.css";

function Trending() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleTopThree() {
    setLoading(!loading);
    try {
      const response = await axios.get("http://localhost:5000/poll/top3");
      setData(response.data);
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  return (
    <Row>
      <Col sm={12} className="TrendingContainer">
        <Card bg={"secondary"} style={{ width: "18rem" }} className="mb-2">
        <Button variant="primary" onClick={handleTopThree} >
          {loading ? "Close the Card" : "Show Top 3 Trending Polls"}
        </Button>
          {/* <Card.Header>Trending Polls</Card.Header> */}
          {loading ? (
            data.map((apidata, index) => (
              <Card.Body key={index}>
                <Card.Title>Poll ID: {apidata.poll_id}</Card.Title>
                <Card.Text>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Poll ID: {apidata.poll_id}</ListGroup.Item>
                    <ListGroup.Item>Question: {apidata.question}</ListGroup.Item>
                    <ListGroup.Item>Total Votes: {apidata.totalVotes}</ListGroup.Item>
                  </ListGroup>
                </Card.Text>
              </Card.Body>
            ))
          ):("")}
        </Card>
        
      </Col>
    </Row>
  );
}

export default Trending;
