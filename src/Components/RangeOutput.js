
import axios from "axios";
import "../Components/Range.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { GiCheckMark } from "react-icons/gi";

function RangeOutput({ pollId, selectOption }) {
  const [pollResults, setPollResults] = useState([]);

  // Personal ID
  const id = localStorage.getItem("Id");

  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        const url = `http://localhost:5000/poll/getbyid/${pollId}`;
        const res = await axios.get(url, { userID: id });
        setPollResults(res.data.options);
      } catch (error) {
        console.error("Error fetching poll results:", error);
      }
    };

    fetchPollResults();
  }, [pollId]);

  const totalVotes = pollResults.reduce(
    (total, option) => total + option.votes,
    0
  );

  const maxVotes = Math.max(...pollResults.map(option => option.votes));

  return (
    <div>
      <Row>
        <div className="polling">
          <Col md={12} sm={12}>
            <Card className="range-Card">
              <Card.Body>
                <Card className="rangeInnerCard">
                  <Card.Header className="cardHeader">
                    {totalVotes} total votes
                  </Card.Header>
                  <Card.Body>
                    {pollResults.length > 0 ? (
                      pollResults.map((option) => {
                        const percentage = (option.votes / totalVotes) * 100;
                        return (
                          <div key={option.option}>
                            <div
                              style={{
                                height: "30px",
                              }}
                            >
                              <div
                                className="Range-Colour"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: option.votes === maxVotes ? "#FF895D" : "#B7CAD4",
                                }}
                              ></div>
                              <div>
                                <b className="Result-range">
                                  <span
                                    style={{
                                      position: "relative",
                                      bottom: 35,
                                      marginLeft: 10,
                                      fontSize: 15,
                                    }}
                                  >
                                    {selectOption === option.option ? (
                                      <>
                                        <span>{` ${option.votes}   `}{" "}</span>
                                        <span style={{ marginLeft: 10, marginRight: 5 }}>
                                          <GiCheckMark />
                                        </span>
                                      </>
                                    ) : (
                                      <span>{` ${option.votes}   `}</span>
                                    )}
                                  </span>
                                  <span
                                    style={{
                                      position: "relative",
                                      bottom: 35,
                                      left: 200,
                                      fontSize: 15,
                                    }}
                                  >
                                    {option.option}
                                  </span>
                                </b>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No poll results found.</p>
                    )}
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
        </div>
      </Row>
    </div>
  );
}

export default RangeOutput;