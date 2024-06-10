const express = require('express');
const productsRouter = require('./routers/productsrouter');
const indexRouter = require('./routers/indexrouter');
const cartsRouter = require('./routers/cartsrouter');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/favicon.ico', (req, res) => res.status(204));

// Configuración de rutas
app.use('/', indexRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de archivos estáticos
app.use('/statics', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})