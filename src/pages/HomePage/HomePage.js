import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const API_URL = "http://localhost:5005";
const mainPageImage = "/images/Everydays-Beeple.jpeg";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/api/products`);
      const allProducts = response.data;
      setProducts(allProducts);
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <section className='landing-section'>
            <div className='left-box'>
              <h2>Welcome to Art4Everyone Marketplace</h2>
              <p>The best mock art marketplace out there.</p>
              <a href='#all-products'>Explore </a>
            </div>
            <div>
              <img src={mainPageImage} alt='pic' className='main-img' />
            </div>
          </section>

          <hr />
          <h2 className='section-title'>Recently Listed Products</h2>
          <section className='recently-listed-section'>
            {/* NEEDS TO BE SORTED BY TIMESTAMP */}
            {products.map((eachProduct) => (
              <ProductCard eachProduct={eachProduct} key={eachProduct._id} />
            ))}
          </section>

          <hr />
          <h2 id='all-products' className='section-title'>
            All Products
          </h2>
          <section className='all-products-section'>
            {products.map((eachProduct) => (
              <ProductCard eachProduct={eachProduct} key={eachProduct._id} />
            ))}
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
