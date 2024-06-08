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
  });

  function handleChange(e) {
    const { name, value } = e.target;

    switch (name) {
      case "Name":
        if (/^[A-Za-z]*$/.test(value) || value === " ") {
          setData({ ...data, [name]: value });
          console.log({ ...data, [name]: value });
        }
        break;
      case "MobileNumber":
        if (/^\d*$/.test(value) && value.length <= 10) {
          setData({ ...data, [name]: value });
          console.log({ ...data, [name]: value });
        }
        break;
      case "Email":
        setData({ ...data, [name]: value });
        console.log({ ...data, [name]: value });
        break;
      case "Password":
        if (value.length <= 6) {
          setData({ ...data, [name]: value });
          console.log({ ...data, [name]: value });
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
      .matches(/^[\w\d\W]{6}$/, "Password must be exactly 8 characters")
      .required("Password is required"),
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
      console.log(response);

      if (response.status === 201) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Signed up successfully",
        });

        console.log("Sign up successful:", response.data);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "Error:in sign up",
        });
        console.error("Sign up failed:", response.data);
        // Handle error (show error message, etc.)
      }
    } catch (error) {
      console.error("An error occurred during sign up:", error);
      // Handle error (show error message, etc.)
    }
    actions.setSubmitting(false);
  };

  const EmailSendOTP = () => {
    if (data.Email !== "") {
      setShowEmailOtpInput(true);
    }
  };
  

  const MobileSendOTP = () => {
  if(data.MobileNumber !=="" && data.MobileNumber.length !==9 && showEmailOtpInput===true){
    setShowMobileOtpInput(true);
  }
  };

  const EmailOTPVerification = () => {
    // Logic to verify the email OTP
  };

  const MobileOTPVerification = () => {
    // Logic to verify the mobile OTP
  };

  let navigate = useNavigate();

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
              style={{ maxWidth: "95%", height: "auto",backgroundColor:'cadetblue' }}
            >
              <Card.Body>
                <Formik
                  initialValues={data}
                  validationSchema={schema}
                  enableReinitialize
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
                      <div style={{marginTop:10}}>
                        <p className="text-center">
                          Already have an account? <Link to="/" style={{color:"Black",textDecoration:"none"}}>Sign In</Link>
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
