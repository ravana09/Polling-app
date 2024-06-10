import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import LoginImg from "../Images/signUp.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function ForgetPassword() {
  const [formData, setFormData] = useState({
    PhoneNumber: "",
    MobileOtp: "",
  });
  const [showMobileOtpInput, setShowMobileOtpInput] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const schema = yup.object().shape({
    PhoneNumber: yup
      .string()
      .matches(/^\d{10}$/, "Enter only 10 digits")
      .required("Phone Number is required"),
    MobileOtp: yup.string().when("showMobileOtpInput", {
      is: true,
      then: yup.string().required("OTP is required"),
    }),
  });

  function handleChange(e) {
    const number = /^\d*$/;
    const { name, value } = e.target;

    if (
      name === "PhoneNumber" &&
      (number.test(value) || value === " ") &&
      value.length <= 10
    ) {
      setFormData({ ...formData, [name]: value });
    } else if (
      name === "MobileOtp" &&
      (number.test(value) || value === " ") &&
      value.length <= 6
    ) {
      setFormData({ ...formData, [name]: value });
    }
  }

  const navigate = useNavigate();

  function handleSubmit() {
    localStorage.setItem("MobileNUmber", formData.PhoneNumber);
    if (setIsOtpSent) {
      navigate("/NewPassword");
    } else {
    }
  }

  const MobileSendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/mobileauth/send-otp-sms",
        {
          number: formData.PhoneNumber,
        }
      );

      if (response.status === 200) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
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
          timer: 1000,
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
        timer: 1000,
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
      const response = await axios.post(
        "http://localhost:5000/mobileauth/verify-otp-sms",
        {
          number: formData.PhoneNumber,
          otp: formData.MobileOtp,
        }
      );

      if (response.status === 200) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
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
        setFormData((prevData) => ({ ...prevData, MobileOtp: "" }));
      } else {
        setFieldError("MobileOtp", "Invalid OTP, please try again");
      }
    } catch (err) {
      console.log("Error occurred: ", err);
      setFieldError("MobileOtp", "Error occurred, please try again");
    }
  };

  return (
    <div className="Body-container">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} md={6}>
            <Card
              className="LoginCard mx-auto"
              style={{ maxWidth: "100%", height: "auto" }}
            >
              <Card.Body>
                <Formik
                  initialValues={formData}
                  validationSchema={schema}
                  enableReinitialize
                  onSubmit={handleSubmit}
                >
                  {({ handleSubmit, setFieldError }) => (
                    <Form onSubmit={handleSubmit} noValidate>
                      <Form.Group className="mb-3" controlId="formMobileNumber">
                        <Form.Label>Mobile Number</Form.Label>
                        <Row>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Mobile Number"
                              name="PhoneNumber"
                              value={formData.PhoneNumber}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="PhoneNumber"
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
                        <Form.Group className="mb-3" controlId="formOtp">
                          <Row>
                            <Form.Label>Enter OTP</Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                name="MobileOtp"
                                value={formData.MobileOtp}
                                onChange={handleChange}
                                required
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
                                type="submit"
                              >
                                Verify
                              </Button>
                            </Col>
                          </Row>
                        </Form.Group>
                      )}
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

export default ForgetPassword;
