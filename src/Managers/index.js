import { ProductManagerFilesystem } from "./ProductManager.js";
import { CartManagerFilesystem } from "./CartManager.js";


export const productManager = new ProductManagerFilesystem("./src/db/products.json")
export const cartManager = new CartManagerFilesystem("./src/db/cart.json")
