require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./database');
const authRoutes = require('./authRoutes');
const path = require('path'); // Importar o módulo path

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));


// Rota principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
