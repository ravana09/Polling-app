import React, { useEffect, useState } from "react";
import "../Login&signup/SignUp.css";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import signUpimg from "../Images/signupCard.jpg";
import GoogleImg from "../Images/googleImg.png";
import axios from "axios";
import Swal from "sweetalert2";
import { PiGenderMale } from "react-icons/pi";

function SignUp() {
  const [data, setData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    dateOfBirth: 25,
    gender: "",
  });

  // const [month, setMonth] = useState("01");
  // const [date, setDate] = useState("01");
  // const [year, setYear] = useState("");

  // useEffect(() => {
  //   if (date && year) {
  //     const formattedDate = `${year}-${month}-${String(date).padStart(2, "0")}`;
  //     setData((prevData) => ({
  //       ...prevData,
  //       dateOfBirth: formattedDate,
  //     }));
  //     console.log(formattedDate);
  //   }
  // }, [month, date, year]);

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
      .max(6, "Password must be at most 6 characters")
      .required("Password is required"),
    ConfirmPassword: yup
      .string()
      .oneOf([yup.ref("Password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  console.log(data.dateOfBirth);
  console.log(data.gender);

  const handleSubmit = async (values, actions) => {
    console.log("submited");
    // try {
    // let url = "http://49.204.232.254:84/api/createuser";
    // const response = await axios.post(url,
    const userDetails = {
      user_name: values.Name,
      email: values.Email,
      password: values.Password,
      age: data.dateOfBirth,
      gender: data.gender,
    };
    console.log(userDetails);
    // );
    // console.log(response.data);
    // if (response.status === 201) {
    //   Swal.fire({
    //     icon: "success",
    //     title: "Signed up successfully",
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    //   sessionStorage.setItem("signupEmail", data.Email);

    setTimeout(() => {
      navigate("/MobileNumberVerify", { state: { userDetails: userDetails } });
    }, 2000);
    //   } else {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Error in sign up",
    //       showConfirmButton: false,
    //       timer: 3000,
    //     });
    //   }
    // } catch (error) {
    //   console.error("An error occurred during sign up:", error);
    //   Swal.fire({
    //     icon: "error",
    //     title: "An error occurred during sign up",
    //     text: error.message,
    //     showConfirmButton: true,
    //   });
    // }
    actions.setSubmitting(false);
  };

  let navigate = useNavigate();

  function handleGoogle() {
    navigate("/GooogleForm");
  }

  return (
    <div className="Body-container sign_Body-container">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} md={6} className="d-flex justify-content-center mb-3">
            <img className="LoginImages" src={signUpimg} alt="signupImage" />
          </Col>
          <Col xs={12} md={6}>
            <Card
              className="SignCard mx-auto"
              style={{
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
                  {({ handleSubmit }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label className="Label">Name</Form.Label>
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
                        <Form.Label className="Label">Email</Form.Label>
                        <Row>
                          <Col>
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
                        </Row>
                      </Form.Group>
                      <Row>
                        <Col sm={6} md={6} lg={6} xl={6}>
                          <Form.Group
                            className="mb-3"
                            controlId="formDataOfBirth"
                          >
                            <Form.Label className="Label">
                              Date Of Birth
                            </Form.Label>

                            <Form.Control
                              type="date"
                              placeholder="Large text"
                              name="dateOfBirth"
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
                            <Form.Label className="Label">Gender</Form.Label>
                            <Form.Control
                              as="select"
                              name="gender"
                              value={data.gender}
                              onChange={handleChange}
                            >
                              <option value="" disabled selected hidden>
                                Select Gender
                              </option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="others">Others</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label className="Label">Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Your Password"
                          name="Password"
                          value={data.Password}
                          onChange={handleChange}
                        />
                        <p style={{ color: "Black" }} className="pasword_imp">
                          {" "}
                          Password must be 6 digits
                        </p>
                        <ErrorMessage
                          name="Password"
                          className="text-danger"
                          component="div"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label className="Label">
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Your Password"
                          name="ConfirmPassword"
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
                <div className="text-center_p">
                  <p style={{ color: "black" }}>Or Sign Up with</p>
                </div>
                <div className="OtherLogin">
                  <center>
                    <Button
                      variant="light"
                      className="  Google-Column"
                      style={{ height: "40px", width: "100% " }}
                      onClick={() => {
                        handleGoogle();
                      }}
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

                <div className="text-center mt-3">
                  <p style={{ color: "White" }}>
                    Already have an account?{" "}
                    <Link
                      to="/"
                      style={{ color: "Black", textDecoration: "none" }}
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
