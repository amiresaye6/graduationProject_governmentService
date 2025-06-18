// For Add Item to Cart
export const addCart = (service) =>{
    return {
        type:"ADDITEM",
        payload:service
    }
}

// For Delete Item to Cart
export const delCart = (service) =>{
    return {
        type:"DELITEM",
        payload:service
    }
}