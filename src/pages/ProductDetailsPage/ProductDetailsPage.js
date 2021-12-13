import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";

const API_URL = "http://localhost:5005";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);

  const { productId } = useParams();

  const getProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${productId}`);
      const thisProduct = response.data;

      setProduct(thisProduct);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      {product && (
        <div>
          <h2>Product Details</h2>
          <p> Name: {product.name} </p>
          <img className='product-details-img' src={product.productImageURL} alt='' />
          <p> Description: {product.description} </p>
          <p> Price: {product.price} </p>
          <Button variant='secondary'> Add to cart</Button>
        </div>
      )}
    </>
  );
};

export default ProductDetailsPage;
