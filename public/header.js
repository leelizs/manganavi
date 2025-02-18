document.addEventListener("DOMContentLoaded", function () {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            initializeHeader();
        })
        .catch(error => console.error("Erro ao carregar o header:", error));
});

function initializeHeader() {
    const headerContainer = document.querySelector(".header-container");
    if (!headerContainer) return;

    document.getElementById("header-button")?.remove();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
        createUserButton(headerContainer, username);
    } else {
        createLoginButton(headerContainer);
    }

    waitForModalsToLoad();
    setupPageSpecificButtons(headerContainer);
}

function createUserButton(container, username) {
    const userButton = document.createElement("button");
    userButton.textContent = username;
    userButton.classList.add("user-button", "back-button");
    userButton.onclick = () => document.getElementById("logoutModal").style.display = "block";
    container.appendChild(userButton);
}

function createLoginButton(container) {
    const loginButton = document.createElement("button");
    loginButton.textContent = "Login";
    loginButton.classList.add("back-button");
    loginButton.onclick = () => window.location.href = "login.html";
    container.appendChild(loginButton);
}

function waitForModalsToLoad() {
    const checkExist = setInterval(() => {
        const logoutModal = document.getElementById("logoutModal");
        const settingsModal = document.getElementById("settingsModal");
        const logoutButton = document.getElementById("logoutButton");
        const settingsButton = document.getElementById("settingsButton");
        const toggleDarkModeButton = document.getElementById("toggleDarkMode");
        const clearHistoryButton = document.getElementById("clearHistoryButton");
        const cancelButton = document.getElementById("cancelButton");
        const closeSettingsButton = document.getElementById("closeSettingsButton");

        console.log('checking modals');
        if (logoutModal && settingsModal) {
            clearInterval(checkExist);
            console.log('modals loaded');

            // Logout Button
            logoutButton?.addEventListener("click", () => {
                alert("Saindo da conta...");
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.href = "index.html";
            });

            // Settings Modal Button
            settingsButton?.addEventListener("click", () => openModal(settingsModal));
            closeSettingsButton?.addEventListener("click", () => closeModal(settingsModal));

            // Dark Mode Toggle
            toggleDarkModeButton?.addEventListener("click", () => {
                document.body.classList.toggle("dark-mode");
                localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
            });

            // Clear History Button
            clearHistoryButton?.addEventListener("click", () => {
                localStorage.removeItem("searchHistory");
                alert("Histórico de pesquisa limpo!");
            });

            // Close modals
            cancelButton?.addEventListener("click", () => closeModal(logoutModal));
            window.addEventListener("click", event => {
                if (event.target === logoutModal) closeModal(logoutModal);
                if (event.target === settingsModal) closeModal(settingsModal);
            });
        }
    }, 100);
}

function setupPageSpecificButtons(container) {
    if (window.location.pathname.includes("login.html")) {
        createBackButton(container, "Voltar ao Início", "index.html");
    } else if (window.location.pathname.includes("cadastro.html")) {
        createBackButton(container, "Voltar ao Início", "index.html");
        createBackButton(container, "Login", "login.html");
    }
}

function createBackButton(container, text, link) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("back-button");
    button.onclick = () => window.location.href = link;
    container.appendChild(button);
}

function openModal(modal) {
    modal.style.display = "block"; // Garante que o modal aparece
    modal.classList.add("show");
}

function closeModal(modal) {
    modal.style.display = "none"; // Garante que o modal desaparece
    modal.classList.remove("show");
}


// Ativa o modo escuro ao carregar a página
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}
