import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import fileService from "../../services/file.service";

const API_URL = "http://localhost:5005";

const UploadProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productImageURL, setProductImageURL] = useState("");
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const handleName = (e) => setName(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);
  const handlePrice = (e) => setPrice(e.target.value);

  const handleFileUpload = async (e) => {
    try {
      const uploadData = new FormData();

      uploadData.append("imageURL", e.target.files[0]); // <-- Set the file in the form

      const response = await fileService.uploadImage(uploadData);

      setProductImageURL(response.data.secure_url);
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
      await axios.post(`${API_URL}/api/products/`, requestBody, { headers: { Authorization: `Bearer ${authToken}` } });

      // If the request is successful navigate to login page
      navigate("/user");
    } catch (error) {
      // If the request resolves with an error, set the error message in the state
      setErrorMessage("Something went wrong");
    }
  };

  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col></Col>

        <Col xs={6} className='centered-column'>
          <Form onSubmit={handleFormSubmit} style={{ marginBottom: "20vh" }}>
            <Form.Group className='mb-3'>
              <Form.Label>Product Name</Form.Label>
              <Form.Control type='text' placeholder='Enter product name' name='name' value={name} onChange={handleName} />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter product description'
                name='description'
                value={description}
                onChange={handleDescription}
              />
            </Form.Group>

            <Form.Group controlId='formFileSm' className='mb-3'>
              <Form.Label>Product Image</Form.Label>
              <Form.Control type='file' size='sm' onChange={handleFileUpload} />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Product Price</Form.Label>
              <Form.Control type='number' placeholder='Enter product price' name='price' value={price} onChange={handlePrice} />
            </Form.Group>

            <Button variant='secondary' type='submit'>
              Create Product
            </Button>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
          </Form>
        </Col>

        <Col></Col>
      </Row>
    </Container>

    // <div>
    //   <h1>Upload a Product to your wallet</h1>
    //   <form onSubmit={handleFormSubmit}>
    //     <label>Name:</label>
    //     <input type='text' name='Name' value={name} onChange={handleName} />

    //     <label>description:</label>
    //     <input type='text' name='description' value={description} onChange={handleDescription} />

    //     <label>Product Image</label>
    //     <input type='file' name='imageURL' onChange={handleFileUpload} />

    //     <label>Price:</label>
    //     <input type='number' name='price' value={price} onChange={handlePrice} />

    //     <button type='submit'>Create Product</button>
    //   </form>
    //   {errorMessage && <p className='error-message'>{errorMessage}</p>}
    // </div>
  );
};

export default UploadProduct;
