import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import LoginImg from "../Images/signUp.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function MobileNum() {
  const [formData, setFormData] = useState({
    PhoneNumber: "",
    MobileOtp: "",
  });

  const [showMobileOtpInput, setShowMobileOtpInput] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const location = useLocation();
  const { userDetails } = location.state || { userDetails: null };
  console.log(userDetails);

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

  async function handleSubmit() {
    sessionStorage.setItem("MobileNUmber", formData.PhoneNumber);
    if (setIsOtpSent) {
      try {
        let url = "http://49.204.232.254:84/api/createuser";
        // const dataToSend = {
        //   ...userDetails,
        //   phone_number: formData.PhoneNumber,
        // };
        // console.log(dataToSend,"dataSend");
        console.log(userDetails.userDetails);
        const response = await axios.post(url, {
          ...userDetails,
          phone_number: formData.PhoneNumber,
        });
        console.log(response.data);
        if (response.status === 201) {
          navigate("/");
        }
        console.log(response.data);
      } catch (err) {}
    } else {
    }
  }

  const MobileSendOTP = async () => {
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/mobileauth/send-otp-sms",
        {
          number: formData.PhoneNumber,
          appName:"POLL APP"
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
      "http://49.204.232.254:84/mobileauth/verify-otp-sms",
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
    <div className="Login_outer">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} md={6}>
            <Card
              className="ForgetPasswordCard "
   
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
                        <Form.Label className="lOGIN_LABEL">Mobile Number</Form.Label>
                        <Row>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Mobile Number"
                              name="PhoneNumber"
                               className="Login_input"
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
                            <Button type="button" variant="info"  className="lOGIN_bUTTON" onClick={MobileSendOTP}>
                              Send OTP
                            </Button>
                          </Col>
                        </Row>
                      </Form.Group>
                      {showMobileOtpInput && (
                        <Form.Group className="mb-3" controlId="formOtp">
                          <Row>
                            <Form.Label className="lOGIN_LABEL">Enter OTP</Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                name="MobileOtp"
                                 className="Login_input"
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

export default MobileNum;
