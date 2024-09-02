import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from '../slices/ordersApiSlice'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const OrderScreen = () => {

  const { id: orderId } = useParams()
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)

  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()

  const [{isPending}, payPalDispatch] = usePayPalScriptReducer()

  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery()

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if(!errorPayPal && !loadingPayPal && paypal.clientId){
      const loadPayPalScript = async() => {
        payPalDispatch({
          type: 'resetOptions',
          value: {
            'clientId': paypal.clientId,
            currency: 'USD'
          }
        })
        payPalDispatch({type: 'setLoadingStatus', value: 'pending'})
      }
      if(order && !order.isPaid){
        // if(!window.paypal){
        //   loadPayPalScript()
        // }
        loadPayPalScript()
      }
    }
  }, [order, paypal, payPalDispatch, loadingPayPal, errorPayPal])

  // const onApproveTest = async() => {
  //   await payOrder({orderId, details: {payer: {}}})
  //   refetch()
  //   toast.success('Payment successful')
  // }

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice
          }
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    }).then((orderId) => {
      return orderId
    })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({orderId, details}).unwrap()
        refetch()
        toast.success('Payment successful')
      } catch (error) {
        toast.error(error?.data.message || error.message)
      }
    })
  }

  const onError = (error) => {
    toast.error(error.message)
  }

  const deliverOrderHandler = async() => {
    try {
      await deliverOrder(orderId)
      refetch()
      toast.success('Order delivered')
      console.log(order);
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    isLoading ? <Loader/> : error ? <Message variant='danger'>{error?.data?.message || error.error} </Message> : (
      <>
        <h1>Order ID: {order._id}</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> { order.user.name }
                </p>
                <p>
                  <strong>Email: </strong> { order.user.email }
                </p>
                <p>
                  <strong>Address: </strong> { order.shippingAddress.address }, { order.shippingAddress.city }, { order.shippingAddress.postalCode }, { order.shippingAddress.country }
                </p>
                  {
                    order.isDelivered ? (
                      <Message variant='success'>
                        Order Delivered on { order.deliveredAt.substring(0, 10) }
                      </Message>
                    ) : (
                      <Message variant='danger'>
                        Order not delivered
                      </Message>
                    )
                  }
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method:</strong> { order.paymentMethod }
                </p>
                {
                    order.isPaid ? (
                      <Message variant='success'>
                        Order paid on { order.paidAt.substring(0, 10) }
                      </Message>
                    ) : (
                      <Message variant='danger'>
                        Order not paid
                      </Message>
                    )
                  }
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {
                  order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
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
                      <Col>${ order.itemsPrice }</Col>
                    </Row>
                    <Row>
                      <Col>Shipping: </Col>
                      <Col>${ order.shippingPrice }</Col>
                    </Row>
                    <Row>
                      <Col>Tax: </Col>
                      <Col>${ order.taxPrice }</Col>
                    </Row>
                    <Row>
                      <Col>Total: </Col>
                      <Col>${ order.totalPrice }</Col>
                    </Row>
                  </ListGroup.Item>

                  { !order.isPaid && (
                    <ListGroup.Item>
                      { loadingPay && <Loader/> }
                      { isPending ? <Loader/> : (
                        <div>
                          <PayPalButtons
                            createOrder={ createOrder }
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>

                        </div>
                      )}
                    </ListGroup.Item>
                  ) }
                  {
                    loadingDeliver && <Loader/>
                  }
                  {
                    userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                      <ListGroup.Item>
                        <Button
                          type='button'
                          className='btn btn-block'
                          onClick={deliverOrderHandler}
                        >
                          Mark as Delivered
                        </Button>
                      </ListGroup.Item>
                    )
                  }
                </ListGroup>
              </Card>
          </Col>
        </Row>
      </>
    )
  )
}

export default OrderScreen