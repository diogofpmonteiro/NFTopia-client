import axios from "axios";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import { AuthContext } from "../../context/auth.context";

const API_URL = process.env.REACT_APP_SERVER_URL;

const LoginPage = ({ theme }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { logInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = async (e) => {
    try {
      e.preventDefault();
      const requestBody = { username, password };

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(`${API_URL}/auth/login`, requestBody, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const token = response.data.authToken;
      logInUser(token);

      navigate("/");
    } catch (error) {
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <Container>
      <Row>
        <Col></Col>

        <Col xs={6} className='login-form'>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className='mb-3'>
              <FloatingLabel controlId='floatingInput' label='Username' className={`mb-3 form-input-title-${theme}`}>
                <Form.Control type='text' placeholder='Enter username' name='username' value={username} onChange={handleUsername} />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <FloatingLabel controlId='floatingPassword' label='Password' className={`mb-3 form-input-title-${theme}`}>
                <Form.Control type='password' placeholder='Password' name='password' value={password} onChange={handlePassword} />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicCheckbox'>
              <Form.Check type='checkbox' label='Remember me' />
            </Form.Group>
            <Button variant='secondary' type='submit'>
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
