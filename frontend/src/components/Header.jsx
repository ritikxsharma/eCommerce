import React from 'react'
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import SearchBox from './SearchBox'
import { resetCart } from '../slices/cartSlice'

const Header = () => {

    const { cartItems } = useSelector((state) => state.cart)
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ logoutApiCall ] = useLogoutMutation()

    const logoutHandler = async() => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            dispatch(resetCart())
            navigate(`/login`)
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <header>
        <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand >
                        <img src={logo} alt="" />
                        ProShop
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <SearchBox/>
                        <LinkContainer to='/cart'>
                            <Nav.Link>
                                <FaShoppingCart/>
                                Cart
                                {
                                    cartItems.length > 0 && (
                                        <Badge pill bg='success' style={{margin: '5px'}}>
                                            {
                                                cartItems.reduce((acc, currItem) => acc + currItem.qty, 0)
                                            }
                                        </Badge>
                                    )
                                }
                            </Nav.Link>
                        </LinkContainer>
                        {
                            userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>My Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                <Nav.Link>
                                    <FaUser/>
                                    SignIn
                                </Nav.Link>
                            </LinkContainer>
                            )
                        }
                        {
                            userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <LinkContainer to='/admin/productslist'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/orderslist'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/userslist'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header