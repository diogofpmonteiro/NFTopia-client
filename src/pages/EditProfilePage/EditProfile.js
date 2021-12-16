import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import fileService from "../../services/file.service";

const API_URL = process.env.REACT_APP_SERVER_URL;

const EditProfile = ({ theme }) => {
  const [username, setUsername] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/user`, { headers: { Authorization: `Bearer ${authToken}` } });

      setUsername(response.data.username);
    };
    fetchData();
  }, []);

  const handleUsername = async (e) => setUsername(e.target.value);

  const handleFileUpload = async (e) => {
    try {
      setIsLoading(true);
      const uploadData = new FormData();

      uploadData.append("imageURL", e.target.files[0]); // <-- Set the file in the form

      const response = await fileService.uploadImage(uploadData);
      setProfilePictureURL(response.data.secure_url);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage("Failed to upload the file");
    }
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      // Create an object representing the request body
      const requestBody = { username, profilePictureURL };

      const authToken = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/api/user`, requestBody, { headers: { Authorization: `Bearer ${authToken}` } });

      // If the request is successful navigate to login page
      navigate("/user");
    } catch (error) {
      // If the request resolves with an error, set the error message in the state
      setErrorMessage("Something went wrong");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Button onClick={goBack} variant='secondary'>
            Go back
          </Button>
        </Col>

        <Col xs={6} className='edit-profile-container'>
          <Form onSubmit={handleFormSubmit} style={{ marginBottom: "20vh" }}>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control type='text' placeholder='Enter username' name='username' value={username} onChange={handleUsername} />
            </Form.Group>

            <Form.Group controlId='formFileSm' className='mb-3'>
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type='file' size='sm' onChange={handleFileUpload} />
            </Form.Group>

            <Button variant='secondary' type='submit' disabled={isLoading}>
              {isLoading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : "Update Profile"}
            </Button>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
