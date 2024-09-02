import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Col, ListGroup, Row, Image, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Meta from '../components/Meta'

const ProductScreen = () => {
    const { id: productId } = useParams()
    const { userInfo } = useSelector((state) => state.auth)

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId)
    const [ createReview, { isLoading: loadingReviewCreate } ] = useCreateReviewMutation()
    
    const dispath = useDispatch()
    const navigate = useNavigate()

    const addToCartHandler = () => {
        dispath(addToCart({...product, qty}))
        navigate('/cart')
    }

    const submitHandler = async(e) => {
        e.preventDefault()
        try {
            const res = await createReview({ productId, rating, comment }).unwrap()
            refetch()
            toast.success(res.message)
            setRating(0)
            setComment('')
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }


  return (
    <>
        <Link className='btn btn-light my-3' to='/'>
            go back
        </Link>

        {
            isLoading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>{ error?.data?.message || error.error }</Message>
            ) : (
                <>
                    <Meta title={product.name}/>
                    <Row>
                        <Col md={5}>
                            <Image src={product.image} fluid></Image>
                        </Col>
                        <Col md={4}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={product.numReviews} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price: </Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status: </Col>
                                            <Col>
                                                <strong>{product.countInStock > 0 ? 'InStock' : 'Out of stock'}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    { product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control
                                                        as='select'
                                                        value={qty}
                                                        onChange={(e) => setQty(Number(e.target.value))}
                                                    >
                                                        {[...Array(product.countInStock).keys()].map((x) => (
                                                            <option key={x+1} value={x+1}>
                                                                {x+1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ) }

                                    <ListGroup.Item>
                                        <Button
                                            className='btn-block'
                                            type='button'
                                            disabled={product.countInStock === 0}
                                            onClick={addToCartHandler}
                                        >
                                            Add to cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>

                    <Row className='review'>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            { product.reviews.length === 0 && <Message>No reviews</Message> }
                            <ListGroup variant='flush'>
                                {
                                    product.reviews.map((review) =>(
                                        <ListGroup.Item key={review._id}>
                                            <strong>{review.name}</strong>
                                            <Rating value={review.rating}/>
                                            <p>{review.createdAt.substring(0, 10)}</p>
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))
                                }
                                <ListGroup.Item>
                                    <h2>Write a review</h2>
                                    { loadingReviewCreate && <Loader/> }
                                    { userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating' className='my-2'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">1 - Poor</option>
                                                    <option value="2">2 - Fair</option>
                                                    <option value="3">3 - Average</option>
                                                    <option value="4">4 - Good</option>
                                                    <option value="5">5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment' className='my-2'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    rows='3'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                >
                                                </Form.Control>
                                            </Form.Group>
                                            <Button
                                                disabled={loadingReviewCreate}
                                                type='submit'
                                                variant='primary'
                                            >Add Review</Button>
                                        </Form>
                                    ) : (
                                        <strong>Please login to write a review</strong>
                                    ) }
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )
        }
    </>
  )
}

export default ProductScreen