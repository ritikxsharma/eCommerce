import { ORDER_URL, PAYPAL_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDER_URL,
                method: 'POST',
                body: {...order},
            })
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDER_URL}/${orderId}`,
            }),
            keepUnusedDataFor: 5
        }),
        payOrder: builder.mutation({
            query: ({orderId, details}) => ({
                url: `${ORDER_URL}/${orderId}/pay`,
                method: 'PUT',
                body: { ...details }
            })
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL
            }),
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDER_URL}/myorders`
            }),
            keepUnusedDataFor: 5
        }),
        getOrders: builder.query({
            query: () => ({
                url: `${ORDER_URL}`
            }),
            keepUnusedDataFor: 5
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDER_URL}/${orderId}/deliver`,
                method: 'PUT',
                body: {orderId}
            })
        })
    })
})

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation
} = ordersApiSlice