import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons";
import "../Login&signup/Login.css";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";

import LoginImg from "../Images/signUp.jpg";
import GoogleImg from "../Images/googleImg.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  const [formData, setFormData] = useState({
    PhoneNumber: "",
    Password: "",
  });

  const schema = yup.object().shape({
    PhoneNumber: yup
      .string()
      .matches(/^\d{10}$/, "Enter only 10 digits")
      .required(),
    Password: yup
      .string()
      .matches(/^[\w\d\W]{6}$/, "Enter only 8 digits")
      .required("Password is required"),
  });

  function handleInputChanges(e) {
    const number = /^\d*$/;

    const { name, value } = e.target;

    if (
      name === "PhoneNumber" &&
      (number.test(value) || value === " ") &&
      value.length <= 10
    ) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else if (name === "Password" && value.length <= 6) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }

  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      // Api Calling
      let url="http://49.204.232.254:84/log/loginuser"
      const response = await axios.post(url, {
        phone_number: formData.PhoneNumber,
        password: formData.Password,
      });

      console.log(response.data.user.user_name);
      console.log(response);

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
          title: "Signed in successfully",
        });

        //local storage 
        localStorage.setItem("Users_Name", response.data.user.user_name);
        localStorage.setItem(
          "Users_PhoneNumber",
          response.data.user.phone_number
        );
        localStorage.setItem("Id", response.data.user._id);

        console.log("Signed in successfully");
        setTimeout(() => {
          navigate("/polling");
        }, 1000);
      }
    } catch (err) {
      console.error("Error Occurred:", err);
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
        title: "User is not a register User",
      });


      setTimeout(() => {
        navigate("/signup");
      }, 1000);
      localStorage.setItem("MobileNUmber", formData.PhoneNumber);
    }
  }

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
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  backgroundColor: "cadetblue",
                }}
              >
                <Card.Body>
                  <Formik
                    initialValues={formData}
                    validationSchema={schema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                  >
                    {({ handleSubmit }) => (
                      <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Mobile Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Your Mobile Number "
                            required
                            name="PhoneNumber"
                            value={formData.PhoneNumber}
                            onChange={handleInputChanges}
                          />
                          <ErrorMessage
                            name="PhoneNumber"
                            className="text-danger"
                            component="div"
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter Your Password"
                            required
                            name="Password"
                            value={formData.Password}
                            onChange={handleInputChanges}
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
                            className="w-75"
                          >
                            Login
                          </Button>
                        </center>
                        <hr />
                        <center>
                          {" "}
                          <a
                            href="/ForgetPassword"
                            style={{ color: "Black", textDecoration: "none" }}
                          >
                            Forget Password{" "}
                          </a>
                          <p>OR</p>
                        </center>

                        <div className="OtherLogin">
                          <center>
                            <Button
                              variant="light"
                              className="  Google-Column"
                              style={{ height: "40px", width: "100% " }}
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
                            Don't have an account?{" "}
                            <Link
                              to="/signup"
                              style={{ color: "Black", textDecoration: "none" }}
                            >
                              Sign Up{" "}
                            </Link>{" "}
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
    </>
  );
}

export default Login;
