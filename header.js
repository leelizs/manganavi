document.addEventListener("DOMContentLoaded", function () {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

            const headerContainer = document.querySelector(".header-container");

            if (headerContainer) {
                // Remove qualquer botão antigo para evitar duplicação
                const oldButton = document.getElementById("header-button");
                if (oldButton) oldButton.remove();

                if (window.location.pathname.includes("login.html")) {
                    // Botão "Voltar ao Início" na página de login
                    const backButton = document.createElement("button");
                    backButton.textContent = "Voltar ao Início";
                    backButton.classList.add("back-button");
                    backButton.onclick = function () {
                        window.location.href = "index.html";
                    };
                    headerContainer.appendChild(backButton);

                } else if (window.location.pathname.includes("cadastro.html")) {
                    // Criar os botões "Login" e "Voltar ao Início" na página de cadastro
                    const loginButton = document.createElement("button");
                    loginButton.textContent = "Login";
                    loginButton.classList.add("back-button");
                    loginButton.onclick = function () {
                        window.location.href = "login.html";
                    };

                    const backButton = document.createElement("button");
                    backButton.textContent = "Voltar ao Início";
                    backButton.classList.add("back-button");
                    backButton.onclick = function () {
                        window.location.href = "index.html";
                    };

                    headerContainer.appendChild(backButton);
                    headerContainer.appendChild(loginButton);

                } else {
                    // Botão "Login" na página inicial
                    const loginButton = document.createElement("button");
                    loginButton.textContent = "Login";
                    loginButton.classList.add("back-button");
                    loginButton.onclick = function () {
                        window.location.href = "login.html";
                    };
                    headerContainer.appendChild(loginButton);
                }
            }
        })
        .catch(error => console.error("Erro ao carregar o header:", error));
});
