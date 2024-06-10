import React from "react";
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
      .matches(/^[\w\d\W]{6}$/, "Password must be exactly 6 characters")
      .required("New Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  async function handleSubmit(values, { setSubmitting }) {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/updateuser/${localStorage.getItem(
          "MobileNUmber"
        )}`,
        {
          password: values.newPassword,
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
          title: "Password Changed",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
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
          title: "Error changing password",
        });
      }
    } catch (error) {
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
        title: "An error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="Body-container">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} md={6}>
            <Card
              className="LoginCard mx-auto"
              style={{ maxWidth: "95%", height: "auto" }}
            >
              <Card.Body>
                <Formik
                  initialValues={{ newPassword: "", confirmPassword: "" }}
                  validationSchema={schema}
                  enableReinitialize
                  onSubmit={handleSubmit}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    isSubmitting,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label style={{ color: "black" }}>
                          New Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Your Password"
                          name="newPassword"
                          value={values.newPassword}
                          onChange={handleChange}
                          isInvalid={
                            !!values.newPassword &&
                            values.newPassword.length !== 6
                          }
                        />
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label style={{ color: "black" }}>
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirm Your Password"
                          name="confirmPassword"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          isInvalid={
                            !!values.confirmPassword &&
                            values.confirmPassword !== values.newPassword
                          }
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>

                      <center>
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-50"
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
