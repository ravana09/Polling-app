import React, { useState } from "react";
import "./SignUp.css";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import signUpimg from "../Images/signupCard.jpg";
import GoogleImg from "../Images/googleImg.png";

function SignUp() {
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [showMobileOtpInput, setShowMobileOtpInput] = useState(false);
  const [data, setData] = useState({
    Name: "",
    Email: "",
    MobileNumber: "",
    Password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    switch (name) {
      case "Name":
        if (/^[A-Za-z]*$/.test(value) || value === " ") {
          setData({ ...data, [name]: value });
        }
        break;
      case "MobileNumber":
        if (/^\d*$/.test(value) && value.length <= 10) {
          setData({ ...data, [name]: value });
        }
        break;
      case "Email":
        setData({ ...data, [name]: value });
        break;
      case "Password":
        if (value.length <= 8) {
          setData({ ...data, [name]: value });
        }
        break;
      default:
        break;
    }
  }

  const schema = yup.object().shape({
    Name: yup.string().required("Name is required"),
    Email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]{2,6}$/,
        "Enter a valid email"
      )
      .required("Email is required"),
    MobileNumber: yup
      .string()
      .matches(/^\d{10}$/, "Enter a valid 10 digit mobile number")
      .required("Mobile Number is required"),
    Password: yup
      .string()
      .matches(/^[\w\d\W]{8}$/, "Password must be exactly 8 characters")
      .required("Password is required"),
  });

  const EmailSendOTP = () => {
    // Logic to send OTP to the email
    setShowEmailOtpInput(true);
  };

  const MobileSendOTP = () => {
    // Logic to send OTP to the mobile number
    setShowMobileOtpInput(true);
  };

  const EmailOTPVerification = () => {
    // Logic to verify the email OTP
  };

  const MobileOTPVerification = () => {
    // Logic to verify the mobile OTP
  };

  let navigate = useNavigate();
  const handleSubmit = (values, actions) => {
    console.log(values);
    actions.resetForm();
    navigate("/");
  };

  return (
    <div className="Body-container">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} md={6} className="d-flex justify-content-center mb-3">
            <img className="LoginImages" src={signUpimg} alt="signupImage" />
          </Col>
          <Col xs={12} md={6}>
            <Card
              className="LoginCard mx-auto"
              style={{ maxWidth: "95%", height: "auto" }}
            >
              <Card.Body>
                <Formik
                  initialValues={data}
                  validationSchema={schema}
                  onSubmit={handleSubmit}
                >
                  {({ handleSubmit }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Your Name"
                          name="Name"
                          value={data.Name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <ErrorMessage
                        name="Name"
                        className="text-danger"
                        component="div"
                      />

                      <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Row>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Email"
                              name="Email"
                              value={data.Email}
                              onChange={handleChange}
                            />
                          </Col>
                          <ErrorMessage
                            name="Email"
                            className="text-danger"
                            component="div"
                          />

                          <Col sm={3}>
                            <Button type="button" onClick={EmailSendOTP}>
                              Send OTP
                            </Button>
                          </Col>
                        </Row>
                      </Form.Group>

                      {showEmailOtpInput && (
                        <Form.Group className="mb-3" controlId="formEmailOtp">
                          <Row>
                            <Form.Label>Enter OTP</Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                required
                              />
                            </Col>

                            <Col sm={6}>
                              <Button
                                onClick={EmailOTPVerification}
                                variant="success"
                              >
                                Verify
                              </Button>
                            </Col>
                          </Row>
                        </Form.Group>
                      )}

                      <Form.Group className="mb-3" controlId="formMobileNumber">
                        <Form.Label>Mobile Number</Form.Label>
                        <Row>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Mobile Number"
                              name="MobileNumber"
                              value={data.MobileNumber}
                              onChange={handleChange}
                            />
                          </Col>
                          <ErrorMessage
                            name="MobileNumber"
                            className="text-danger"
                            component="div"
                          />
                          <Col sm={3}>
                            <Button type="button" onClick={MobileSendOTP}>
                              Send OTP
                            </Button>
                          </Col>
                        </Row>
                      </Form.Group>

                      {showMobileOtpInput && (
                        <Form.Group className="mb-3" controlId="formMobileOtp">
                          <Row>
                            <Form.Label>Enter OTP</Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                required
                              />
                            </Col>
                            <Col sm={6}>
                              <Button
                                onClick={MobileOTPVerification}
                                variant="success"
                              >
                                Verify
                              </Button>
                            </Col>
                          </Row>
                        </Form.Group>
                      )}

                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Your Password"
                          name="Password"
                          value={data.Password}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <ErrorMessage
                        name="Password"
                        className="text-danger"
                        component="div"
                      />

                      <center>
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-50"
                        >
                          Sign Up
                        </Button>
                      </center>
                      <hr />
                      <div className="OtherLogin">
                      <center>
                          <Button
                            variant="light"
                            className="  Google-Column"
                            style={{ height: "40px" }}
                          >
                            <img
                              src={GoogleImg}
                              alt="Google img"
                              className="GoogleImg "
                            />
                            CONTINUE WITH GOOGLE
                          </Button>
                          </center>
                      </div>
                      <div>
                        <p className="text-center">
                          Already have an account? <Link to="/">Sign In</Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignUp;
