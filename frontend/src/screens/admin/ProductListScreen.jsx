import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import {
    useAddProductMutation,
    useGetProductsQuery,
    useDeleteProductMutation
} from '../../slices/productsApiSlice'
import { useParams } from 'react-router-dom'
import Paginate from '../../components/Paginate'

const ProductListScreen = () => {
    
    const { pageNumber } = useParams()
    const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber})
    const [ addProduct, { isLoading: loadingAdd } ] = useAddProductMutation()
    const [ deleteProduct, { isLoading: loadingDelete } ] = useDeleteProductMutation()
    
    const addProductHandler = async() => {
        if(window.confirm('')){
            try {
                await addProduct()
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        }
    }

    const deleteProductHandler = async(productId) => {
        if(window.confirm('Are you sure to delete this item?')){
            try {
                const res = await deleteProduct(productId).unwrap()
                toast.success(res.message)
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error.error )
            }
        }
    }

    return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h2>Products</h2>
            </Col>
            <Col className='text-end'>
                <Button className='btn-sm m-3' onClick={addProductHandler}>
                    <FaEdit/> Add product
                </Button>
            </Col>
        </Row>

        {loadingAdd && <Loader/>}

        {loadingDelete && <Loader/>}

        {
            isLoading ? <Loader/> : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message> : (
                <>
                    <Table striped hover responsive className='table-md'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button variant='dark' className='btn-sm mx-2 my-2'>
                                                    <FaEdit/>
                                                </Button>
                                            </LinkContainer>
                                            <Button variant='danger' className='btn-sm' onClick={() => deleteProductHandler(product._id)}>
                                                <FaTrash/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    <Paginate pages={data.pages} page={data.page} isAdmin={true}/>
                </>
            )
        }
    </>
  )
}

export default ProductListScreen