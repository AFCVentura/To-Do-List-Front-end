import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Form, Row, Col, ListGroup, Alert } from "react-bootstrap";

const HomePage = () => {
    const [lists, setLists] = useState([]);
    const [listName, setListName] = useState('');
    const [currentListId, setCurrentListId] = useState(null);
    const [currentListName, setCurrentListName] = useState('');
    const [items, setItems] = useState([]);
    const [itemDescription, setItemDescription] = useState('');

    const token = sessionStorage.getItem("token");
    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/list/all', axiosConfig);
            setLists(response.data);
        } catch (error) {
            console.error("Erro ao buscar listas:", error);
        }
    };

    const handleCreateList = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/list',
                { name: listName, user: null },
                axiosConfig
            );
            setLists([...lists, response.data]);
            setListName('');
        } catch (error) {
            console.error("Erro ao criar lista:", error);
        }
    };

    const handleSelectList = async (id, name) => {
        setCurrentListId(id);
        setCurrentListName(name);
        try {
            const response = await axios.get(`http://localhost:8080/api/item/${id}`, axiosConfig);
            setItems(response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    const handleDeleteList = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/list/${id}`, axiosConfig);
            setLists(lists.filter(list => list.id !== id));
            if (currentListId === id) {
                setItems([]);
                setCurrentListId(null);
            }
        } catch (error) {
            console.error("Erro ao deletar lista:", error);
        }
    };

    const handleCreateItem = async () => {
        if (!currentListId) return;
        try {
            const response = await axios.post(
                'http://localhost:8080/api/item',
                { description: itemDescription, state: false, listEntity: { id: currentListId } },
                axiosConfig
            );
            setItems([...items, response.data]);
            setItemDescription('');
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/item/${id}`, axiosConfig);
            setItems(items.filter(item => item.id !== id));
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
            setItems(items.map(item => item.id === id ? { ...item, state: !currentState } : item));
        } catch (error) {
            console.error("Erro ao atualizar o status da tarefa:", error);
        }
    };



    return (
        <Container className="mt-4">
            <h1>ToDo List</h1>
            <Form>
                <Row>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Criar nova lista"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button onClick={handleCreateList}>Criar Lista</Button>
                    </Col>
                </Row>
            </Form>

            {lists.length > 0 ? (
                <ListGroup className="mt-4">
                    {lists.map(list => (
                        <ListGroup.Item key={list.id} onClick={() => handleSelectList(list.id, list.name)}>
                            {list.name}
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteList(list.id);
                                }}
                                className="ms-2"
                            >
                                Deletar
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <Alert variant="info" className="mt-4">
                    Nenhuma lista disponível. Crie uma nova lista!
                </Alert>
            )}

            {currentListId && (
                <div className="mt-4">
                    <h3>Tarefas da Lista: {currentListName}</h3>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Adicionar nova tarefa"
                                    value={itemDescription}
                                    onChange={(e) => setItemDescription(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Button onClick={handleCreateItem}>Adicionar Tarefa</Button>
                            </Col>
                        </Row>
                    </Form>

                    {items.length > 0 ? (
                        <ListGroup className="mt-2">
                            {items.map(item => (
                                <ListGroup.Item key={item.id}>
                                    <Form.Check
                                        type="checkbox"
                                        label={<span style={{ textDecoration: item.state ? 'line-through' : 'none' }}>{item.description}</span>}
                                        checked={item.state}
                                        onChange={() => handleToggleItemStatus(item.id, item.state)}
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
                        <Alert variant="info" className="mt-2">
                            Nenhuma tarefa disponível. Adicione uma nova tarefa!
                        </Alert>
                    )}
                </div>
            )}
        </Container>
    );
};

export default HomePage;

