import React, { useEffect, useState } from "react";
import "../Components/AddPoll.css";
import { Button, Card, Col, Container, Form, Nav, Row } from "react-bootstrap";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoOptionsSharp } from "react-icons/io5";
import { PiWarningCircleLight } from "react-icons/pi";
import Swal from "sweetalert2";
import axios from "axios";

function AddPoll() {
  const [data, setData] = useState({
    title: "",
    question: "",
    desc: "",
    options: [{ option: "" }, { option: "" }],
    expirationTime: "",
  });

  const id = localStorage.getItem("Id");

  const handleChanges = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const [activeTab, setActiveTab] = useState("poll");
  const [duration, setDuration] = useState(1);
  const [category, setCategory] = useState([]);
  const [CatogryChoose, setCatogerChoose] = useState("");

  const handleOptionChange = (index, event) => {
    const newOptions = [...data.options];
    newOptions[index].option = event.target.value;
    setData({ ...data, options: newOptions });
  };

  const addOption = () => {
    setData({ ...data, options: [...data.options, { option: "" }] });
  };

  const handleDeleteOption = (index) => {
    const newOptions = data.options.filter((_, i) => i !== index);
    setData({ ...data, options: newOptions });
  };

  //catogery id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/Category/getall"
        );
        // console.log(response.data);
        setCategory(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // console.log(CatogryChoose);

  const createPoll = async (e) => {
    e.preventDefault();

    if (
      !data.title ||
      !data.question ||
      data.options.some((option) => !option.option)
    ) {
      Swal.fire({
        icon: "error",
        title: "All fields are required",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/poll/create", {
        question: data.question,
        title: data.title,
        category: CatogryChoose,
        options: data.options,
        createdBy: id,
        desc: data.desc,
        duration: duration,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Poll Created Successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        setData({
          title: "",
          question: "",
          desc: "",
          options: [{ option: "" }, { option: "" }],
          expirationTime: "",
        });
        setCategory("Music");
        setDuration(5);
      }
    } catch (error) {
      console.error("Error creating poll:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to create poll",
        text: error.response?.data?.message || "Internal server error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const renderOptions = () => (
    <Col className="option_card">
      {data.options.map((option, index) => (
        <Form.Group className="mb-3" key={index}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoOptionsSharp />
            <Form.Control
              type="text"
              placeholder={`Option ${index + 1}`}
              name="options"
              value={option.option}
              onChange={(e) => handleOptionChange(index, e)}
              required
            />
            {index > 1 && (
              <RiDeleteBin6Fill
                variant="danger"
                onClick={() => handleDeleteOption(index)}
                style={{ marginLeft: "10px", cursor: "pointer" }}
              />
            )}
          </div>
        </Form.Group>
      ))}
      <Row>
        <Col sm={6} md={5}>
          <Button variant="secondary" className="AddButton" onClick={addOption}>
            Add Option
          </Button>
        </Col>
        <Col sm={6} md={7}>
          <div style={{ marginTop: 10 }}>
            <p>
              Voting Period:
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                <option value={1}> 1 Hours</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
              </select>
            </p>
          </div>
        </Col>
      </Row>
    </Col>
  );

  const renderPollForm = () => (
    <Card className="AddPoll-PollsCard">
      <Form onSubmit={createPoll}>
        <Form.Group className="mb-3" controlId="pollTitle">
          <Form.Control
            type="text"
            placeholder="Enter Your Title"
            name="title"
            value={data.title}
            onChange={handleChanges}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="pollQuestion">
          <Form.Control
            as="textarea"
            placeholder="Enter poll question"
            className="AddPoll-textArea"
            name="question"
            value={data.question}
            onChange={handleChanges}
            required
          />
        </Form.Group>
        <Row>
          {renderOptions()}
          <Col>
            <Card className="Notification_card">
              <Card.Body>
                <Card.Title>
                  <p>
                    <PiWarningCircleLight />
                    Tips On Better Polls
                  </p>
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
        <hr />
        <Row>
          <Col>
            Select Category:
            <select
              value={CatogryChoose}
              onChange={(e) => setCatogerChoose(e.target.value)}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              {Array.isArray(category) &&
                category.map((cat, index) => (
                  <option key={index} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
            </select>
          </Col>

          <Col className="d-flex justify-content-end">
            <Button variant="secondary" className="Cancel-Buttons">
              Cancel
            </Button>
            <Button
              type="submit"
              className="Addpoll-Buttons"
              style={{ marginLeft: "10px" }}
            >
              Post
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "post":
        return handlePost();
      case "link":
        return handleLink();
      case "Image":
        return handleImage();
      default:
        return renderPollForm();
    }
  };

  const handleLink = () => {
    // Your code for handling link tab
  };

  const handleImage = () => {
    // Your code for handling image tab
  };

  const handlePost = () => {
    // Your code for handling post tab
  };

  return (
    <Container fluid>
      <Row className="AddPoll-Cointainer">
        <Col className="AddPoll-Body">
          <Row>
            <Col>
              <Nav
                variant="tabs"
                defaultActiveKey="poll"
                onSelect={(selectedKey) => setActiveTab(selectedKey)}
              >
                <Nav.Item>
                  <Nav.Link eventKey="poll" className="AddPoll-Navbar">
                    Poll
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link" disabled className="AddPoll-Navbar">
                    Link
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="post" disabled className="AddPoll-Navbar">
                    Post
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="Image"
                    disabled
                    className="AddPoll-Navbar"
                  >
                    Image
                  </Nav.Link>
                </Nav.Item>
              </Nav>
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
  );
}

export default AddPoll;
