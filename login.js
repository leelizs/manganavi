document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Previne o envio do formulário

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    // Recupera o usuário armazenado no localStorage (ou seria feito uma consulta ao banco de dados real)
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Verifica se o usuário existe e se a senha está correta
    if (usuario && usuario.email === email && usuario.senha === senha) {
        alert('Login bem-sucedido!');
        window.location.href = 'index.html'; // Redireciona para a página do usuário
    } else {
        alert('E-mail ou senha incorretos!');
    }
});
