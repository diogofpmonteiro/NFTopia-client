import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link } from "react-router-dom";

import Cart from "./../../components/Cart/Cart";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// import ProductCard from "../../components/ProductCard/ProductCard";

const API_URL = "http://localhost:5005";

const ProfilePage = () => {
  const { logOutUser } = useContext(AuthContext);
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
  }, []);

  return (
    <Container>
      <Row>
        <Col></Col>
        <Col xs={8}>
          <div className='profile-top'>
            <img src={profilePictureURL} alt='pfp' className='profile-pic' />
            {username}
          </div>
        </Col>
        <Col>
          <div className='profile-right'>
            <Link to={`/user/edit/`}>
              <Button style={{ marginBottom: "10px" }} variant='secondary'>
                Edit Profile
              </Button>
            </Link>
            <br />
            <Button onClick={logOutUser} variant='secondary'>
              Logout
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col xs={5}>
          <div className='profile-bottom'>
            <Cart />
          </div>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
