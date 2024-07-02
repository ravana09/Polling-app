import React, { useState } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import axios from "axios";
import "./Trending.css";

function Trending() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleTopThree() {
    if (loading) {
      setLoading(false);
      setData([]);
    } else {
      setLoading(true);
      try {
        const response = await axios.get("http://49.204.232.254:84/polls/top3");
        setData(response.data);
        console.log(response.data)
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  return (
    <Row>
      <Col sm={12} md={12} lg={12} xl={12} className="TrendingContainer" id="trending_Bar">
        <Card bg={"secondary"} style={{ width: "18rem" }} className="mb-2">
          <Button variant="primary" onClick={handleTopThree}>
            {loading ? "Close the Card" : "Show Top 3 Trending Polls"}
          </Button>
          {loading && (
            data.map((apidata, index) => {
          

              console.log(apidata.totalVotes)
         
              return (
                <Card.Body key={index}>
                  <Card.Title>Poll ID: {apidata.poll_id}</Card.Title>
                  <Card.Text>
                    <ListGroup variant="flush">
                      <ListGroup.Item>Question: {apidata.question}</ListGroup.Item>
                      <ListGroup.Item>Total Votes:
                        {apidata.totalVotes}
                         </ListGroup.Item>
                    </ListGroup>
                  </Card.Text>
                </Card.Body>
              );
            })
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default Trending;
