import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";

import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

const API_URL = "http://localhost:5005";

const Header = () => {
  // Get the value from the context
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");

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
    //   <>
    //     {isLoggedIn && user && (
    //       <Link to='/user'>
    //         <img className='profile-img' src={user.profilePictureURL} alt='profile' />
    //       </Link>
    //     )}
    //   </>
    // </nav>

    <Navbar bg='light' expand={false}>
      <Container fluid>
        <Navbar.Brand href='/'>
          <img className='logo-img' src='/images/Logo_Art4Everyone_light.png' alt='logo' />
        </Navbar.Brand>

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
            <div>
              <span className='nav-username-light'>{username}</span>
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
