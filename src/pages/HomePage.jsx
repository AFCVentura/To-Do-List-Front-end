import React, { useState, useEffect } from "react";
import VectorImage from "../assets/register.svg";
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
  Image,
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

  const [errorCreateList, setErrorCreateList] = useState("");
  const [errorCreateItem, setErrorCreateItem] = useState("");
  const [errorNotLoadedItem, setErrorNotLoadedItem] = useState("");
  const [errorNotLoadedList, setErrorNotLoadedList] = useState("");

  const token = sessionStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setErrorNotLoadedList("");
      const response = await axios.get(
        "http://3.80.53.161:8080/api/list/all",
        axiosConfig
      );
      setLists(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar listas:", error);
      error
        ? setErrorNotLoadedList(error.message)
        : setErrorNotLoadedItem("Erro ao buscar listas");
    }
  };

  const handleCreateList = async (e) => {
    try {
      e.preventDefault();
      setErrorCreateList("");
      const response = await axios.post(
        "http://3.80.53.161:8080/api/list",
        { name: listName, user: null },
        axiosConfig
      );
      setLists([...lists, response.data]);
      setListName("");
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      error
        ? setErrorCreateList(error.response.data)
        : setErrorCreateList("Erro ao criar lista");
    }
  };

  const handleSelectList = async (id, name) => {
    setCurrentListId(id);
    setCurrentListName(name);

    setErrorNotLoadedItem("");

    try {
      const response = await axios.get(
        `http://3.80.53.161:8080/api/item/${id}`,
        axiosConfig
      );
      setItems(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setErrorNotLoadedItem("Erro ao buscar tarefas");
    }
  };

  const handleDeleteList = async (id) => {
    if (!id) {
      return;
    }
    try {
      await axios.delete(`http://3.80.53.161:8080/api/list/${id}`, axiosConfig);
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
        "http://3.80.53.161:8080/api/item",
        {
          description: itemDescription,
          state: false,
          listEntity: { id: currentListId },
        },
        axiosConfig
      );
      setErrorCreateItem("");
      setItems([...items, response.data]);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      error
        ? setErrorCreateItem(error.response.data)
        : setErrorCreateItem("Erro ao criar item");
    } finally {
      setItemDescription("");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://3.80.53.161:8080/api/item/${id}`, axiosConfig);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleToggleItemStatus = async (id, currentState) => {
    try {
      await axios.patch(
        `http://3.80.53.161:8080/api/item/${id}`,
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
    setErrorCreateList("");
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
        `http://3.80.53.161:8080/api/item/${id}`,
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
        `http://3.80.53.161:8080/api/list/${id}`,
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
    <Container fluid="true" className="vh-100 w-100 p-0 m-0">
      <Row className="p-0 m-0 d-flex flex-md-row flex-column">
        <Col md="4" xs="12" className="p-0">
          <Container
            fluid="true"
            className="bg-primary text-light p-0"
            id="Sidebar"
          >
            <Row className="justify-content-center pt-4 m-0">
              <Col
                xs="10"
                className="d-flex gap-3 justify-content-center justify-content-md-start"
              >
                {/* CONFIGURAÇÕES */}
                <Button
                  onClick={handleConfigClick}
                  className="fs-2 p-0 d-flex gap-3 px-3 text-break"
                >
                  <div className="h-100 d-flex align-items-center">
                    <i className="bi bi-gear-fill"></i>
                  </div>
                  Configurações
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-center pt-4 m-0">
              <Col
                xs="10"
                className="d-flex gap-3 justify-content-center justify-content-md-start"
              >
                {/* BOTÃO ADICIONAR LISTA */}
                <Button
                  className="fs-2 p-0 d-flex gap-3 px-3 text-break"
                  onClick={() => {
                    handleWantToAddList();
                    setListName("");
                  }}
                >
                  {" "}
                  {wantToAddList ? (
                    <div className="h-100 d-flex align-items-center">
                      <i className="bi bi-dash-circle"></i>
                    </div>
                  ) : (
                    <div className="h-100 d-flex align-items-center">
                      <i className="bi bi-plus-circle"></i>
                    </div>
                  )}
                  Adicionar Lista
                </Button>
              </Col>
            </Row>
            {/* INPUT ADICIONAR LISTA */}
            {wantToAddList && (
              <Row className="pt-4 m-0">
                <Col xs={{ span: 10, offset: 1 }} md={{ span: 10, offset: 1 }}>
                  <Form onSubmit={handleCreateList} className="w-100">
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Criar nova lista"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                    />
                    {errorCreateList && (
                      <Alert variant="primary" className="mt-1">
                        {errorCreateList}
                      </Alert>
                    )}
                  </Form>
                </Col>
              </Row>
            )}
            {/* LISTAS */}
            <Row className="pt-4 d-flex gap-3 justify-content-center justify-content-md-start m-0">
              <Col xs={{ span: 10, offset: 1 }}>
                <table className="w-100 table-primary table-hover">
                  <tbody>
                    {errorNotLoadedList ? (
                      <h2 className="text-danger">{errorNotLoadedList}</h2>
                    ) : (
                      lists.map((list) => (
                        <tr
                          key={list.id}
                          onClick={() => handleSelectList(list.id, list.name)}
                        >
                          <td className="pb-3">
                            <Button className="w-100 d-flex justify-content-between align-items-center">
                              <p className="fs-4 bg-transparent text-light m-0 text-break text-start">
                                {list.name}
                              </p>
                              <div className="bg-transparent d-flex align-items-center justify-content-center flex-column">
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
                      ))
                    )}
                  </tbody>
                </table>
              </Col>
            </Row>
          </Container>
        </Col>
        <Col md="8" xs="12" className="p-0">
          <Container fluid="true" className="vh-100 p-0 ps-md-5">
            {currentListId ? (
              <div className="pt-4">
                {/* LISTA ABERTA */}
                <Container fluid="true" className="mb-4">
                  <Form
                    className="h-100"
                    onSubmit={(e) => {
                      handleEditList(e, currentListId, newListName);
                    }}
                  >
                    <Row className="px-3 px-md-0 pe-md-3 m-0">
                      <Col
                        xs="12"
                        md="4"
                        className=" d-flex align-items-center mb-3 mb-md-0"
                      >
                        <h2 className="text-primary mb-0 text-break">
                          {currentListName}
                        </h2>
                      </Col>
                      <Col xs="7" md="6" className="p-0">
                        {isEditingListName && (
                          <Form.Control
                            type="text"
                            placeholder="Novo nome da lista"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className=""
                          />
                        )}
                      </Col>
                      <Col xs="5" md="2" className="p-0 ps-2">
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
                          className="w-100"
                        >
                          {isEditingListName && newListName
                            ? "Enviar"
                            : "Editar Lista"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Container>
                {/* ADICIONAR ITEM */}
                <Form onSubmit={handleCreateItem}>
                  <Container fluid="true">
                    <Row className="gap-2 gap-md-0 px-3 px-md-0 pe-md-3 m-0">
                      <Col xs="12" md="8" className="p-0">
                        <Form.Control
                          type="text"
                          placeholder="Adicionar nova tarefa"
                          value={itemDescription}
                          onChange={(e) => setItemDescription(e.target.value)}
                          style={{ boxSizing: "border-box" }}
                        />
                      </Col>
                      <Col xs="12" md="4" className="p-0 ps-md-2">
                        <Button type="submit" className="w-100">
                          Adicionar Tarefa
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </Form>
                {errorCreateItem && (
                  <Container fluid="true">
                    <Row className="px-3 px-md-0 pe-md-3 m-0">
                      <Col xs="12" className="p-0">
                        <Alert variant="primary" className="mt-2 mb-1">
                          {errorCreateItem}
                        </Alert>
                      </Col>
                    </Row>
                  </Container>
                )}
                {items.length > 0 ? (
                  <Container fluid="true">
                    <Row className="px-3 px-md-0 pe-md-3 m-0">
                      <ListGroup className="mt-2 pe-0">
                        {items.map((item) => (
                          <ListGroup.Item
                            key={item.id}
                            className="d-flex justify-content-between "
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
                    </Row>
                  </Container>
                ) : (
                  <Container fluid="true">
                    <Row className="px-4 px-md-0 pe-md-3 m-0">
                      <Col xs="12" className="p-0">
                        <Alert variant="primary" className="mt-2 text-break">
                          Nenhuma tarefa disponível. Adicione uma nova tarefa!
                        </Alert>
                      </Col>
                    </Row>
                  </Container>
                )}
              </div>
            ) : (
              <Row className="h-100 m-0">
                <Col className="d-flex flex-column align-items-center justify-content-center h-100">
                  <Image
                    src={VectorImage}
                    fluid="true"
                    style={{ maxHeight: "50%" }}
                    alt="image"
                  />
                  <h1 className="text-primary text-center">Selecione uma opção ao lado</h1>
                </Col>
              </Row>
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
