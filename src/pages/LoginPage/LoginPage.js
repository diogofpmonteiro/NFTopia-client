import axios from "axios";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { AuthContext } from "../../context/auth.context";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  // Get the function for saving and verifying the token
  const { logInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = async (e) => {
    try {
      e.preventDefault();
      const requestBody = { username, password };

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post("http://localhost:5005/auth/login", requestBody, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Save the token and set the user as logged in ...
      const token = response.data.authToken;
      logInUser(token);

      navigate("/");
    } catch (error) {
      // If the request resolves with an error, set the error message in the state
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <Container>
      <Row>
        <Col></Col>

        <Col xs={6}>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control type='text' placeholder='Enter username' name='username' value={username} onChange={handleUsername} />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Password' name='password' value={password} onChange={handlePassword} />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicCheckbox'>
              <Form.Check type='checkbox' label='Remember me' />
            </Form.Group>
            <Button variant='primary' type='submit'>
              Login
            </Button>
          </Form>
          {errorMessage && <p className='error-message'>{errorMessage}</p>}
          <p className='sign-up-link'>
            Don't have an account yet?
            <Link to={"/signup"}> Sign Up</Link>
          </p>
        </Col>

        <Col></Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
