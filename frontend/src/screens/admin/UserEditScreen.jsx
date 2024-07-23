import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormContainer from '../../components/FormContainer'
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'

const UserEditScreen = () => {

  const { id: userId } = useParams()

  const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId)
  const [ updateUser, { isLoading: loadingUpdate } ] = useUpdateUserMutation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if(user){
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [user])

  const submitHandler = async(e) => {
    e.preventDefault()
    try {
      const res = await updateUser({ userId, name, email, isAdmin }).unwrap()
      toast.success(res.message)
      console.log(res);
      refetch()
      navigate('/admin/userslist')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <>
      <Link to='/admin/userslist' className='btn btn-light my-3'>
        Go back
      </Link>
      <FormContainer>
        <h2>Edit User</h2>
        { loadingUpdate && <Loader/> }
        {
          isLoading ? (
            <Loader/>
          ) : error ? (
            <Message variant='danger'>{ error }</Message>
          ) : ( 
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name' className='my-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                > 
                </Form.Control>
              </Form.Group>
              <Form.Group controlId='email' className='my-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                > 
                </Form.Control>
              </Form.Group>
              <Form.Group controlId='isAdmin' className='my-2'>
                <Form.Label>Admin</Form.Label>
                <Form.Check
                  type='radio'
                  label='yes'
                  checked={isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
                >
                </Form.Check>
                <Form.Check
                  type='radio'
                  label='no'
                  checked={!isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
                >
                </Form.Check>
              </Form.Group>

              <Button type='submit' variant='primary' className='my-2'>
                Update
              </Button>

            </Form>
          )
        }
      </FormContainer>
    </>
  )
}

export default UserEditScreen