import React, { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import axios from "axios";
import "./Trending.css";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp, FaVoteYea } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import "bootstrap/dist/css/bootstrap.min.css";

function Trending() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  // Fetch top 3 trending polls
  useEffect(() => {
    handleTopThree();
  }, []);

  async function handleTopThree() {
    try {
      const response = await axios.get("http://49.204.232.254:84/polls/top3");
      setData(response.data);
      // setTrend(response.data)
      // console.log(response.data);
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  function handleNavigate(trendingPollData) {
    console.log(trendingPollData);
    navigate("/polling", { state: { data: trendingPollData } });
  }

  return (
    <Row>
      <Col
        sm={12}
        md={12}
        lg={12}
        xl={12}
        className="TrendingContainer"
        id="trending_Bar"
      >
        <h1 className="Trending_poll_nameBag">Trending Polls</h1>
        {/* <Button variant="primary" onClick={handleTopThree}>
            {loading ? "Close the Card" : "Show Top 3 Trending Polls"}
          </Button> */}
        {data.map((apidata, index) => (
          <Card
            key={index}
            style={{ width: "20rem",margin:"0px 0px 20px 10px" }}
            className="Trending_Card"
            onClick={() => handleNavigate(apidata)}
          >
            <Card.Header as="h5">Question: {apidata.question}</Card.Header>
            <Card.Body>
              <Card.Text>
                {/*  */}
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <FaVoteYea className="icon" /> Total Votes:{" "}
                    {apidata.totalVotes}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FcLike /> Total Likes: {apidata.totalLikes}
                  </ListGroup.Item>
                </ListGroup>
                {/* <Button onClick={() => handleNavigate(apidata._id)}>
                  Get to the Poll
                </Button> */}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Col>
    </Row>
  );
}

export default Trending;
