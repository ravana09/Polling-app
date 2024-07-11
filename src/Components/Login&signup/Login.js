import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Container,
  Navbar,
  Nav,
} from "react-bootstrap";
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
      let url = "http://49.204.232.254:84/log/loginuser";
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
        sessionStorage.setItem("Users_Name", response.data.user.user_name);
        sessionStorage.setItem(
          "Users_PhoneNumber",
          response.data.user.phone_number
        );
        sessionStorage.setItem("Id", response.data.user._id);

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
      sessionStorage.setItem("MobileNUmber", formData.PhoneNumber);
    }
  }

  const handleSignUP=()=>{
    navigate("/signup");
  }

  return (
    <>
      <div className="Login_outer">
       
            <Navbar expand="lg" className="Login_Header">
              <Container>
                <Navbar.Brand href="#">POLLING BOOTH</Navbar.Brand>
                <Navbar.Text>
                <Button variant="info" onClick={handleSignUP}>Sign up</Button>{' '}
                </Navbar.Text>
              </Container>
            </Navbar>
     
  

        <div >
          <Container>
            <Row>
              <Col xs={12} md={3} lg={3} xl={3}>
                {/* <img className="LoginImages" src={LoginImg} alt="loginImage" /> */}
              </Col>

              <Col xs={12} md={6} lg={6} xl={6}>
                <Card
                  className="LoginCard mx-auto"
                  style={{
                    maxWidth: "80%",
                    // backgroundColor: "White",
                  }}
                >
                  <h3 className="Card_Header">LOG INTO YOUR ACCOUNT</h3>

                  <Card.Body>
                    <Formik
                      initialValues={formData}
                      validationSchema={schema}
                      enableReinitialize
                      onSubmit={handleSubmit}
                    >
                      {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit} noValidate>
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicEmail"
                          >
                            <Form.Label className="lOGIN_LABEL">
                              Mobile Number
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="+91-0987654123"
                              required
                              name="PhoneNumber"
                              value={formData.PhoneNumber}
                              onChange={handleInputChanges}
                              className="Login_input"
                              style={{ backgroundColor: "#F2F2F2" }}
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
                            <Form.Label className="lOGIN_LABEL">
                              Password
                            </Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="*********"
                              required
                              name="Password"
                              value={formData.Password}
                              className="Login_input"
                              onChange={handleInputChanges}
                            />

                            <ErrorMessage
                              name="Password"
                              className="text-danger"
                              component="div"
                            />
                          </Form.Group>

                          <Button
                           variant="info"
                            type="submit"
                            className="lOGIN_bUTTON"
                          >
                            Login
                          </Button>

                          <hr style={{ color: "black" }} />

                          <a
                            href="/ForgetPassword"
                            style={{
                              color: "#777777",
                              textDecoration: "none",
                            }}
                          >
                            Forget Password
                          </a>
                          {/* <div className="OtherLogin">
                            <center>
                              <Button
                                variant="light"
                                className="  Google-Column"
                              >
                                <img
                                  src={GoogleImg}
                                  alt="Google img"
                                  className="GoogleImg "
                                />
                              </Button>
                            </center>
                          </div> */}
                          {/* <div>
                            <p className="SignUp-text-center">
                              Don't have an account?{" "}
                              <Link
                                to="/signup"
                                style={{
                                  color: "Black",
                                  textDecoration: "none",
                                }}
                                className="Sign_Up"
                              >
                                Sign Up{" "}
                              </Link>{" "}
                            </p>
                          </div> */}
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3} lg={3} xl={3}>
                {/* <img className="LoginImages" src={LoginImg} alt="loginImage" /> */}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}

export default Login;
