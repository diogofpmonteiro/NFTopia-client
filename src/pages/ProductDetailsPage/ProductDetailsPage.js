import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { ThemeContext } from "./../../context/theme.context";
import { AuthContext } from "../../context/auth.context";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const API_URL = "http://localhost:5005";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { productId } = useParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        const thisProduct = response.data;

        setProduct(thisProduct);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [productId]);

  const deleteProduct = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/products/${productId}`, { headers: { Authorization: `Bearer ${authToken}` } });

      navigate("/");
    } catch (error) {
      setErrorMessage("Something went wrong!");
    }
  };

  const addToCart = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      const userId = user._id;

      // console.log(user);
      const respUser = await axios.get(`${API_URL}/user/${userId}`, { headers: { Authorization: `Bearer ${authToken}` } });
      console.log(respUser.data);

      const theUser = respUser.data;
      // console.log("the user id", theUser);

      if (!theUser.cart) {
        const response = await axios.post(`${API_URL}/api/cart`, { userId }, { headers: { Authorization: `Bearer ${authToken}` } });
        console.log(response.data);
      }

      const response = await axios.put(
        `${API_URL}/api/cart/${productId}`,
        { userId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {product && (
        <div className='product-details-container'>
          <h2>Name: {product.name} </h2>
          <img className='product-details-img' src={product.productImageURL} alt='' />
          <p> Description: {product.description} </p>
          <p> Price: {product.price} </p>

          <Button variant='secondary' onClick={addToCart} style={{ marginRight: "25px" }}>
            Add to cart
          </Button>

          <Link to={`/${product._id}/edit`}>
            <Button variant='secondary'>Edit Product</Button>
          </Link>

          <Card border='danger' className={`danger-zone-${theme}`}>
            <Card.Header>Delete Account Zone</Card.Header>
            <Card.Body>
              <Card.Text>
                Be careful, this action is very destructive. <br /> Click only if 100% sure.
              </Card.Text>
              <Button variant='danger' type='submit' onClick={deleteProduct}>
                Delete Product
              </Button>
            </Card.Body>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
          </Card>
        </div>
      )}
    </>
  );
};

export default ProductDetailsPage;
