import express from 'express'
import cartRouter from './routers/cart.router.js'
import productsRouter from './routers/products.router.js'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static('public'))

app.use('/api/carts', cartRouter)
app.use('/api/products', productsRouter)
app.use('/', (req, res) => res.send('HOME'))


app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))