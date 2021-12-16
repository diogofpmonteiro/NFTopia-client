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

  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { productId } = useParams();

  const { user } = useContext(AuthContext);

  // let item;

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        const thisProduct = response.data;

        setProduct(thisProduct);

        // if (response.data.name === "The Birth of Venus") {
        //   item = {
        //     price: "price_1K6x52JXmfQvDPDYRaBP0MXg",
        //     quantity: 1,
        //   };
        // } else if (response.data.name === "The Starry Night") {
        //   item = {
        //     price: "price_1K6x3DJXmfQvDPDYcFvGs815",
        //     quantity: 1,
        //   };
        // } else if (response.data.name === "The Scream") {
        //   item = {
        //     price: "price_1K74DWJXmfQvDPDY2e3LRz2v",
        //     quantity: 1,
        //   };
        // } else if (response.data.name === "The Last Supper") {
        //   item = {
        //     price: "price_1K74EvJXmfQvDPDYsovWlyjW",
        //     quantity: 1,
        //   };
        // } else if (response.data.name === "Sunflowers") {
        //   item = {
        //     price: "price_1K74FwJXmfQvDPDY2aBNNJwC",
        //     quantity: 1,
        //   };
        // } else if (response.data.name === "The Great Wave off Kanagawa") {
        //   item = {
        //     price: "price_1K74H8JXmfQvDPDYuGbVLt3X",
        //     quantity: 1,
        //   };
        // } else if (response.data.name === "Mona Lisa") {
        //   item = {
        //     price: "price_1K74IiJXmfQvDPDYnL2mN0cW",
        //     quantity: 1,
        //   };
        // }
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [productId]);

  const addToCart = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const userId = user._id;

      const getUserData = await axios.get(`${API_URL}/user/${userId}`, { headers: { Authorization: `Bearer ${authToken}` } });
      const theUser = getUserData.data;

      if (!theUser.cart) {
        await axios.post(`${API_URL}/api/cart`, { userId }, { headers: { Authorization: `Bearer ${authToken}` } });
      }

      await axios.put(`${API_URL}/api/cart/${productId}`, { userId }, { headers: { Authorization: `Bearer ${authToken}` } });
    } catch (error) {
      console.log(error);
    }
  };

  // ! WORKING STATIC VERSION
  const item = {
    price: "price_1K74FwJXmfQvDPDY2aBNNJwC",
    quantity: 1,
  };

  // const connectProductToCheckout = async () => {
  //   try {
  //     if (product.name === "The Birth of Venus") {
  //       item = {
  //         price: "price_1K6x52JXmfQvDPDYRaBP0MXg",
  //         quantity: 1,
  //       };
  //     } else if (product.name === "The Starry Night") {
  //       item = {
  //         price: "price_1K6x3DJXmfQvDPDYcFvGs815",
  //         quantity: 1,
  //       };
  //     } else if (product.name === "The Scream") {
  //       item = {
  //         price: "price_1K74DWJXmfQvDPDY2e3LRz2v",
  //         quantity: 1,
  //       };
  //     } else if (product.name === "The Last Supper") {
  //       item = {
  //         price: "price_1K74EvJXmfQvDPDYsovWlyjW",
  //         quantity: 1,
  //       };
  //     } else if (product.name === "Sunflowers") {
  //       item = {
  //         price: "price_1K74FwJXmfQvDPDY2aBNNJwC",
  //         quantity: 1,
  //       };
  //     } else if (product.name === "The Great Wave off Kanagawa") {
  //       item = {
  //         price: "price_1K74H8JXmfQvDPDYuGbVLt3X",
  //         quantity: 1,
  //       };
  //     } else if (product.name === "Mona Lisa") {
  //       item = {
  //         price: "price_1K74IiJXmfQvDPDYnL2mN0cW",
  //         quantity: 1,
  //       };
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // setInterval(() => {
  //   connectProductToCheckout();
  // }, 3000);

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

              <Button className='product-btn' variant='secondary' onClick={addToCart}>
                Add to favorites
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
