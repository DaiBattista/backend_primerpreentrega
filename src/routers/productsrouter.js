const express = require('express');
const { v4: uuidV4 } = require('uuid');
const encoding = 'utf-8';
const products = require('../products.json');
const router = express.Router();

// Ruta raíz GET /api/products
router.get('/', (req, res) => {
    // Obtener el parámetro de consulta 'limit' 
    const limit = parseInt(req.query.limit);

    // Validar
    if (limit && !isNaN(limit)) {
        // Limitar los productos (Recordatorio: usar ?limit=*cantidad* luego de /products)
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
    } else {
        res.json(products);
    }
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
    const pid = req.params.pid;
    const product = products.find((product) => product.id === pid);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
});

// Ruta POST /api/products
router.post('/', (req, res) => {
    const { body } = req;
    const { title, description, code, price, stock, category } = body;
    const status = body.status !== undefined ? body.status : true;
    const thumbnails = body.thumbnails || [];

    // Validar campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({
            message: 'Se requieren campos esenciales: title, description, code, price, stock, category.',
        });
    }

    const newProduct = {
        id: uuidV4(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    const product = products.find((product) => product.id === pid);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    for (const key in req.body) {
        if (key !== 'id') {
            product[key] = req.body[key];
        }
    }

    res.json(product);
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
    const pid = req.params.pid;
    const productIndex = products.findIndex((product) => product.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);

    res.json({ message: 'Producto eliminado' });
});

module.exports = router;





