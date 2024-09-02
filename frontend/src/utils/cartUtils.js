export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

export const updateCart = (state) => {

    //Calculate total items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc, currItem) => acc + currItem.price * currItem.qty, 0))

    //Calculate shipping price, if items price > 100 then free else 10
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)

    //Calculate tax price (15%)
    state.taxPrice = addDecimals(state.itemsPrice * 0.15)

    //Calculate total price
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice) 
    ).toFixed(2)

    localStorage.setItem('cart', JSON.stringify(state))

    return state
}