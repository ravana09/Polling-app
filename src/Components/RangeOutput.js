import axios from "axios";
import "../Components/Range.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { GiCheckMark } from "react-icons/gi";


function RangeOutput({ pollId, selectOption }) {
  const [pollResults, setPollResults] = useState([]);
  let [higherColur,setHignColour]=useState("");

   //personal id
   let id = localStorage.getItem("Id");
 
  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        let url=`http://localhost:5000/poll/getbyid/${pollId}`
        const res = await axios.get(
          url,{ userID: id }
        );
        setPollResults(res.data.options);
        console.log(res.data.options);
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
            {/* <Card className="range-Card">
              <Card.Body> */}
                <Card className="rangeInnerCard">
                  <Card.Header className="cardHeader">
                    {totalVotes}.total votes
                  </Card.Header>
                  <Card.Body >
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
                                  backgroundColor:
                                  option.votes === maxVotes ? "#FF895D" : "#B7CAD4",
                                  
                                }}
                              ></div>
                              <div>
                                <b className="Result-range">
                                  <span
                                    style={{
                                      position: "relative",
                                      bottom: 35,
                                      marginLeft: 10,
                                      fontSize:15
                                      
                                    }}
                                  >
                                    {selectOption === option.option ? (
                                      <>
                                      <span>{` ${option.votes}   `}{" "}</span>
                                        
                                        <span style={{marginLeft:10,marginRight:5}}>{option.option}</span>
                                        <GiCheckMark />
                                      </>
                                    ) : (
                                      <>
                                       <span >{option.votes} </span><span style={{marginLeft:10}}>  {option.option} </span>   
                                       </>
                                    )}
                                  </span>
                                </b>
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
            
              {/* </Card.Body>
              
             
            </Card> */}
          </Col>
        </div>
      </Row>
    </div>
  );
}

export default RangeOutput;
