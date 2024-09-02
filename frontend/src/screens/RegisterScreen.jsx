import React, { useState, useEffect } from 'react'
import FormContainer from '../components/FormContainer'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const RegisterScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, {isLoading}] = useRegisterMutation()

    const { userInfo } = useSelector((state) => state.auth)

    const { search } = useLocation()

    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = async(e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error(`Password do not match`)
        }else{
            try {
                const res = await register({ name, email, password }).unwrap()
                dispatch(setCredentials({...res}))
                navigate(redirect)
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

  return (
    <FormContainer>
        <h1>Register</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-3'>
                <Form.Label>name</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='enter email address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='password' className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='enter password again'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
                Register
            </Button>
            {
                isLoading && <Loader/>
            }
        </Form>

        <Row>
            <Col>
                Already a user ? <Link to={redirect ? `/login?redirect=${redirect}` : `/login`}>Login</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen

