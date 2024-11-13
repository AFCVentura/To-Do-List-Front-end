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
  const [isEditingItemName, setIsEditingItemName] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [newListName, setNewListName] = useState("");

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

  const openEditItemModal = (id) => {
    setIsEditingItemName(true);
    setSelectedItemId(id);
  };

  const closeEditItemModal = () => {
    setIsEditingItemName(false);
  };

  const handleEditItem = async (e, id, newDescription) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8080/api/item/${id}`,
        { description: newDescription },
        axiosConfig
      );
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, description: newDescription } : item
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o nome da tarefa:", error);
    } finally {
      closeEditItemModal();
    }
  };

  const handleEditList = async (e, id, newListName) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8080/api/list/${id}`,
        { name: newListName },
        axiosConfig
      );
      setListName(newListName);
      setCurrentListName(newListName);
      setLists(
        lists.map((list) =>
          list.id === id ? { ...list, name: newListName } : list
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o nome da lista:", error);
    } finally {
      setNewListName("");
      setIsEditingListName(!isEditingListName);
    }
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
                {/* LISTA ABERTA */}
                <Container fluid="true" className="mb-4">
                  <Form
                    className="h-100"
                    onSubmit={(e) => {
                      handleEditList(e, currentListId, newListName);
                    }}
                  >
                    <Row className="w-100">
                      <Col xs="4">
                        <h1 className="text-primary mb-0">{currentListName}</h1>
                      </Col>
                      <Col xs="6" className="p-0">
                        {isEditingListName && (
                          <Form.Control
                            type="text"
                            placeholder="Novo nome da lista"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="h-100"
                          />
                        )}
                      </Col>
                      <Col xs="2">
                        <Button
                          type={
                            isEditingListName && newListName
                              ? "submit"
                              : "button"
                          }
                          variant="info"
                          onClick={() => {
                            (isEditingListName && newListName) ||
                              setIsEditingListName(!isEditingListName);
                          }}
                          className="h-100 w-100"
                        >
                          {isEditingListName && newListName
                            ? "Enviar"
                            : "Editar Lista"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Container>
                {/* ADICIONAR LISTA */}
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
                        <Button type="submit" className="w-100">
                          Adicionar Tarefa
                        </Button>
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
                        <div className="d-flex gap-2">
                          <Button
                            title="Editar"
                            variant="info"
                            size="sm"
                            onClick={() => openEditItemModal(item.id)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Button>
                          <Button
                            title="Excluir"
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </Button>
                        </div>
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

      {/* EDITAR ITEM */}
      <Modal show={isEditingItemName} onHide={closeEditItemModal}>
        <Modal.Header className="modal-content">
          <h2>Digite o novo nome para a tarefa</h2>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              handleEditItem(e, selectedItemId, newItemName);
            }}
          >
            <Form.Control
              type="text"
              placeholder="Digite o novo nome da tarefa"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <div className="d-flex justify-content-between mt-2">
              <Button onClick={closeEditItemModal}>Cancelar</Button>
              <Button variant="info" type="submit">
                Atualizar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HomePage;
