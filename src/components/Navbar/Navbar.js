import axios from "axios";
import { useState, useEffect, useContext } from "react";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import FormControl from "react-bootstrap/FormControl";

import { AuthContext } from "../../context/auth.context";
import { ThemeContext } from "./../../context/theme.context";

const API_URL = "http://localhost:5005";

const Header = () => {
  // Get the value from the context
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");

  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/api/user`, { headers: { Authorization: `Bearer ${authToken}` } });

        const thisUser = response.data;
        setUsername(thisUser.username);
        setProfilePictureURL(thisUser.profilePictureURL);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  return (
    <Navbar bg={theme} className='custom-nav' expand={false}>
      <Container fluid>
        <Navbar.Brand href='/'>
          <img className='logo-img' src={`/images/Logo_Art4Everyone_${theme}.png`} alt='logo' />
        </Navbar.Brand>

        <Button variant={theme === "light" ? "outline-dark" : "outline-light"} onClick={toggleTheme}>
          {theme === "light" ? "dark 🌜" : "light 🟡"}
        </Button>

        {!isLoggedIn && !user && (
          <>
            <Navbar.Toggle></Navbar.Toggle>
            <Navbar.Offcanvas id='offcanvasNavbar' aria-labelledby='offcanvasNavbarLabel' placement='end'>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id='offcanvasNavbarLabel'>Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className='justify-content-end flex-grow-1 pe-3'>
                  <Nav.Link href='/login'>Login</Nav.Link>
                  <Nav.Link href='/signup'>Sign-up</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </>
        )}

        {isLoggedIn && user && (
          <>
            {/* SEARCH BAR */}
            {/* <div> 
              <Form className='d-flex'>
                <FormControl type='search' placeholder='Search' className='me-2' aria-label='Search' />
                <Button variant='outline-dark'>Search</Button>
              </Form>
            </div> */}
            <div>
              <span className={`nav-username-${theme}`}>{username}</span>
              <Navbar.Toggle>
                <img className='profile-img' src={profilePictureURL} alt='profile' />
              </Navbar.Toggle>
            </div>
            <Navbar.Offcanvas id='offcanvasNavbar' aria-labelledby='offcanvasNavbarLabel' placement='end'>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id='offcanvasNavbarLabel'>Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className='justify-content-end flex-grow-1 pe-3'>
                  <Nav.Link href='/user'>My profile</Nav.Link>
                  {/* ADMIN FEATURE! */}
                  <Nav.Link href='/products/new/'>Create a product</Nav.Link>
                  <Nav.Link onClick={logOutUser}>Log Out</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
