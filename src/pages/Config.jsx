import React, { useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import VectorImage from "../assets/register.svg";
import Logout from "../assets/logout.svg";
import DeleteAccount from "../assets/deleteAccount.svg";

const Config = () => {
  const [isOnLogoutScreen, setIsOnLogoutScreen] = useState(false);
  const [isOnDeleteAccountScreen, setIsOnDeleteAccountScreen] = useState(false);

  const navigate = useNavigate();

  const handleConfigClick = () => {
    navigate("/");
  };

  const handleLogoutScreen = () => {
    setIsOnLogoutScreen(true);
    setIsOnDeleteAccountScreen(false);
  };

  const handleDeleteAccountScreen = () => {
    setIsOnDeleteAccountScreen(true);
    setIsOnLogoutScreen(false);
  };

  const handleDisconnect = () => {
    sessionStorage.setItem("token", "");
    navigate("/auth");
  };



  return (
    <Container fluid className="vh-100 w-100 p-0 m-0">
      <Row className="p-0 m-0">
        <Col xs="4" className="p-0">
          <Container fluid className="vh-100 bg-primary text-light p-0">
            <Row className="justify-content-center pt-4">
              <Col xs="10" className="d-flex gap-3">
                {/* CONFIGURAÇÕES */}
                <Button
                  onClick={handleConfigClick}
                  className="fs-2 p-0 d-flex gap-3 px-3 border-0"
                >
                  <i className="bi bi-arrow-return-left"></i>
                  Voltar
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-center pt-4">
              <Col xs="10" className="d-flex gap-3">
                {/* OPÇÕES */}
                <Button
                  variant="outline-warning"
                  onClick={handleLogoutScreen}
                  className="fs-2 p-0 d-flex gap-3 px-3 border-0 w-100"
                >
                  <i className="bi bi-box-arrow-left"></i>
                  Logout
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-center pt-4">
              <Col xs="10" className="d-flex gap-3">
                {/* OPÇÕES */}
                <Button
                  variant="outline-danger"
                  onClick={handleDeleteAccountScreen}
                  className="fs-2 p-0 d-flex gap-3 px-3 border-0 w-100"
                >
                  <i className="bi bi-shield-x"></i>
                  Apagar Conta
                </Button>
              </Col>
            </Row>
          </Container>
        </Col>
        <Col xs="8" className="p-0">
          <Container fluid className="vh-100 p-0">
            {isOnLogoutScreen ? (
              <Row className="h-100 m-0">
                <Col className="d-flex align-items-center justify-content-center h-100">
                  <Image
                    src={Logout}
                    fluid
                    style={{ maxHeight: "50%" }}
                    alt="Logout"
                  />
                  <div className="d-flex flex-column">
                    <h1 className="text-primary ">Deseja mesmo desconectar?</h1>
                    <p className="mb-5 text-center text-dark">
                      Você será redirecionado para a tela de login
                    </p>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="mb-3"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Não
                    </Button>
                    <Button size="lg" onClick={handleDisconnect}>
                      Sim
                    </Button>
                  </div>
                </Col>
              </Row>
            ) : isOnDeleteAccountScreen ? (
              <Row className="h-100 m-0">
                <Col className="d-flex align-items-center justify-content-center h-100 ">
                  <Image
                    src={DeleteAccount}
                    fluid
                    style={{ maxHeight: "50%" }}
                    alt="Delete Account"
                  />

                  <div className="d-flex flex-column ">
                    <h1 className="text-danger">
                      Deseja mesmo apagar sua conta?
                    </h1>
                    <p className="mb-5 text-center text-dark">
                      Esta ação não poderá ser desfeita, todas as listas criadas
                      serão perdidas.
                      <br />
                      Você será redirecionado para a tela de registro
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      className="mb-3"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Não
                    </Button>
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={handleDisconnect}
                    >
                      Sim
                    </Button>
                  </div>
                </Col>
              </Row>
            ) : (
              <Row className="h-100 m-0">
                <Col className="d-flex flex-column align-items-center justify-content-center h-100">
                  <Image
                    src={VectorImage}
                    fluid
                    style={{ maxHeight: "50%" }}
                    alt="image"
                  />
                  <h1 className="text-primary">Selecione uma opção ao lado</h1>
                </Col>
              </Row>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Config;
