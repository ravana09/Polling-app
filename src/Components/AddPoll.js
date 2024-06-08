import React, { useState } from "react";
import "../Components/AddPoll.css";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Nav,
  Row,
} from "react-bootstrap";
import Header from "./Header";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoOptionsSharp } from "react-icons/io5";
import { PiWarningCircleLight } from "react-icons/pi";
import Swal from "sweetalert2";
import NavBar from "./Navbar";

function AddPoll() {
  const [activeTab, setActiveTab] = useState("poll");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(0);
  const [deleteButton, SetDeleteButton] = useState(false);
  const [catogrey, setCatogery] = useState();

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
    SetDeleteButton(true);
  };

  const handleDeleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };
  
  function createPoll(){
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Poll Created Succesfully "
    });
  }
  const handlePoll = () => {
    return (
      <Card className="AddPoll-PollsCard">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          
            <Form.Control type="text" placeholder="Enter Your Title" />
          </Form.Group>
        
          <textarea
            className="AddPoll-textArea"
            placeholder="Enter poll question"
          />
          <Row>
            <Col>
              {options.map((option, index) => (
                <Form.Group className="mb-3" key={index}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IoOptionsSharp />
                    <Form.Control
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e)}
                    />
                    {deleteButton && index > 1 && (
                      <RiDeleteBin6Fill
                        variant="danger"
                        onClick={() => handleDeleteOption(index)}
                        style={{ marginLeft: "10px" }}
                      />
                    )}
                  </div>
                </Form.Group>
              ))}
              <Row>
                <Col>
                  <Button variant="secondary" onClick={addOption}>
                    Add Option
                  </Button>
                </Col>
                <Col>
                  <div>
                    Voting Period :
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="5">5 days</option>
                      <option value="10">10 days</option>
                      <option value="15">15 days</option>
                    </select>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>
                    <PiWarningCircleLight /> Tips On Better Polls
                  </Card.Title>
                  <Card.Text>
                    <ol>
                      <li>Suggest short clear options</li>
                      <li>The more options, the better</li>
                      <li>Choose the poll duration</li>
                      <li>Options can't be edited after post creation</li>
                    </ol>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
        <hr />
        <Row>
          <Col>
            Select Catogery :
            <select
              value={catogrey}
              onChange={(e) => setCatogery(e.target.value)}
            >
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Education">Education</option>
            </select>
          </Col>
          <Col>
            <Button className="Cancel-Buttons" >Cancel</Button>
            <Button onClick={()=>{
              createPoll()
            }} className="Addpoll-Buttons">Post</Button>
          </Col>
        </Row>
      </Card>
    );
  };

  function handleLink() {}

  function handleImage() {}

  function handlePost() {}

  function renderContent() {
    if (activeTab === "post") {
      return handlePost();
    } else if (activeTab === "link") {
      return handleLink();
    } else if (activeTab === "Image") {
      return handleImage();
    } else {
      return handlePoll();
    }
  }

  return (
    <>
      <Container fluid>
        <Row className="AddPoll-Header">
          <Col >
            <Header />
          </Col>
        </Row>
        <Row className="AddPoll-Cointainer">
          <Col xs={12} md={3} className="home-Body">
            {/* <NavBar/> */}
          </Col>
          <Col xs={12} md={6} className="AddPoll-Body">
            
            <Row>
              <Col>
              <Card className="AddPoll-card">
                  <Card className="AddPoll-InnerCard">
                    <Nav
                      variant="tabs"
                      defaultActiveKey="poll"
                      onSelect={(selectedKey) => setActiveTab(selectedKey)}
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="poll" className="AddPoll-Navbar">Poll</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link" disabled className="AddPoll-Navbar">Link</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="post" disabled className="AddPoll-Navbar">Post</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="Image" disabled className="AddPoll-Navbar">Image</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>{renderContent()}</Col>
            </Row>
          </Col>
          <Col xs={12} md={3}>
            {/* Add additional content or components here if needed */}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AddPoll;
