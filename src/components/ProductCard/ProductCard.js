import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { ThemeContext } from "./../../context/theme.context";
import { useContext } from "react";

const ProductCard = ({ eachProduct }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Card className={`card-${theme}`}>
      <Card.Img variant='top' src={eachProduct.productImageURL} />
      <Card.Body>
        <Card.Title>{eachProduct.name}</Card.Title>
        <Card.Text>{eachProduct.description}</Card.Text>
        <Link to={`/${eachProduct._id}`}>
          <Button variant='secondary'>More Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
