import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { LinkContainer } from 'react-router-bootstrap'

const Product = ({product}) => {
  return (
    <LinkContainer to={`/product/${product._id}`}>
        <Card className='my-3 p-3 rounded'>
        <div className='overflow-hidden d-flex align-items-center justify-content-center' style={{ height: '250px', width: '100%' }}>
            <Card.Img 
                src={product.image} 
                variant='top' 
                className='img-fluid' 
                style={{ objectFit: 'contain', height: '100%', width: '100%' }}
            />
        </div>
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