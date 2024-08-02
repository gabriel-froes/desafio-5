const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Destino = require('./models/destino');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
console.log("TEST");
app.get('/destinations', async (req, res) => {
    try {
        const destinos = await Destino.model.find();
        res.json(destinos);
    } catch (error) {
        console.error('Erro ao recuperar dados:', error);
        res.status(500).send('Erro ao recuperar dados.');
    }
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
})
.catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
