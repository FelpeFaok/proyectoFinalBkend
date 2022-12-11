import fs from 'fs'

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
    //crear producrtos nuevos
    async saveCart( {cid, quantity}){
        const newCart = {cid, quantity};
        //obtienes los productos
        const cart = await this.getCart();
        //verificas que exista el code
        const existPidInCart = cart.some(c => c.pid === pid);
        //si existe error
        if (existPidInCart){
            const quantity = cart.quantity + 1
            cart.push(quantity)
        }
        //si no lo crea y agrega
        newCart.cid = !cart.length ? 1 : cart[cart.length - 1].id + 1;
        cart.push(newCart);

        await this.#writefile(cart)
        return newCart;

    }
}