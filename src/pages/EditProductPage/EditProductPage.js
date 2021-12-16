import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import fileService from "../../services/file.service";

import { ThemeContext } from "./../../context/theme.context";

const API_URL = "http://localhost:5005";

const EditProductPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productImageURL, setProductImageURL] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { productId } = useParams();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/products/${productId}`, { headers: { Authorization: `Bearer ${authToken}` } });

      setName(response.data.name);
      setDescription(response.data.description);
      setPrice(response.data.price);
    };
    fetchData();
  }, [productId]);

  const handleName = async (e) => setName(e.target.value);
  const handleDescription = async (e) => setDescription(e.target.value);
  const handlePrice = async (e) => setPrice(e.target.value);

  const handleFileUpload = async (e) => {
    try {
      setIsLoading(true);
      const uploadData = new FormData();

      uploadData.append("imageURL", e.target.files[0]); // <-- Set the file in the form

      const response = await fileService.uploadImage(uploadData);
      setProductImageURL(response.data.secure_url);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage("Failed to upload the file");
    }
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      // Create an object representing the request body
      const requestBody = { name, description, productImageURL, price };

      const authToken = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/api/products/${productId}`, requestBody, { headers: { Authorization: `Bearer ${authToken}` } });

      // If the request is successful navigate to login page
      navigate(`/${productId}`);
    } catch (error) {
      // If the request resolves with an error, set the error message in the state
      setErrorMessage("Something went wrong");
    }
  };

  const deleteProduct = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/products/${productId}`, { headers: { Authorization: `Bearer ${authToken}` } });

      navigate("/");
    } catch (error) {
      setErrorMessage("Something went wrong!");
    }
  };

  return (
    <Container>
      <Row>
        <Col></Col>

        <Col xs={6} className='edit-product-column'>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' name='name' value={name} onChange={handleName} />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control type='text' name='description' value={description} onChange={handleDescription} />
            </Form.Group>

            <Form.Group controlId='formFileSm' className='mb-3'>
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type='file' size='sm' onChange={handleFileUpload} />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Price</Form.Label>
              <Form.Control type='number' name='name' value={price} onChange={handlePrice} />
            </Form.Group>

            <Button variant='secondary' type='submit' disabled={isLoading}>
              {isLoading ? <Spinner animation='border' size='sm' role='status' /> : "Update Product"}
            </Button>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
          </Form>
        </Col>

        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col xs={6}>
          <Card border='danger' className={`danger-zone-${theme}`}>
            <Card.Body>
              <Card.Text>This action will delete the product from the database.</Card.Text>
              <Button variant='danger' type='submit' onClick={deleteProduct}>
                Delete Product
              </Button>
            </Card.Body>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default EditProductPage;
