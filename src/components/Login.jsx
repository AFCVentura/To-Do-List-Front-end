import React, { useContext, useEffect, useRef, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Col, Container, Row, Form, Image } from "react-bootstrap";
import VectorImage from "../assets/register.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [{ response, loading, error }, axiosRequest] = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axiosRequest({
      method: "POST",
      url: "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        password,
      },
    });
  };

  useEffect(() => {
    if (response.length !== 0) {
      sessionStorage.setItem("token", response.data.token);
      navigate("/");
    }
  }, [response]);

  return (
    <Container fluid className="Background">
      <Row className="justify-content-center align-items-center ContainerRow">
        <Col xs={8}>
          <Container
            className="p-4 AuthContainer"
            style={{ borderRadius: "1rem" }}
          >
            <Row>
              <Col className="d-flex align-items-center justify-content-center">
                <Image
                  src={VectorImage}
                  fluid
                  style={{ maxHeight: "75%" }}
                  alt="Register image"
                />
              </Col>
              <Col>
                <Container className="RightWrapper d-flex flex-column justify-content-center h-100">
                  <h1 className="display-5 fw-bold Title text-center">
                    Login
                  </h1>
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    className="d-flex flex-column gap-2"
                  >
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label className="mb-1 text-primary">
                            Email
                          </Form.Label>
                          <Form.Control
                            size="lg"
                            required
                            type="email"
                            placeholder="Digite seu email"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label className="mb-1 text-primary">
                            Senha
                          </Form.Label>
                          <Form.Control
                            size="lg"
                            className="no-validate"
                            required
                            type="password"
                            placeholder="Digite sua senha"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid text-center lh-1">
                      {error ? (
                        <Button type="submit" variant="danger" size="lg">
                          {error ?? "Ocorreu um erro inesperado"}
                        </Button>
                      ) : loading ? (
                        <Button type="submit" variant="primary" size="lg">
                          Carregando
                        </Button>
                      ) : (
                        <Button type="submit" variant="primary" size="lg">
                          Registrar-se
                        </Button>
                      )}
                      <p className="mb-0 mt-2">Ainda não possui uma conta?</p>
                      <Link to="/auth/register">Crie sua conta aqui</Link>
                    </div>
                  </Form>
                </Container>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
