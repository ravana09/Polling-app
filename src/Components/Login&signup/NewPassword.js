import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewPassword() {
  const navigate = useNavigate();

  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .matches(/^\d{6}$/, "Password must be exactly 6 digits")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let identification = sessionStorage.getItem("MobileNUmber");
      const response = await axios.post(
        "http://49.204.232.254:84/api/updateuser",
        {
          identifier: identification,
          password: values.newPassword,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Password Changed",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error changing password",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="Login_outer">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} md={6}>
            <Card
              className="ForgetPasswordCard"
              
            >
              <Card.Body>
                <Formik
                  initialValues={{ newPassword: "", confirmPassword: "" }}
                  validationSchema={schema}
                  onSubmit={handleSubmit}
                >
                  {({ handleChange, handleSubmit, values, isSubmitting }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label className="lOGIN_LABEL">
                          New Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Your Password"
                          name="newPassword"
                          className="Login_input"
                          value={values.newPassword}
                          onChange={handleChange}
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/\D/, "")
                              .slice(0, 6);
                          }}
                          maxLength={6}
                          isInvalid={
                            !!values.newPassword &&
                            values.newPassword.length !== 6
                          }
                        />
                        <p style={{ color: "Grey" }} className="pasword_imp">
                            {" "}
                            Password must be 6 digits
                          </p>
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label className="lOGIN_LABEL">
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirm Your Password"
                          name="confirmPassword"
                          className="Login_input"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/\D/, "")
                              .slice(0, 6);
                          }}
                          maxLength={6}
                          isInvalid={
                            !!values.confirmPassword &&
                            values.confirmPassword !== values.newPassword
                          }
                        />
                        <p style={{ color: "Grey" }} className="pasword_imp">
                            {" "}
                            Password must be 6 digits
                          </p>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>

                      <center>
                        <Button
                          type="submit"
                          variant="info"
                          className="lOGIN_bUTTON"
                          disabled={isSubmitting}
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
  );
}

export default NewPassword;
