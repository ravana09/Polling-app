import React, { useEffect, useState } from "react";
import "../Login&signup/SignUp.css";
import {
  Form,
  Button,
  Card,
  Col,
  Container,
  Row,
  Navbar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import signUpimg from "../Images/signupCard.jpg";

import axios from "axios";
import Swal from "sweetalert2";
import { PiGenderMale } from "react-icons/pi";

function GooogleForm() {
  const [data, setData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    dateOfBirth: '',
    gender: "",
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    const number = /^\d*$/;

    switch (name) {
      case "Name":
        if (/^[A-Za-z\s]*$/.test(value)) {
          setData({ ...data, [name]: value });
        }
        break;

      case "Email":
        setData({ ...data, [name]: value });
        break;

      case "dateOfBirth":
        setData({ ...data, [name]: value });

        break;

      case "gender":
        setData({ ...data, [name]: value });
        break;

      case "Password":
        if (value.length <= 6 && (number.test(value) || value === " ")) {
          setData({ ...data, [name]: value });
        }
        break;
      case "ConfirmPassword":
        if (value.length <= 6 && (number.test(value) || value === " ")) {
          setData({ ...data, [name]: value });
        }
        break;
      default:
        break;
    }
  };

  const schema = yup.object().shape({
    Name: yup.string().required("Name is required"),
    dateOfBirth: yup.date().nullable().required("Date of Birth is required"),
    Email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    Password: yup
      .string()
      .min(6, "Password must be  6 characters")
      .required("Password is required"),
    ConfirmPassword: yup
      .string()
      .oneOf([yup.ref("Password"), null], "Passwords must match"),
      gender: yup.string().required("Gender is required"),
      dateOfBirth: yup.string().required("Date of Birth is required"),
  });

  console.log(data.dateOfBirth);
  console.log(data.gender);

  const handleSubmit = async (values, actions) => {
    console.log("submited");
   
    const userDetails = {
      user_name: values.Name,
      email: values.Email,
      password: values.Password,
      age: data.dateOfBirth,
      gender: data.gender,
    };
    console.log(userDetails);

    setTimeout(() => {
      navigate("/MobileNumberVerify", { state: { userDetails: userDetails } });
    }, 2000);

    actions.setSubmitting(false);
  };

  let navigate = useNavigate();



  const handleSignUP = () => {
    navigate("/");
  };
  return (
    <>
      <div className="Login_outer" style={{
        minHeight:"100vh"
      }} >
        <Navbar expand="lg" className="Login_Header">
          <Container>
            <Navbar.Brand className="Login_nav_header">POLLING BOOTH</Navbar.Brand>
            <Navbar.Text>
              <Button  className="Login_nav_button" variant="info" onClick={handleSignUP}>
                Login
              </Button>{" "}
            </Navbar.Text>
          </Container>
        </Navbar>
        <Container>
          <Row>
            <Col  md={3} lg={3} xl={3}></Col>
            <Col  md={6} lg={6} xl={6}>
              <Card className="SignCard">
                <h3 className="Card_Header">KINDLY FILL THE DETAILS</h3>
                <Card.Body>
                  <Formik
                    initialValues={data}
                    validationSchema={schema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                  >
                    {({ handleSubmit }) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                          <Form.Label className="lOGIN_LABEL">Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=""
                            name="Name"
                            value={data.Name}
                            className="Login_input"
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="Name"
                            className="text-danger"
                            component="div"
                          />
                        </Form.Group>

                        {/* <Form.Group controlId="formEmail">
                          <Form.Label className="lOGIN_LABEL">Email</Form.Label>
                          <Row>
                            <Col>
                              <Form.Control
                                type="text"
                                placeholder="your@gmail.com"
                                name="Email"
                                value={data.Email}
                                className="Login_input"
                                onChange={handleChange}
                              />
                              <ErrorMessage
                                name="Email"
                                className="text-danger"
                                component="div"
                              />
                            </Col>
                          </Row>
                        </Form.Group> */}
                        <Row>
                          <Col sm={6} md={6} lg={6} xl={6}>
                            <Form.Group controlId="formDataOfBirth">
                              <Form.Label className="lOGIN_LABEL">
                                Date Of Birth
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="dateOfBirth"
                                className="Gender_input"
                                value={data.dateOfBirth}
                                onChange={handleChange}
                              />
                            </Form.Group>
                            <ErrorMessage
                              name="dateOfBirth"
                              className="text-danger"
                              component="div"
                            />
                          </Col>
                          <Col sm={6} md={6} lg={6} xl={6}>
                            <Form.Group controlId="genderSelect">
                              <Form.Label className="lOGIN_LABEL">
                                Gender
                              </Form.Label>
                              <Form.Control
                                as="select"
                                name="gender"
                                className="Gender_input"
                                value={data.gender}
                                onChange={handleChange}
                              >
                                <option value="" disabled hidden>
                                  Select Gender
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group controlId="formPassword">
                          <Form.Label className="lOGIN_LABEL">
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="******"
                            name="Password"
                            className="Login_input"
                            value={data.Password}
                            onChange={handleChange}
                          />
                          <p style={{ color: "Grey" }} className="pasword_imp">
                            {" "}
                            Password must be 6 digits
                          </p>
                          <ErrorMessage
                            name="Password"
                            className="text-danger"
                            component="div"
                          />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                          <Form.Label className="lOGIN_LABEL">
                            Confirm Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="******"
                            name="ConfirmPassword"
                            className="Login_input"
                            value={data.ConfirmPassword}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="Password"
                            className="text-danger"
                            component="div"
                          />
                        </Form.Group>
                        <ErrorMessage
                          name="ConfirmPassword"
                          className="text-danger"
                          component="div"
                        />
                       <Row>
                        <Col sm={4} md={4} lg={4} xl={4}></Col>
                        <Col sm={4} md={4} lg={4} xl={4}>
                            <Button
                              variant="info"
                              type="submit"
                              className="lOGIN_bUTTON"
                            >
                              Continue
                            </Button>
                          </Col>
                          <Col sm={4} md={4} lg={4} xl={4}></Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </Col>
            <Col  md={3} lg={3} xl={3}></Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default GooogleForm;
