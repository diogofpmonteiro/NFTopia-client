import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import fileService from "../../services/file.service";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleFileUpload = async (e) => {
    try {
      const uploadData = new FormData();
      uploadData.append("imageURL", e.target.files[0]); // <-- Set the file in the form
      const response = await fileService.uploadImage(uploadData);
      setProfilePictureURL(response.data.secure_url);
    } catch (error) {
      setErrorMessage("Failed to upload the file");
    }
  };

  const handleSignupSubmit = async (e) => {
    try {
      e.preventDefault();
      // Create an object representing the request body
      const requestBody = { username, password, profilePictureURL };

      const authToken = localStorage.getItem("authToken");
      await axios.post("http://localhost:5005/auth/signup", requestBody, { headers: { Authorization: `Bearer ${authToken}` } });

      // If the request is successful navigate to login page
      navigate("/login");
    } catch (error) {
      // If the request resolves with an error, set the error message in the state
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
              <Form.Label>Username</Form.Label>
              <Form.Control type='text' placeholder='Enter username' name='username' value={username} onChange={handleUsername} />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Password' name='password' value={password} onChange={handlePassword} />
              <Form.Text className='text-muted'>Your password needs to have -- password requirements --.</Form.Text>
            </Form.Group>

            <Form.Group controlId='formFileSm' className='mb-3'>
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type='file' size='sm' onChange={handleFileUpload} />
            </Form.Group>

            <Button variant='secondary' type='submit'>
              Sign up
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
