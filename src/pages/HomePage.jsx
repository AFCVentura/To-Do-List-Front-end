import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  ListGroup,
  Alert,
  TabContainer,
  Table,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState("");
  const [currentListId, setCurrentListId] = useState(null);
  const [currentListName, setCurrentListName] = useState("");
  const [items, setItems] = useState([]);
  const [itemDescription, setItemDescription] = useState("");
  const [wantToAddList, setWantToAddList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);

  const token = sessionStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/list/all",
        axiosConfig
      );
      setLists(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar listas:", error);
    }
  };

  const handleCreateList = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "http://localhost:8080/api/list",
        { name: listName, user: null },
        axiosConfig
      );
      setLists([...lists, response.data]);
      setListName("");
    } catch (error) {
      console.error("Erro ao criar lista:", error);
    }
  };

  const handleSelectList = async (id, name) => {
    setCurrentListId(id);
    setCurrentListName(name);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/item/${id}`,
        axiosConfig
      );
      setItems(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const handleDeleteList = async (id) => {
    if (!id) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/list/${id}`, axiosConfig);
      setLists(lists.filter((list) => list.id !== id));
      if (currentListId === id) {
        setItems([]);
        setCurrentListId(null);
      }
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!currentListId) return;
    try {
      const response = await axios.post(
        "http://localhost:8080/api/item",
        {
          description: itemDescription,
          state: false,
          listEntity: { id: currentListId },
        },
        axiosConfig
      );
      setItems([...items, response.data]);
      setItemDescription("");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/item/${id}`, axiosConfig);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleToggleItemStatus = async (id, currentState) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/item/${id}`,
        { state: !currentState },
        axiosConfig
      );
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, state: !currentState } : item
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o status da tarefa:", error);
    }
  };

  const handleConfigClick = () => {
    navigate("/config");
  };

  const handleWantToAddList = () => {
    setWantToAddList(!wantToAddList);
  };

  const openModal = (id) => {
    setSelectedListId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedListId(null);
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
                  className="fs-2 p-0 d-flex gap-3 px-3"
                >
                  <i className="bi bi-gear-fill"></i>
                  Configurações
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-center pt-4">
              <Col xs="10">
                {/* BOTÃO ADICIONAR LISTA */}
                <Button
                  className="fs-2 p-0 d-flex gap-3 px-3"
                  onClick={handleWantToAddList}
                >
                  <i className="bi bi-plus-circle"></i>
                  Adicionar Lista
                </Button>
              </Col>
            </Row>
            {/* INPUT ADICIONAR LISTA */}
            {wantToAddList && (
              <Row className="pt-4">
                <Col xs={{ span: 9, offset: 1 }} className="d-flex gap-3">
                  <Form onSubmit={handleCreateList} className="w-100">
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Criar nova lista"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                    />
                  </Form>
                </Col>
              </Row>
            )}
            {/* LISTAS */}
            <Row className="pt-4">
              <Col xs={{ span: 9, offset: 1 }}>
                <table className="w-100 table-primary table-hover">
                  <tbody>
                    {lists.map((list) => (
                      <tr
                        key={list.id}
                        onClick={() => handleSelectList(list.id, list.name)}
                      >
                        <td className="">
                          <Button className="w-100 d-flex justify-content-between">
                            <p className="fs-4 bg-transparent text-light m-0">
                              {list.name}
                            </p>
                            <div className="bg-transparent d-flex align-items-center">
                              <Button
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(list.id);
                                }}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </Button>
                            </div>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          </Container>
        </Col>
        <Col xs="8" className="p-0">
          <Container fluid className="vh-100 p-0 ps-5">
            {currentListId && (
              <div className="pt-4">
                <h1 className="text-primary">{currentListName}</h1>
                <Form onSubmit={handleCreateItem}>
                  <Container fluid>
                    <Row className="w-100">
                      <Col xs="8" className="p-0">
                        <Form.Control
                          type="text"
                          placeholder="Adicionar nova tarefa"
                          value={itemDescription}
                          onChange={(e) => setItemDescription(e.target.value)}
                        />
                      </Col>
                      <Col xs="4">
                        <Button className="w-100">Adicionar Tarefa</Button>
                      </Col>
                    </Row>
                  </Container>
                </Form>

                {items.length > 0 ? (
                  <ListGroup className="mt-2 pe-4">
                    {items.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        className="d-flex justify-content-between pe-5"
                      >
                        <Form.Check
                          type="checkbox"
                          label={
                            <span
                              style={{
                                textDecoration: item.state
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {item.description}
                            </span>
                          }
                          checked={item.state}
                          onChange={() =>
                            handleToggleItemStatus(item.id, item.state)
                          }
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="ms-2"
                        >
                          Deletar
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <Container fluid>
                    <Row className="w-100">
                      <Col xs="12" className="p-0">
                        <Alert variant="primary" className="mt-2">
                          Nenhuma tarefa disponível. Adicione uma nova tarefa!
                        </Alert>
                      </Col>
                    </Row>
                  </Container>
                )}
              </div>
            )}
          </Container>
        </Col>
      </Row>
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header className="modal-content">
          <h2>Deseja mesmo apagar a lista?</h2>
        </Modal.Header>
        <Modal.Body>
          <p>Essa ação não pode ser desfeita.</p>
        </Modal.Body>
        <Modal.Body className="d-flex justify-content-between">
          <Button onClick={closeModal}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={() => {
              closeModal();
              handleDeleteList(selectedListId);
            }}
          >
            Apagar
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HomePage;
