const socket = io()

const productContainer = document.getElementById("products-table-body")
const createProductForm = document.getElementById("create-product-form")



socket.on('products', products => {
    const allProductsElements = products.map((p) => `
        <tr>
            <td> ${p.code} </td>
            <td> ${p.title} </td>
            <td> ${p.description} </td>
            <td> ${p.price} </td>
            <td> <img height="72px" width="72px" src=${p.thumbnail} /> </td>
        </tr>
    
    `).join(" ")

    productContainer.innerHTML = allProductsElements
})

createProductForm.addEventListener('submit', async (e)=> {
    e.preventDefault() 


    const formData = new FormData(createProductForm)

    const product = {}

    for (const field of formData.entries()) {
        
        product[field[0]] = field[1]
    }
    
    await fetch('/api/products', {
        body: JSON.stringify(product),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
    })

    // socket.emit("addProduct", product)
})