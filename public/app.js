let debounceTimeout; // Armazena o ID do timeout do debounce
let lastQueryVersion = 0; // Controla a versão da consulta para garantir a consistência dos resultados
const maxResults = 10; // Limite de resultados a serem exibidos

document.getElementById("searchInput").addEventListener("input", updateHistory);
document.getElementById("searchInput").addEventListener("focus", showHistory);

// Gerenciar o histórico no localStorage
function saveToHistory(query) {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!history.includes(query)) {
        history.unshift(query);
        if (history.length > 10) history.pop(); // Limitar a 10 itens
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }
}

function getHistory() {
    return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function updateHistory() {
    const searchInput = document.getElementById("searchInput");
    const dropdown = document.getElementById("historyDropdown");
    const autocomplete = document.getElementById("autocompleteContainer");
    const history = getHistory();
    const query = searchInput.value.trim().toLowerCase();

    dropdown.innerHTML = "";
    autocomplete.innerHTML = ""; // Limpar sugestões

    if (!query) {
        dropdown.style.display = "none";
        autocomplete.style.display = "none";
        return;
    }

    // Filtrar histórico para exibir somente correspondências
    const filteredHistory = history.filter(item => item.toLowerCase().startsWith(query));
    if (filteredHistory.length > 0) {
        filteredHistory.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            li.addEventListener("click", () => {
                searchInput.value = item;
                searchManga();
                dropdown.style.display = "none";
                autocomplete.style.display = "none";
            });
            dropdown.appendChild(li);
        });
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }

}

// Função para mostrar o histórico quando o usuário clica no campo de pesquisa

function showHistory() {
    const searchInput = document.getElementById("searchInput");
    const dropdown = document.getElementById("historyDropdown");
    const clearButton = document.getElementById("clearHistoryButton");
    const history = getHistory();

    dropdown.innerHTML = "";

    if (history.length > 0) {
        history.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            li.addEventListener("click", () => {
                searchInput.value = item;
                searchManga();
                dropdown.style.display = "none";
            });
            dropdown.appendChild(li);
        });

        dropdown.style.display = "block";

    } else {
        dropdown.style.display = "none";
    }
}

// Função para limpar o histórico
function clearSearchHistory() {
    if (getHistory().length === 0) {
        alert("Não há histórico a ser limpo");
        return;
    }

    localStorage.removeItem("searchHistory"); // Remove o histórico
    document.getElementById("historyDropdown").innerHTML = ""; // Limpa a lista visível

    // 🔴 Deixe o botão visível mesmo após limpar o histórico
    document.getElementById("clearHistoryButton").style.display = "block";
}

// Esconder o dropdown e o botão ao perder o foco
document.getElementById("searchInput").addEventListener("blur", () => {
    setTimeout(() => {
        document.getElementById("historyDropdown").style.display = "none";
    }, 200);
});


function focusSearch() {
    document.getElementById("searchInput").focus();
}

async function searchManga() {
    clearTimeout(debounceTimeout); // Limpa o timeout anterior
    debounceTimeout = setTimeout(async () => {
        const query = document.getElementById("searchInput").value.trim().toLowerCase();
        const resultsList = document.getElementById("resultsList");
        const loader = document.getElementById("loader"); // Elemento do loader
        const resultsContainer = document.querySelector('.results-container'); // Container dos resultados

        // Incrementa a versão da consulta
        const currentQueryVersion = ++lastQueryVersion;

        // Limpar resultados anteriores e exibir o loader
        resultsList.innerHTML = "";
        loader.style.display = "block";

        // Não fazer requisição se o campo estiver vazio
        if (!query) {
            loader.style.display = "none";
            resultsList.innerHTML = "<li>Digite algo para iniciar a busca.</li>";
            resultsContainer.style.display = "none"; // Esconde o quadrado estilizado
            return;
        }

        saveToHistory(query); // Salvar consulta no histórico

        loader.style.display = "block";
        resultsList.innerHTML = "";

        try {
            // Realizar requisição à API Jikan
            const response = await fetch(`https://api.jikan.moe/v4/manga?q=${query}`);
            const data = await response.json();

            loader.style.display = "none";

            // Ignorar se uma nova requisição já foi feita
            if (currentQueryVersion < lastQueryVersion) {
                loader.style.display = "none";
                return;
            }

            // Verificar se há resultados
            if (data.data.length === 0) {
                loader.style.display = "none";
                resultsList.innerHTML = "<li>Nenhum mangá encontrado.</li>";
                resultsContainer.style.display = "none"; // Esconde o quadrado estilizado
                return;
            }

            // Exibe o quadrado estilizado quando houver resultados
            resultsContainer.style.display = "flex"; // Exibe o quadrado estilizado

            // Limitar resultados ao máximo permitido inicialmente
            const limitedResults = data.data.slice(0, maxResults);

            // Exibir resultados limitados
            limitedResults.forEach(manga => {
                const listItem = document.createElement("li");
                listItem.innerHTML = ` 
                    <strong><a href="${manga.url}" target="_blank">${manga.title}</a></strong><br>
                    <em>${manga.authors.map(author => author.name).join(", ") || "Autor desconhecido"}</em><br>
                    <p>${manga.synopsis || "Sem descrição disponível."}</p>
                `;
                resultsList.appendChild(listItem);
            });

            // Exibir mensagem de aviso caso existam mais resultados não exibidos
            if (data.data.length > maxResults) {
                const messageContainer = document.createElement("div");
                messageContainer.innerHTML = `
                    <p style="color: gray;">Exibindo os ${maxResults} primeiros resultados de ${data.data.length}.</p>
                    <button id="showAllResults" class="view-more-button">Ver mais</button>
                `;
                resultsList.appendChild(messageContainer);

                // Adicionar evento ao botão "Ver mais"
                document.getElementById("showAllResults").addEventListener("click", () => {
                    resultsList.innerHTML = ""; // Limpar a lista de resultados
                    data.data.forEach(manga => {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
            <strong><a href="${manga.url}" target="_blank">${manga.title}</a></strong><br>
            <em>${manga.authors.map(author => author.name).join(", ") || "Autor desconhecido"}</em><br>
            <p>${manga.synopsis || "Sem descrição disponível."}</p>
        `;
                        resultsList.appendChild(listItem);
                    });
                });

            }
        } catch (error) {
            console.error("Erro ao buscar mangás:", error);
            resultsList.innerHTML = "<li>Ocorreu um erro ao buscar os mangás. Tente novamente mais tarde.</li>";
            resultsContainer.style.display = "none"; // Esconde o quadrado estilizado em caso de erro
        } finally {
            // Ocultar o loader após a busca
            loader.style.display = "none";
        }
    }, 2000); // 3000ms de atraso
}
