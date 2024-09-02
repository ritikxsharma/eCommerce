import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { LinkContainer } from 'react-router-bootstrap'

const Product = ({product}) => {
  return (
    <LinkContainer to={`product/${product._id}`}>
        <Card className='my-3 p-3 rounded'>
        <Card.Img src={product.image} variant='top'></Card.Img>
        <Card.Body>
            <Card.Title as='div' className='product-title'>
                <strong>{product.name}</strong>
            </Card.Title>
            <Card.Text>
                <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
            </Card.Text>
            <Card.Text as='h3'>
                ${product.price}
            </Card.Text>
        </Card.Body>
    </Card>
    </LinkContainer>
  )
}

export default Product