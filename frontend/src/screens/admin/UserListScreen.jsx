import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Table } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa'
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const UserListScreen = () => {

    const { userInfo: currUser } = useSelector((state) => state.auth)
    const { data: users, isLoading, error, refetch} = useGetUsersQuery()
    const [ deleteUser, { isLoading: loadingDelete } ] = useDeleteUserMutation()
    
    const deleteUserHandler = async(userId) => {
        if(window.confirm('are you sure to delete the user?')){
            try {
                const res = await deleteUser(userId).unwrap()
                toast.success(res.message)
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }
  return (
    <>
        <h2>Users</h2>
        { loadingDelete && (<Loader/>) }
        {
            isLoading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>{ error }</Message>
            ) : (
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>USER</td>
                            <td>EMAIL</td>
                            <td>ADMIN</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user) => {
                                if(user._id !== currUser._id){
                                    return (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td><a href={`mailto:${user.email}`}></a>{user.email}</td>
                                            <td>
                                                {
                                                    user.isAdmin ? (
                                                        <FaCheck style={{color:'green'}}/>
                                                    ) : (
                                                        <FaTimes style={{color:'red'}}/>
                                                    )
                                                }
                                            </td>
                                            <td>
                                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                    <Button variant='success' className='btn-sm mx-4' >
                                                        <FaEdit/>
                                                    </Button>
                                                </LinkContainer>
                                                <Button variant='danger' className='btn-sm' onClick={() => deleteUserHandler(user._id)}>
                                                    <FaTrash/>
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                    </tbody>
                </Table>
            )
        }
    </>
  )
}

export default UserListScreen