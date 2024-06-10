import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../Components/Login.css";

function GoogleForm() {
  const [showMobileOtpInput, setShowMobileOtpInput] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [data, setData] = useState({
    MobileNumber: "",
    Password: "",
    MobileOtp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "MobileNumber" && /^\d*$/.test(value) && value.length <= 10) {
      setData({ ...data, [name]: value });
    } else if (name === "MobileOtp" && /^\d*$/.test(value) && value.length <= 6) {
      setData({ ...data, [name]: value });
    } else if (name === "Password" && value.length <= 6) {
      setData({ ...data, [name]: value });
    }
  };

  const schema = yup.object().shape({
    MobileNumber: yup
      .string()
      .matches(/^\d{10}$/, "Enter a valid 10 digit mobile number")
      .required("Mobile Number is required"),
    Password: yup
      .string()
      .max(6, "Password must be at most 6 characters")
      .required("Password is required"),
    MobileOtp: yup.string().when("showMobileOtpInput", {
      is: true,
      then: yup.string().required("OTP is required"),
    }),
  });

  const handleSubmit = async (values, actions) => {
    try {
      const response = await axios.post("http://localhost:5000/api/createuser", {
        phone_number: values.MobileNumber,
        password: values.Password,
      });

      if (response.status === 201) {
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
          icon: "success",
          title: "Signed in successfully",
        });

        setTimeout(() => {
          navigate("/polling");
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
          title: "Error in Signup",
        });
      }
    } catch (error) {
      console.error("An error occurred during sign up:", error);
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
        title: "An error occurred during sign up",
      });
    }

    actions.setSubmitting(false);
  };

  const MobileSendOTP = async () => {
    try {
      const response = await axios.post("http://localhost:5000/mobileauth/send-otp-sms", {
        number: data.MobileNumber,
      });

      if (response.status === 200) {
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
          icon: "success",
          title: "OTP Sent successfully",
        });
        setShowMobileOtpInput(true);
        setIsOtpSent(true);
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
          title: "Failed to send OTP",
        });
      }
    } catch (err) {
      console.log("Error occurred with Network: ", err);
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
        title: "Error Occurred in sending OTP",
      });
    }
  };

  const MobileOTPVerification = async (setFieldError) => {
    try {
      const response = await axios.post("http://localhost:5000/mobileauth/verify-otp-sms", {
        number: data.MobileNumber,
        otp: data.MobileOtp,
      });

      if (response.status === 200) {
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
          icon: "success",
          title: "OTP Verified successfully",
        });
        setShowMobileOtpInput(false);
        setData((prevData) => ({ ...prevData, MobileOtp: "" }));
      } else {
        setFieldError("MobileOtp", "Invalid OTP, please try again");
      }
    } catch (err) {
      console.log("Error occurred: ", err);
      setFieldError("MobileOtp", "Error occurred, please try again");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="Body-container">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} md={6}>
            <Card
              className="LoginCard mx-auto"
              style={{
                maxWidth: "95%",
                height: "auto",
                backgroundColor: "cadetblue",
              }}
            >
              <Card.Title>Kindly Fill the Form</Card.Title>
              <Card.Body>
                <Formik
                  initialValues={data}
                  validationSchema={schema}
                  enableReinitialize
                  onSubmit={handleSubmit}
                >
                  {({ handleSubmit, setFieldError }) => (
                    <Form noValidate onSubmit={handleSubmit}>
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
                            <Button type="button" onClick={MobileSendOTP} disabled={isOtpSent}>
                              {isOtpSent ? "OTP Sent" : "Send OTP"}
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
                                onClick={() => MobileOTPVerification(setFieldError)}
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
                        <Button variant="primary" type="submit" className="w-50">
                          Sign Up
                        </Button>
                      </center>
                    </Form>
                  )}
                </Formik>

                {/* <div className="text-center mt-3">
                  <p style={{ color: "black" }}>
                    Already have an account?{" "}
                    <Link to="/" style={{ color: "blue", textDecoration: "none" }}>
                      Log In
                    </Link>
                  </p>
                </div> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GoogleForm;
