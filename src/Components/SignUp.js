import React, { useState } from "react";
import "./SignUp.css";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import signUpimg from "../Images/signupCard.jpg";
import GoogleImg from "../Images/googleImg.png";
import axios from "axios";
import Swal from "sweetalert2";

function SignUp() {
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [showMobileOtpInput, setShowMobileOtpInput] = useState(false);
  const [data, setData] = useState({
    Name: "",
    Email: "",
    MobileNumber: "",
    Password: "",
    EmailOtp: "",
    MobileOtp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "Name":
        if (/^[A-Za-z\s]*$/.test(value)) {
          setData({ ...data, [name]: value });
        }
        break;
      case "MobileNumber":
        if (/^\d*$/.test(value) && value.length <= 10) {
          setData({ ...data, [name]: value });
        }
        break;
      case "MobileOtp":
        if (/^\d*$/.test(value) && value.length <= 6) {
          setData({ ...data, [name]: value });
        }
        break;
      case "Email":
      case "EmailOtp":
        setData({ ...data, [name]: value });
        break;
      case "Password":
        if (value.length <= 6) {
          setData({ ...data, [name]: value });
        }
        break;
      default:
        break;
    }
  };

  const schema = yup.object().shape({
    Name: yup.string().required("Name is required"),
    Email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    MobileNumber: yup
      .string()
      .matches(/^\d{10}$/, "Enter a valid 10 digit mobile number")
      .required("Mobile Number is required"),
    Password: yup
      .string()
      .max(6, "Password must be at most 6 characters")
      .required("Password is required"),
    EmailOtp: yup.string().when("showEmailOtpInput", {
      is: true,
      then: yup.string().required("OTP is required"),
    }),
  });

  const handleSubmit = async (values, actions) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/createuser",
        {
         
          user_name: values.Name,
          email: values.Email,
          phone_number: values.MobileNumber,
          password: values.Password,
        }
       
      );
      console.log(response.data)
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Signed up successfully",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error in sign up",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("An error occurred during sign up:", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred during sign up",
        text: error.message,
        showConfirmButton: true,
      });
    }
    actions.setSubmitting(false);
  };

  const EmailSendOTP = async () => {
    try {
      if (!data.Email) {
        throw new Error("Email is required");
      }

      const response = await axios.post(
        "http://localhost:5000/emailauth/send-welcome-email",
        { email: data.Email }
      );

      if (response.status === 200) {
        setShowEmailOtpInput(true);
        Swal.fire({
          icon: "success",
          title: "OTP sent successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to send OTP",
          showConfirmButton: true,
        });
      }
    } catch (err) {
      console.log("Error occurred: ", err);
      Swal.fire({
        icon: "error",
        title: "Error occurred",
        text: err.message,
        showConfirmButton: true,
      });
    }
  };

  const EmailOTPVerification = async (values, setFieldError) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/emailauth/verify-otp",
        { email: data.Email, otp: data.EmailOtp }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Email verified successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        setShowEmailOtpInput(false);
      } else {
        setFieldError("EmailOtp", "Invalid OTP, please try again");
      }
    } catch (err) {
      console.log("Error occurred: ", err);
      setFieldError("EmailOtp", "Error occurred, please try again");
    }
  };

  const MobileSendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/mobileauth/send-otp-sms",
        {
          number: data.MobileNumber,
        }
      );
      if (response.status === 200) {
        setShowMobileOtpInput(true);
        console.log("Otp has been sent to Mobile Number ", response);
      } else {
        console.log("Error in sending OTP to Mobile Number ", response);
      }
    } catch (err) {
      console.log("Error occurred: ", err);
    }
  };

  const MobileOTPVerification = async (setFieldError) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/mobileauth/verify-otp-sms",
        {
          number: data.MobileNumber,
          otp: data.MobileOtp,
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Mobile number verified successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        setShowMobileOtpInput(false);
      } else {
        setFieldError("MobileOtp", "Invalid OTP, please try again");
      }
    } catch (err) {
      console.log("Error occurred: ", err);
      setFieldError("MobileOtp", "Error occurred, please try again");
    }
  };

  let navigate=useNavigate()
  function handleGoogle() {
    navigate('/GooogleForm')
    
  }



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
              style={{
                maxWidth: "95%",
                height: "auto",
                backgroundColor: "cadetblue",
              }}
            >
              <Card.Body>
                <Formik
                  initialValues={data}
                  validationSchema={schema}
                  enableReinitialize
                  onSubmit={handleSubmit}
                >
                  {({ handleSubmit, setFieldError }) => (
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
                        <ErrorMessage
                          name="Name"
                          className="text-danger"
                          component="div"
                        />
                      </Form.Group>

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
                            <ErrorMessage
                              name="Email"
                              className="text-danger"
                              component="div"
                            />
                          </Col>
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
                                name="EmailOtp"
                                value={data.EmailOtp}
                                onChange={handleChange}
                              />
                              <ErrorMessage
                                name="EmailOtp"
                                className="text-danger"
                                component="div"
                              />
                            </Col>
                            <Col sm={6}>
                              <Button
                                onClick={() =>
                                  EmailOTPVerification(data, setFieldError)
                                }
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
                            <ErrorMessage
                              name="MobileNumber"
                              className="text-danger"
                              component="div"
                            />
                          </Col>
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
                            <Form.Label>Enter Mobile OTP</Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                type="text"
                                placeholder="Enter Mobile OTP"
                                name="MobileOtp"
                                value={data.MobileOtp}
                                onChange={handleChange}
                              />
                              <ErrorMessage
                                name="MobileOtp"
                                className="text-danger"
                                component="div"
                              />
                            </Col>
                            <Col sm={6}>
                              <Button
                                onClick={() =>
                                  MobileOTPVerification(setFieldError)
                                }
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
                        <ErrorMessage
                          name="Password"
                          className="text-danger"
                          component="div"
                        />
                      </Form.Group>

                      <center>
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-50"
                        >
                          Sign Up
                        </Button>
                      </center>
                    </Form>
                  )}
                </Formik>

                <div className="text-center mt-4">
                  <p style={{ color: "black" }}>Or Sign Up with</p>
                  <Button
                    variant="outline-primary"
                    className="GoogleButton"
                    style={{ backgroundColor: "white", color: "red",width:"100%" }}
                    onClick={() => {
                      handleGoogle();
                    }}
                  >
                    <img
                      src={GoogleImg}
                      alt="Google"
                      style={{
                        width: "30px",
                        marginRight: "8px",
                      }}
                    />
                    Google
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p style={{ color: "black" }}>
                    Already have an account?{" "}
                    <Link
                      to="/"
                      style={{ color: "blue", textDecoration: "none" }}
                    >
                      {" "}
                      Log In
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignUp;
