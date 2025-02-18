const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('./database'); // Certifique-se de que sua conexão com o banco de dados está funcionando

const router = express.Router();

// Definindo o esquema do usuário
const UserSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', UserSchema);

// Rota de Cadastro
router.post('/register', async (req, res) => {
    const { nome, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "E-mail já cadastrado" });

        const hashedPassword = await bcrypt.hash(password, 10); // Criptografando a senha
        const user = new User({ nome, email, password: hashedPassword });

        await user.save(); // Salvando no banco de dados
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao cadastrar usuário" });
    }
});

// Rota de Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "E-mail não encontrado" });

        const isPasswordValid = await bcrypt.compare(password, user.password); // Comparando a senha
        if (!isPasswordValid) return res.status(400).json({ message: "Senha incorreta" });

        // Gerando o token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login bem-sucedido", token, nome: user.nome });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao fazer login" });
    }
});

module.exports = router;
