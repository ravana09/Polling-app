import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import signUpimg from "../Images/signupCard.jpg";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

function NewPassword() {
  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });


  const navigate = useNavigate();

  function handleChanges(e) {
    
    const { name, value } = e.target;

    if (
      (name === "newPassword" || name=== "confirmPassword" ) &&
      value.length <= 8
    ) {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  }

  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .matches(/^[\w\d\W]{8}$/, "Password must be exactly 8 characters")
      .required(),
    confirmPassword: yup
      .string()
      .matches(/^[\w\d\W]{8}$/, "Password must be exactly 8 characters")
      .required(),
  });

  function handleSubmit(values) {
    
    if (values.newPassword === values.confirmPassword) {
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
        title: "Password Changed ",
      });
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
        title: "Password Should be Same ",
      });
    }

    // navigate("/login");
  }

  return (
    <div>
      <div className="Body-container">
        <Container>
          <Row className="justify-content-center align-items-center">
            {/* <Col xs={12} md={6} className="d-flex justify-content-center mb-3">
              <img className="LoginImages" src={signUpimg} alt="signupImage" />
            </Col> */}
            <Col xs={12} md={6}>
              <Card
                className="LoginCard mx-auto"
                style={{ maxWidth: "95%", height: "auto" }}
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
                        <Form.Group className="mb-3" controlId="formPassword">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter Your Password"
                            name="newPassword"
                            value={data.newPassword}
                            onChange={handleChanges}
                          />
                          <ErrorMessage
                            name="newPassword"
                            className="text-danger"
                            component="div"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Confirm Your Password"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={handleChanges}
                          />
                          <ErrorMessage
                            name="confirmPassword"
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
                            Change Password
                          </Button>
                        </center>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default NewPassword;
