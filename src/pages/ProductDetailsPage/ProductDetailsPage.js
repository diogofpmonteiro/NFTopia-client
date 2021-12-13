import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5005";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);

  const { productId } = useParams();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        const thisProduct = response.data;

        setProduct(thisProduct);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [productId]);

  return (
    <div>
      <h2>Product Details</h2>
      <p> {product.name} </p>
    </div>
  );
};

export default ProductDetailsPage;
