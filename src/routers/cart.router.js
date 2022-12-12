import { Router } from 'express'
import { ERROR } from "../const/errors.js";
import { cartManager} from "../Managers/index.js";

const router = Router()

router.use(function(req, res, next) {
    console.log('El endpoint de cart');
    next()
})

router.get('/', async (req, res) => {
    try {
        const {limit} = req.query
    
        const cart = await cartManager.getCart()
    //determina el query
        if (!limit || limit < 1){
            return res.send({success: true, products: cart});
        }
    //devuelve los productos por query
        const carts = cart.slice(0,limit)
        res.send({success: true, carts});
        
    } catch (error) {
        console.log(error);

        res.send({success: false, error: "▲ EXPLOTO! ▲"})
    }
});
//obtener producto por param id
router.get('/:cid', async (req, res) => {
    try {
        const {cid: paramCid }= req.params

        const cid = Number(paramCid)
        //comprobamos que sea valido como numero
        if(Number.isNaN(cid) || cid<0){
            return res.send({success: false, error: "El Id es invalido"})
        }
        const cart = await cartManager.getCartById(cid)
        //comprobamos existencia
        if(!cart){
            return res.send({success: false, error: "El carrito no esta"})
        }

        res.send({success: true, cart})

    } catch (error) {
        console.log(error);
        res.send({success: false, error:"▲ EXPLOTO! ▲"})
    }
})


router.post('/', async (req, res) => {
    try {
        const product = []
        //comprobamos las variables si existen 
        // if(!title || !description || !price || !code) {
        //     return res.send({success: false, error: "Las variables son obligatorias"})
        // }
        //creamos los productos
        const savedCart  = await cartManager.saveCart({product})
        res.send({success: true, cart: savedCart})

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

})



router.post('/:cid/product/:pid', async (req, res) => {
    try {
        //obtenemos el carrito
        const {cid: paramCid }= req.params.cid
        const cid = Number(paramCid)
        const {pid: paramPid }= req.params.pid
        const pid = Number(paramPid)
        //comprobamos las variables si existen 

        console.log(paramCid);
        console.log(paramPid);

        if(!cid || !pid) {
            return res.send({success: false, error: "Las variables son obligatorias"})
        }
        //creamos el carrito
        const savedCart = await cartManager.saveCart({pid})
        res.send({success: true, product: savedCart})

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

export default router