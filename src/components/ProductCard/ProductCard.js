import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const ProductCard = ({ eachProduct }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant='top' src={eachProduct.productImageURL} />
      <Card.Body>
        <Card.Title>{eachProduct.name}</Card.Title>
        <Card.Text>{eachProduct.description}</Card.Text>
        <Link to={`/${eachProduct._id}`}>
          <Button variant='primary'>More Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;