import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  DropdownButton,
  ListGroup,
  Row,
} from "react-bootstrap";
import axios from "axios";
import "../Trending/Trending.css";

function Trending() {
  const [data, setData] = useState([]);

  async function handleTopThree() {
    try {
      const response = await axios.get("http://localhost:5000/poll/top3");
      setData(response.data);
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  return (
    <Row>
      <Col sm={12} md={12} lg={12} xl={12} className="TrendingContainer">
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          {data.map((apidata, index) => (
            <Card.Body key={index}>
              {/* <Card.Title>{apidata.poll_id}</Card.Title> */}
              <Card.Text>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={apidata.poll_id}
                >
                  <ListGroup variant="flush">
                    <ListGroup.Item>{apidata.poll_id}</ListGroup.Item>
                    <ListGroup.Item>{apidata.question}</ListGroup.Item>
                    <ListGroup.Item>{apidata.totalVotes}</ListGroup.Item>
                  </ListGroup>
                </DropdownButton>
              </Card.Text>
            </Card.Body>
          ))}
          <Button variant="primary" onClick={handleTopThree}>
          Trending
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

export default Trending;
