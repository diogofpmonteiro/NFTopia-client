import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./../../context/theme.context";

import ProductCard from "./../../components/ProductCard/ProductCard";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const API_URL = "http://localhost:5005";
const mainPageImage = "/images/main-img.jpeg";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const { theme } = useContext(ThemeContext);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/api/products`);
      const allProducts = response.data;
      setProducts(allProducts);
    };
    fetchData();
  }, []);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <section className='landing-section'>
              <div className='left-box'>
                <h2>Welcome to Art4Everyone Marketplace</h2>
                <p>The best mock art marketplace out there.</p>
                <Button href='#all-products' variant='secondary' style={{ width: "25vw" }}>
                  Explore
                </Button>
              </div>
              <div>
                <img src={mainPageImage} alt='pic' className='main-img' />
              </div>
            </section>
          </Col>
        </Row>
      </Container>

      <div className={`main-container-${theme}`}>
        <h2 className='section-title recently-listed-title '>
          <hr />
          Recently Listed Products
        </h2>
        <section className='recently-listed-section'>
          {/* NEEDS TO BE SORTED BY TIMESTAMP */}
          {products.map((eachProduct) => (
            <div className='recently-listed-cards'>
              <ProductCard eachProduct={eachProduct} key={eachProduct._id} />
            </div>
          ))}
        </section>
      </div>

      <Container className={`main-container-${theme}`}>
        <Row>
          <Col>
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

      <Button onClick={scrollToTop} variant='secondary'>
        Top
      </Button>
    </>
  );
};

export default HomePage;
