import React, { useEffect, useState } from "react";
import "../Components/Polling.css";
import { Card, Col, Form, Row, Button, Stack, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import RangeOutput from "./RangeOutput";
import { FaRegHeart, FaHeart } from "react-icons/fa";

function Polling() {

  //fetching data from api (getall)
  const [fetchData, setFetchData] = useState([]);

  //options
  const [selectedOption, setSelectedOption] = useState("");

  //voting
  const [votedPollIds, setVotedPollIds] = useState(() => {
    const storedVotedPollIds = localStorage.getItem("votedPollIds");
    return storedVotedPollIds ? JSON.parse(storedVotedPollIds) : [];
  });

  //poolid
  const [pollId, setPollId] = useState("");

  //like
  const [likedPolls, setLikedPolls] = useState(false);

  const [likeClikedPolls,setLikeClickPolls]=useState('')
 
  const [likeCount, setLikeCount] = useState({});

  //poll Searching
  const [searchingPoll, setSearchingPoll] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  //user id from local stroraghe (login)
  const id = localStorage.getItem("Id");

  //options handling
  const handleData = (e) => {
    setSelectedOption(e.target.value);
  };

  //voting function 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedOption && pollId) {
      try {
        const url = `http://localhost:5000/poll/voting/${pollId}/${selectedOption}`;
        const response = await axios.post(url, { userID: id });

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
            localStorage.setItem("votedPollIds", JSON.stringify(updatedVotedPollIds));
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `Error voting: ${error.response ? error.response.data.error : error.message}`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  //Fetching Data
  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/poll/getall");
        setFetchData(res.data);
      } catch (err) {
        console.error("Error", err);
      }
    };

    const fetchVotedPolls = async () => {
      try {
        const url = `http://localhost:5000/poll/getvoted/${id}`;
        const response = await axios.get(url);
        const { pollIds } = response.data;
        setVotedPollIds(pollIds);
      } catch (error) {
        console.error("Error fetching voted polls:", error);
      }
    };

    fetchPollData();
    fetchVotedPolls();
  }, [id]);

     //Search poll
     useEffect(() => {
      const fetchPollById = async () => {
        if (searchingPoll) {
          try {
            const response = await axios.get(`http://localhost:5000/poll/getbyid/${searchingPoll}`);
            setFetchData([response.data]);
          } catch (err) {
            console.error(err);
          }
        }
      };
  
      fetchPollById();
    }, [searchingPoll]);

    const displayedData = searchResults ? [searchResults] : fetchData;


  //Like function 

  //liking a poll
  const handleCheckboxChange = async (pollId) => {
    setLikeClickPolls(pollId)
    console.log(pollId)
  
    setLikedPolls(!likedPolls)
    try {
      const response = await axios.post(`http://localhost:5000/poll/like/${pollId}`, {
        userID: id,
      });
      if(response.status===200){
        
      }

      
    } catch (err) {
      console.error("Error in Liking ", err);
    }

    try{
      const response = await axios.get(`http://localhost:5000/poll/getliked/${id}`)
      console.log(response)
    }catch(err){
      console.error("Error in fetching liked polls", err)
    }
  };

 

  

  return (
    <div>
      <Row className="polling_row">
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              placeholder="Enter a Poll ID"
              value={searchingPoll}
              className="searchPoll"
              onChange={(e) => setSearchingPoll(e.target.value)}
            />
          </Form.Group>
        </Form>
        <div className="pollingBody">
          <Col md={12} sm={12}>
            {displayedData.map((apiData) => (
              <div key={apiData.poll_id}>
                <Card className="card">
                  <Card.Title className="poll-Title">
                    {apiData.title}
                  </Card.Title>
                  <Card.Body className={`polling ${votedPollIds.includes(apiData.poll_id) ? "polling-range" : ""}`}>
                    <Card.Title>{apiData.question}</Card.Title>
                    <Stack direction="horizontal" gap={2}>
                      <Badge bg="primary" className="Badge">
                        {apiData.category}
                      </Badge>
                    </Stack>
                    {votedPollIds.includes(apiData.poll_id) ? (
                      <RangeOutput pollId={apiData.poll_id} selectOption={selectedOption} setSelectedOption={setSelectedOption} />
                    ) : (
                      <Card className="innerCard">
                        <Card.Header className="cardHeader">Featured</Card.Header>
                        <Card.Body>
                          <Form onSubmit={handleSubmit}>
                            {apiData.options.map((option, index) => (
                              <Card.Title key={index} style={{ margin: 10 }}>
                                <Form.Check
                                  type="radio"
                                  label={option.option}
                                  value={option.option}
                                  onChange={(e) => {
                                    handleData(e);
                                    setPollId(apiData.poll_id);
                                  }}
                                  checked={selectedOption === option.option}
                                  className="formRadio custom-radio"
                                  style={{ margin: 10 }}
                                />
                              </Card.Title>
                            ))}
                            {apiData.poll_id === pollId && (
                              <Button type="submit" style={{ margin: 10, backgroundColor: "grey" }}>
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
                    <Col sm={3} md={3} lg={3} xl={3}>
                      <Button onClick={() => handleCheckboxChange(apiData.poll_id)}>
                        {likedPolls&& (likeClikedPolls===apiData.poll_id) ? (
                          <FaHeart style={{ color: "red", fontSize: "24px" }} />
                        ) : (
                          <FaHeart style={{ fontSize: "24px" }} />
                        )}
                      </Button>
                    </Col>
                    <Col>
                    
                    </Col>
                  </Row>
                </Card>
                <hr/>
              </div>
            ))}
          </Col>
        </div>
      </Row>
    </div>
  );
}

export default Polling;
