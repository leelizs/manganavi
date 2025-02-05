document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Previne o envio do formulário

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const confirmSenha = document.getElementById('confirm-password').value;

    // Verifica se as senhas são iguais
    if (senha !== confirmSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Simula o cadastro (no frontend, seria salvo no localStorage ou enviado para o backend)
    const user = {
        nome: nome,
        email: email,
        senha: senha
    };

    // Salva o usuário no localStorage (isso seria feito no banco de dados real)
    localStorage.setItem('usuario', JSON.stringify(user));
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html'; // Redireciona para a página de login
});
