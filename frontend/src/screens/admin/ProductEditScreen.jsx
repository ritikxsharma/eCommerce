import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../../components/Message' 
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { 
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation 
} from '../../slices/productsApiSlice'

const ProductEditScreen = () => {
  const { id: productId } = useParams()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId)
  const [ updateProduct, { isLoading: loadingUpdate } ] = useUpdateProductMutation()
  const [ uploadImage, { isLoading: loadingImage }] = useUploadProductImageMutation()

  const navigate = useNavigate()

  useEffect(() => {
    refetch()
    if(product){
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
  }, [product, refetch])

  const uploadFileHandler = async(e) => {
    const formData = new FormData()
    formData.append('image', e.target.files[0])
    try {
      const res = await uploadImage(formData).unwrap()
      toast.success(res.message)
      setImage(res.image)
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
   }

  const submitHandler = async(e) => {
    e.preventDefault()
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description
    }

    try {
      await updateProduct(updatedProduct)
      toast.success('Product updated successfully')
      navigate('/admin/productslist')
    } catch (error) {
      toast.error(error?.data?.message || error.message)
    }
  }
  return (
    <>
      <Link to='/admin/productslist' className='btn btn-light my-3'>Go back</Link>
      <FormContainer>
        <h2>Edit Product</h2>
        {
          loadingUpdate && <Loader/>
        }
        {
          isLoading ? <Loader/> : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message> : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name' className='my-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)
                  }
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='price'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='enter price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)
                  }
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='price'>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='enter image url'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
                <Form.Control
                  type='file'
                  label='choose file'
                  onChange={uploadFileHandler}
                >
                </Form.Control>
              </Form.Group>
              
              {
                loadingImage && <Loader/>
              }

              <Form.Group controlId='category'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='enter category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='brand'>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='enter brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='countInStock'>
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='enter count in stock'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='enter description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)
                  }
                ></Form.Control>
              </Form.Group>
              <Button
                type='submit'
                className='my-3'
              >
                Update
              </Button>
            </Form>
          )
        }
      </FormContainer>
    </>
  )
}

export default ProductEditScreen