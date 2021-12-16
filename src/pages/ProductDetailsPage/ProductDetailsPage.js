import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { AuthContext } from "../../context/auth.context";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

// Stripe import
import { loadStripe } from "@stripe/stripe-js";

const API_URL = process.env.REACT_APP_SERVER_URL;

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
  const [priceId, setPriceId] = useState("");
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { productId } = useParams();
  const { user } = useContext(AuthContext);

  const addToFavorites = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const userId = user._id;

      const getUserData = await axios.get(`${API_URL}/user/${userId}`, { headers: { Authorization: `Bearer ${authToken}` } });
      const theUser = getUserData.data;
      const theUserId = theUser._id;

      await axios.post(`${API_URL}/add-favorite/${product._id}`, { theUserId });
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromFavorites = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const userId = user._id;

      const getUserData = await axios.get(`${API_URL}/user/${userId}`, { headers: { Authorization: `Bearer ${authToken}` } });
      const theUser = getUserData.data;
      const theUserId = theUser._id;

      await axios.post(`${API_URL}/remove-favorite/${product._id}`, { theUserId });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        const thisProduct = response.data;
        setProduct(thisProduct);

        if (response.data.name === "The Birth of Venus") {
          setPriceId("price_1K6x52JXmfQvDPDYRaBP0MXg");
        } else if (response.data.name === "The Starry Night") {
          setPriceId("price_1K6x3DJXmfQvDPDYcFvGs815");
        } else if (response.data.name === "The Scream") {
          setPriceId("price_1K74DWJXmfQvDPDY2e3LRz2v");
        } else if (response.data.name === "The Last Supper") {
          setPriceId("price_1K74EvJXmfQvDPDYsovWlyjW");
        } else if (response.data.name === "Sunflowers") {
          setPriceId("price_1K74FwJXmfQvDPDY2aBNNJwC");
        } else if (response.data.name === "The Great Wave off Kanagawa") {
          setPriceId("price_1K74H8JXmfQvDPDYuGbVLt3X");
        } else if (response.data.name === "Mona Lisa") {
          setPriceId("price_1K74IiJXmfQvDPDYnL2mN0cW");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [productId, priceId]);

  const item = {
    price: priceId,
    quantity: 1,
  };

  const checkoutOptions = {
    lineItems: [item],
    mode: "payment",
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cancel`,
  };

  const redirectToCheckout = async () => {
    setIsLoading(true);

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);

    setIsLoading(false);
    if (error) setStripeError(error.message);
  };

  if (stripeError) alert(stripeError);

  return (
    <Container>
      <Row>
        <Col>
          <Link to={`/${productId}/edit`}>
            <Button variant='secondary'>Edit Product</Button>
          </Link>
        </Col>
        <Col xs={8}>
          {product && (
            <div className='product-details-container'>
              <h2> {product.name} </h2>
              <img className='product-details-img' src={product.productImageURL} alt='painting' />
              <p> {product.description} </p>
              <p> Price: {product.price}€ </p>

              <Button className='product-btn' variant='secondary' onClick={addToFavorites}>
                Add to favorites
              </Button>

              <Button className='product-btn' variant='secondary' onClick={removeFromFavorites}>
                Remove from favorites
              </Button>

              <Button className='product-btn' onClick={redirectToCheckout} variant='secondary'>
                {isLoading ? <Spinner animation='border' size='sm' role='status' /> : "Buy"}
              </Button>
            </div>
          )}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default ProductDetailsPage;
