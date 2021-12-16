import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import fileService from "../../services/file.service";

const API_URL = process.env.REACT_APP_SERVER_URL;

const SignupPage = ({ theme }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleFileUpload = async (e) => {
    try {
      setIsLoading(true);
      const uploadData = new FormData();
      uploadData.append("imageURL", e.target.files[0]);
      const response = await fileService.uploadImage(uploadData);
      setProfilePictureURL(response.data.secure_url);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage("Failed to upload the file");
    }
  };

  const handleSignupSubmit = async (e) => {
    try {
      e.preventDefault();
      const requestBody = { username, password, profilePictureURL };

      const authToken = localStorage.getItem("authToken");
      await axios.post(`${API_URL}/auth/signup`, requestBody, { headers: { Authorization: `Bearer ${authToken}` } });

      navigate("/login");
    } catch (error) {
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <Container>
      <Row>
        <Col></Col>

        <Col xs={6} className='signup-form'>
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group className='mb-3'>
              <FloatingLabel controlId='floatingInput' label='Username' className={`mb-3 form-input-title-${theme}`}>
                <Form.Control type='text' placeholder='Enter username' name='username' value={username} onChange={handleUsername} />
              </FloatingLabel>
            </Form.Group>

            <Form.Group controlId='formBasicPassword' className={`mb-3 form-input-title-${theme}`}>
              <FloatingLabel controlId='floatingPassword' label='Password'>
                <Form.Control type='password' placeholder='Password' name='password' value={password} onChange={handlePassword} />
              </FloatingLabel>
              <Form.Text className={`text-muted form-input-title-${theme}`} muted>
                (Capital letter, number, symbol, min. 6 characters)
              </Form.Text>
            </Form.Group>

            <Form.Group controlId='formFileSm' className='mb-3'>
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type='file' size='sm' onChange={handleFileUpload} />
            </Form.Group>

            <Button variant='secondary' type='submit' disabled={isLoading}>
              {isLoading ? <Spinner animation='border' size='sm' role='status' /> : "Sign-up"}
            </Button>
          </Form>
          {errorMessage && <p className='error-message'>{errorMessage}</p>}
          <p className='sign-up-link'>
            Already have an account?<Link to={"/login"}> Login</Link>
          </p>
        </Col>

        <Col></Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
