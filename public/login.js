document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            // Armazena o token e o nome do usuário no localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.nome); // Adiciona o nome do usuário
            window.location.href = "index.html"; // Redireciona para a página inicial
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
    }
});
