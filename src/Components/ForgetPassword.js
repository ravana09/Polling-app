import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import LoginImg from "../Images/signUp.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ForgetPassword() {
  const [formData, setFormData] = useState({
    PhoneNumber: "",
  });
  const [showOtpInput, setShowOtpInput] = useState(false);

  const schema = yup.object().shape({
    PhoneNumber: yup
      .string()
      .matches(/^\d{10}$/, "Enter only 10 digits")
      .required(),
  });

  function handleChange(e) {
    const number = /^\d*$/;
    const { name, value } = e.target;

    if (
      name === "PhoneNumber" &&
      (number.test(value) || value === " ") &&
      value.length <= 10
    ) {
      console.log({ ...formData, [e.target.name]: e.target.value });
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
  }

  const navigate = useNavigate();

  function handleSubmit() {
   
    console.log(formData.PhoneNumber);
    localStorage.setItem("Phone Number", formData.PhoneNumber);
    navigate("/NewPassword");
  }

  const handleSendOTP = () => {
    setShowOtpInput(true);
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "OTP sended successfully"
      });
  
  };

  const handleVerifyOTP = () => {
    setShowOtpInput(false);
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: " OTP is  Verified"
      });
      setTimeout(()=>{
        handleSubmit()

      },1000)
      

  };

  return (
    <>
      <div className="Body-container">
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col xs={12} md={6} className="d-flex justify-content-center mb-3">
              <img className="LoginImages" src={LoginImg} alt="loginImage" />
            </Col>

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
                    {({
                      handleSubmit,
                    
                    }) => (
                      <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group
                          className="mb-3"
                          controlId="formMobileNumber"
                        >
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
                              <Button type="button" onClick={handleSendOTP}>
                                Send OTP
                              </Button>
                            </Col>
                          </Row>
                        </Form.Group>
                        {showOtpInput && (
                          <Form.Group className="mb-3" controlId="formOtp">
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
                                  onClick={handleVerifyOTP}
                                  variant="success"
                                  type="submit"
                                >
                                  Verify
                                </Button>
                              </Col>
                            </Row>
                          </Form.Group>
                        )}
                        {/* <center>

                        <Button
                          variant="primary"
                          type="submit"
                          className="w-50"
                        >
                          Submit
                        </Button>
                        </center> */}
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ForgetPassword;
