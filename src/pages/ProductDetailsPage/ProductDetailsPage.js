import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { ThemeContext } from "./../../context/theme.context";
import { AuthContext } from "../../context/auth.context";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Stripe import
import { loadStripe } from "@stripe/stripe-js";

const API_URL = "http://localhost:5005";

// Stripe functionalities
let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
  }

  return stripePromise;
};

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setLoading] = useState(false);

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

  // Stripe functionalities
  const item = {
    price: "price_1K6x52JXmfQvDPDYRaBP0MXg",
    quantity: 1,
  };

  const checkoutOptions = {
    lineItems: [item],
    mode: "payment",
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cancel`,
  };

  const redirectToCheckout = async () => {
    setLoading(true);
    console.log("redirectToCheckout");

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe checkout error", error);

    if (error) setStripeError(error.message);
    setLoading(false);
  };

  if (stripeError) alert(stripeError);

  return (
    <Container>
      <Row>
        <Col></Col>
        <Col xs={8}>
          {product && (
            <div className='product-details-container'>
              <h2> {product.name} </h2>
              <img className='product-details-img' src={product.productImageURL} alt='painting' />
              <p> {product.description} </p>
              <p> Price: {product.price}€ </p>

              <Button className='product-btn' variant='secondary' onClick={addToCart}>
                Add to favorites
              </Button>

              <Button className='product-btn' onClick={redirectToCheckout} disabled={isLoading} variant='success'>
                {isLoading ? "Loading..." : "Buy"}
              </Button>
            </div>
          )}
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col>
          <Link to={`/${productId}/edit`}>
            <Button variant='secondary'>Edit Product</Button>
          </Link>
        </Col>
        <Col xs={8}>
          <Card border='danger' className={`danger-zone-${theme}`}>
            <Card.Header>Delete Account Zone</Card.Header>
            <Card.Body>
              <Card.Text>
                Be careful, this action will delete this product from the database. <br /> Click only if 100% sure.
              </Card.Text>
              <Button variant='danger' type='submit' onClick={deleteProduct}>
                Delete Product
              </Button>
            </Card.Body>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default ProductDetailsPage;
