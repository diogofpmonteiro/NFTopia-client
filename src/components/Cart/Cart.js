import axios from "axios";
import { useState, useEffect, useContext } from "react";

import { ThemeContext } from "./../../context/theme.context";
import { AuthContext } from "../../context/auth.context";

import ProductCard from "../../components/ProductCard/ProductCard";

const API_URL = "http://localhost:5005";

const Cart = ({ cartId }) => {
  const [productsInCart, setProductsInCart] = useState([]);

  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/api/cart/${cartId}`, { headers: { Authorization: `Bearer ${authToken}` } });

        setProductsInCart(response.data.products);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [cartId]);

  return (
    <div className='cart-section-profile'>
      {user && productsInCart.map((eachProduct) => <ProductCard key={eachProduct._id} eachProduct={eachProduct} />)}
    </div>
  );
};

export default Cart;
