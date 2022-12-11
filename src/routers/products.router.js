import { Router } from 'express'
import { ERROR } from "../const/errors.js";
import { productManager} from "../Managers/index.js";

const router = Router()

// router.use(function(req, res, next) {
//     console.log('El endpoint de productos');
//     next()
// })

// router.get('/', async (req, res) => {
//     const products = await productManager.getProducts()
//     res.json({products})
// })

router.get('/', async (req, res) => {
    try {
        const {limit} = req.query
    
        const allProducts = await productManager.getProducts()
    //determina el query
        if (!limit || limit < 1){
            return res.send({success: true, products: allProducts});
        }
    //devuelve los productos por query
        const products = allProducts.slice(0,limit) 
            res.send({success: true, products});
        
    } catch (error) {
        console.log(error);

        res.send({success: false, error: "▲ EXPLOTO! ▲"})
    }
});
//obtener producto por param id
router.get('/:pid', async (req, res) => {
    try {
        const {pid: paramPid }= req.params

        const pid = Number(paramPid)
        //comprobamos que sea valido como numero
        if(Number.isNaN(pid) || pid<0){
            return res.send({success: false, error: "El Id es invalido"})
        }
        const product = await productManager.getProductById(pid)
        //comprobamos existencia
        if(!product){
            return res.send({success: false, error: "Producto no encontrado"})
        }

        res.send({success: true, product})

    } catch (error) {
        console.log(error);
        res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }
})

router.post('/', async (req, res) => {
    try {
        //obtenemos los productos
        const {title, description, price, code} = req.body
        //comprobamos las variables si existen 
        if(!title || !description || !price || !code) {
            return res.send({success: false, error: "Las variables son obligatorias"})
        }
        //creamos los productos
        const savedProduct  = await productManager.saveProduct({title, description, price, code})
        res.send({success: true, product: savedProduct})

    } catch (error) {
        //validacion de error por cliente, por medio de instancias 
        console.log( error);
        if(error.name === ERROR.VALIDATION_ERRROR){
            return res.send({
                success: false,
                error: `${error.name}: ${error.message}`
            })
        }

        res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }
});

router.put('/:pid', async(req, res) => {
    try {
        const {pid: paramPid }= req.params

        const pid = Number(paramPid)
        //comprobamos que sea valido
        if(Number.isNaN(pid) || pid<0){
            return res.send({success: false, error: "El Id es invalido"})
        }

        const {title, description, price, code} = req.body

        const updateProduct = await productManager.update({title, description, price, code}, pid)
        res.send({
            success: true,
            product: updateProduct,
        })
    } catch (error) {
        console.log(error);

        if(error.name === ERROR.NOT_FOUND_ERRROR){
            return res.send({
                success: false,
                error: `${error.name}: ${error.message}`
            })
        }
    res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const {pid: paramPid }= req.params

        const pid = Number(paramPid)
        //comprobamos que sea valido
        if(Number.isNaN(pid) || pid<0){
            return res.send({success: false, error: "El Id es invalido"})
        }

        const deletedProduct = await productManager.deleteProduct(pid)
        return res.send({
            success: true, 
            deleted: deletedProduct
        })

    } catch (error) {
        console.log(error);

        if(error.name === ERROR.NOT_FOUND_ERRROR){
            return res.send({
                success: false,
                error: `${error.name}: ${error.message}`
            })
        }
    res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }

})


export default router