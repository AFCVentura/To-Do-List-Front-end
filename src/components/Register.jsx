import React, { useEffect, useRef, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import ReactPasswordChecklist from "react-password-checklist";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import VectorImage from "../assets/register.svg";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // React Router to change to Login screen
  const navigate = useNavigate();

  // for the inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // for validation
  const [isValidName, setIsValidName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);

  // final validation
  const [formValidated, setFormValidated] = useState(false);

  // the JSX tags
  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();
  const form = useRef();
  const submitButton = useRef();

  const [{ response, loading, error }, axiosRequest] = useAxios();

  useEffect(() => {}, [response]);

  // Verify if the password is valid according to all the rules specified
  const passwordVerification = (isValid, failedRules) => {
    if (isValid) {
      setIsValidPassword(true);
      return;
    }
    setIsValidPassword(false);
  };

  const emailVerification = () => {
    const regexEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const isValidEmail = regexEmail.test(emailInput.current.value);

    if (isValidEmail) {
      emailInput.current.classList.add("is-valid");
      emailInput.current.classList.remove("is-invalid");
      setIsValidEmail(true);
    } else {
      emailInput.current.classList.add("is-invalid");
      emailInput.current.classList.remove("is-valid");
      setIsValidEmail(false);
    }
  };

  const nameVerification = () => {
    const regexName = /^\s+$/;

    const isValidName =
      nameInput.current.value && !regexName.test(nameInput.current.value);

    if (isValidName) {
      nameInput.current.classList.add("is-valid");
      nameInput.current.classList.remove("is-invalid");
      setIsValidName(true);
    } else {
      nameInput.current.classList.add("is-invalid");
      nameInput.current.classList.remove("is-valid");
      setIsValidName(true);
    }
  };

  // Verify if all the fields are valid
  const fieldsVerification = () => {
    // verify if there's just white spaces

    nameVerification();
    emailVerification();
    passwordVerification();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fieldsVerification();

    if (!isValidName || !isValidEmail || !isValidPassword) {
      setFormValidated(false);
      return;
    }
    setFormValidated(true);
    axiosRequest({
      method: "POST",
      url: "/auth/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name,
        email,
        password,
      },
    });
    if (!error) {
      submitButton.current.setAttribute("disabled", true);
      navigate('/auth/login')
    }
  };

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
                <Container className="RightWrapper">
                  <h1 className="display-5 fw-bold Title text-center">
                    Criar Conta
                  </h1>
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    ref={form}
                    className="d-flex flex-column gap-2"
                  >
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label className="mb-1 text-primary">
                            Nome
                          </Form.Label>
                          <Form.Control
                            size="lg"
                            ref={nameInput}
                            required
                            type="text"
                            placeholder="Digite seu nome"
                            onChange={(e) => {
                              setName(e.target.value);
                              nameVerification();
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label className="mb-1 text-primary">
                            Email
                          </Form.Label>
                          <Form.Control
                            size="lg"
                            ref={emailInput}
                            required
                            type="email"
                            placeholder="Digite seu email"
                            onChange={(e) => {
                              setEmail(e.target.value);
                              emailVerification();
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
                            ref={passwordInput}
                            className="no-validate"
                            required
                            type="password"
                            placeholder="Digite sua senha"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      <Col>
                        <Form.Group>
                          <Form.Label className="mb-1 text-primary">
                            Confirmar Senha
                          </Form.Label>
                          <Form.Control
                            size="lg"
                            ref={confirmPasswordInput}
                            className="no-validate"
                            required
                            type="password"
                            placeholder="Digite novamente"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* More info: https://www.npmjs.com/package/react-password-checklist */}
                    <ReactPasswordChecklist
                      rules={[
                        "minLength",
                        "capitalAndLowercase",
                        "number",
                        "specialChar",
                        "noSpaces",
                        "match",
                      ]}
                      minLength={8}
                      value={password}
                      valueAgain={confirmPassword}
                      messages={{
                        minLength: "Mínimo de 8 caracteres",
                        capitalAndLowercase:
                          "Ao menos uma letra maiúscula e uma minúscula",
                        number: "Ao menos um número",
                        specialChar: "Ao menos um caractere especial",
                        noSpaces: "Não possui espaços",
                        match: "A senha e sua confirmação são iguais",
                      }}
                      onChange={passwordVerification}
                      invalidColor="#991515"
                      validColor="#217c6c"
                      iconSize={12}
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: "0.6",
                        margin: "1rem 0 1rem 0",
                      }}
                    ></ReactPasswordChecklist>
                    <div className="d-grid">
                      {error ? (
                        <Button
                          ref={submitButton}
                          type="submit"
                          variant="danger"
                          size="lg"
                        >
                          {error ?? "Ocorreu um erro inesperado"}
                        </Button>
                      ) : loading ? (
                        <Button
                          ref={submitButton}
                          type="submit"
                          variant="primary"
                          size="lg"
                        >
                          Carregando
                        </Button>
                      ) : (
                        <Button
                          ref={submitButton}
                          type="submit"
                          variant="primary"
                          size="lg"
                        >
                          Registrar-se
                        </Button>
                      )}
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
