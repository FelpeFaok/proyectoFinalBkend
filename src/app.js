import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from "./dirname.js"
import {Server as HttpServer} from "http"
import {Server as IOServer} from "socket.io"

import {productsRouter, cartRouter, viewsRouter} from './routers/index.js'
import { productManager } from './Managers/index.js'

const PORT = 8080
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main.hbs"
}))
app.use(express.static("public"))

app.set("view engine", "hbs")
app.set("views", __dirname + "/views")



app.use(express.json())
app.use(express.urlencoded({extended: true}))



// app.use( (req, res, next)=>{
//     req.io = io

//     next()
// })

app.set('io', io)

app.use('/', viewsRouter)
app.use('/static', express.static('public'))

app.use('/api/carts', cartRouter)
app.use('/api/products', productsRouter)
app.use('/', (req, res) => res.send('HOME'))


httpServer.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))

io.on("connection", async socket => {
    console.log(`Nuevo cliente conectado, id: ${socket.id}`);

    io.sockets.emit("hello", "HOLA!")

    const products = await productManager.getProducts()
    io.sockets.emit("products", products)



    socket.on('addProduct', async (product) =>{

        await productManager.saveProduct(product)
    }

    )
})