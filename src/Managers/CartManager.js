import fs from 'fs'
import { productManager} from "../Managers/index.js";
import { notFoundError, ValidationError } from '../utils/index.js'

//constructor de productos
export class CartManagerFilesystem {
    constructor(path){
        this.path = path
        this.#init()
    }
//crea la instancia de creacion de archivo
    #init() {
        //comprueba si existe el archivo
            try {
                const existFile = fs.existsSync(this.path)
                
                if(existFile) return
        //si no existe lo crea           
                fs.writeFileSync(this.path, JSON.stringify([]))
            } catch (erros) {
                console.log(error);
            }
    }
    //escritor de carito
    #writefile (data){
        return fs.promises.writeFile(this.path, JSON.stringify(data, null,  3));
    }

    //obtiene el carrito desde el archivo
    async getCart(){
        const response = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(response)
    }

    //obtener productos por ID 
    async getCartById(cid) {
        const carts = await this.getCart();

        const cartFound = carts.find(c => c.cid === cid);

        return cartFound;
    }

    async getProductsForCart (pid) {
        const allProducts = await productManager.getProducts()
        const productIndex = allProducts.findIndex (p => p.pid === pid)
        
        if(productIndex === -1){
            throw new notFoundError("Producto no encontrado")
        }

        const product = allProducts[productIndex]

        allProducts[productIndex] = {...product}

        await this.#writefile(allProducts)

        return allProducts[productIndex]
    
    }

    async saveCart( {cid, productsInCart, quantity, pid}){
        const cart = await this.getCart();
        const product = await this.getProductsForCart(2)
        console.log(product.pid);
        const products = {quantity, pid}
        products.pid = product.pid
        products.quantity = 1

        const newCart = {cid, productsInCart};

        newCart.productsInCart = products
        if (!cart.length != 0){
            newCart.cid = 1
        }else {
            newCart.cid = cart[cart.length - 1].cid + 1
        }
        cart.push(newCart)
        console.log("\n cid:",newCart.cid);
        console.log("\n cart:",cart);
        await this.#writefile(cart)
        return newCart;

    }
}