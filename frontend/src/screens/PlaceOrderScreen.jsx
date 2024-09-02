import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'

const PlaceOrderScreen = () => {

    const cart = useSelector((state) => state.cart)
    const { shippingAddress, paymentMethod, cartItems } = cart 

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [createOrder, { isLoading, error }] = useCreateOrderMutation()

    useEffect(() => {
        if(!shippingAddress.address)    navigate('/shipping')
        else if(!paymentMethod) navigate('/payemnt')
    }, [shippingAddress.address, paymentMethod, navigate])

    const placeOrderHandler = async() => {
        try {
            console.log(cartItems);
            const res = await createOrder({
                orderItems: cartItems,
                shippingAddress: shippingAddress,
                paymentMethod: paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }).unwrap()
            dispatch(clearCartItems())
            navigate(`/order/${res._id}`)
        } catch (error) {
            toast.error(error)
        }
    }

  return (
    <>
        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment</h2>
                        <p>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cartItems.length === 0 ? (
                            <Message>Your cart is Empty</Message>
                        ) : (
                            <ListGroup variant='flush'>
                                {
                                    cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    ></Image>
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item._id}`}>
                                                        { item.name }
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    { item.qty } x ${ item.price } = ${ item.qty * item.price }
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items: </Col>
                                <Col>
                                    ${cart.itemsPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping: </Col>
                                <Col>
                                    ${cart.shippingPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax: </Col>
                                <Col>
                                    ${cart.taxPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total: </Col>
                                <Col>
                                    ${cart.totalPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            {
                                error && <Message variant='danger'>{error?.data?.message || error.error}</Message>
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cartItems.length === 0}
                                onClick={placeOrderHandler}
                            >
                                Pay and Place Order
                            </Button>

                            {
                                isLoading && <Loader/>
                            }

                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default PlaceOrderScreen