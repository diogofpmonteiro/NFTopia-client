import axios from "axios";
import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../context/auth.context";

import ProductCard from "../ProductCard/ProductCard";

const API_URL = process.env.REACT_APP_SERVER_URL;

const Favorites = ({ favoritesId }) => {
  const [productsInFavorites, setProductsInFavorites] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsInFavorites(user.favoriteProducts);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='favorites-section-profile'>
      {user && productsInFavorites.map((eachProduct) => <ProductCard key={eachProduct._id} eachProduct={eachProduct} />)}
    </div>
  );
};

export default Favorites;
