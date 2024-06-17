import axios from "axios";
import "../Components/Range.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { GiCheckMark } from "react-icons/gi";
import PollEndingTime from "./Timing/PollEndingTime";

function RangeOutput({ pollId, selectOption, createdTime, endingTime }) {
  const [pollResults, setPollResults] = useState([]);
  let [higherColur, setHignColour] = useState("");

  //personal id
  let id = localStorage.getItem("Id");

  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        let url = `http://localhost:5000/poll/getbyid/${pollId}`;
        const res = await axios.get(url, { user_id: id });
        setPollResults(res.data.options);
        console.log(res.data.options);
      } catch (error) {
        console.error("Error fetching poll results:", error);
      }
    };

    fetchPollResults();
  }, [pollId]);

 

  const totalVotes = pollResults.reduce(
    (total, option) => total + option.voters.length,
    0
  );

  const maxVotes = Math.max(
    ...pollResults.map((option) => option.voters.length)
  );
 

  return (
    <div>
      <Row>
        <div>
          <Col md={12} sm={12}>
            <Card className="rangeInnerCard">
              <Card.Header className="cardHeader">
                <Row>
                  <Col sm={4} md={4} lg={4} xl={4}>
                    {" "}
                    {totalVotes}. votes
                  </Col>
                  <Col sm={4} md={4} lg={4} xl={4}></Col>
                  <Col sm={4} md={4} lg={4} xl={4}>
                    <PollEndingTime
                      createdTime={createdTime}
                      endingTime={endingTime}
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {pollResults.length > 0 ? (
                  pollResults.map((option) => {
                    const percentage =
                      (option.voters.length / totalVotes) * 100;

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
                              backgroundColor:
                                option.voters.length === maxVotes
                                  ? "#FF895D"
                                  : "#B7CAD4",
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
                                    <span>{` ${option.count}   `} </span>

                                    <span
                                      style={{ marginLeft: 10, marginRight: 5 }}
                                    >
                                      {option.option}
                                    </span>
                                    <GiCheckMark />
                                  </>
                                ) : (
                                  <>
                                    <span>{option.count} </span>
                                    <span style={{ marginLeft: 10 }}>
                                      {" "}
                                      {option.option}{" "}
                                    </span>
                                  </>
                                )}
                              </span>
                            </b>
                            <hr />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>No data available</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </div>
      </Row>
    </div>
  );
}

export default RangeOutput;
