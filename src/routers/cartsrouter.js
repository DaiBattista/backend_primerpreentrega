const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const carts = require('../carts.json');

const router = express.Router();
let cartCounter = 0; // Inicializamos el contador en 0

// Ruta GET /api/carts
router.get('/', (req, res) => {
    res.json(carts);
});

// Ruta POST /api/carts
router.post('/', (req, res) => {
    cartCounter++; 
    const cartId = cartCounter.toString(); 
    const newCart = {
        id: cartId,
        products: [],
    };
    carts.push(newCart);
    saveCarts();
    res.status(201).json(newCart);
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(404).json({
            message: `El carrito con ID ${cartId} no existe.`,
        });
    }
    res.json(cart);
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(404).json({
            message: `El carrito con ID ${cartId} no existe.`,
        });
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find((product) => product.id === productId);

    if (!existingProduct) {
        // Si el producto no existe en el carrito, agregarlo
        cart.products.push({
            id: productId,
            quantity,
        });
    } else {
        // Si el producto ya está en el carrito, incrementa la cantidad
        existingProduct.quantity += quantity;
    }

    saveCarts();

    res.json(cart);
});

function saveCarts() {
    const data = JSON.stringify(carts);

    fs.writeFile('./carts.json', data, (err) => {
        if (err) {
            console.error('Error', err);
        } else {
            console.log('Productos guardados correctamente.');
        }
    });
}

module.exports = router;