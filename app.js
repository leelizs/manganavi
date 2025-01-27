let debounceTimeout; // Armazena o ID do timeout do debounce
let lastQueryVersion = 0; // Controla a versão da consulta para garantir a consistência dos resultados

async function searchManga() {
    clearTimeout(debounceTimeout); // Limpa o timeout anterior
    debounceTimeout = setTimeout(async () => {
        const query = document.getElementById("searchInput").value.trim().toLowerCase();
        const resultsList = document.getElementById("resultsList");
        const loader = document.getElementById("loader"); // Elemento do loader
        const maxResults = 10; // Limite de resultados a serem exibidos

        // Incrementa a versão da consulta
        const currentQueryVersion = ++lastQueryVersion;

        // Limpar resultados anteriores e exibir o loader
        resultsList.innerHTML = "";
        loader.style.display = "block";

        // Não fazer requisição se o campo estiver vazio
        if (!query) {
            loader.style.display = "none";
            resultsList.innerHTML = "<li>Digite algo para iniciar a busca.</li>";
            return;
        }

        try {
            // Realizar requisição à API Jikan
            const response = await fetch(`https://api.jikan.moe/v4/manga?q=${query}`);
            const data = await response.json();

            // Ignorar se uma nova requisição já foi feita
            if (currentQueryVersion < lastQueryVersion) {
                loader.style.display = "none";
                return;
            }

            // Verificar se há resultados
            if (data.data.length === 0) {
                loader.style.display = "none";
                resultsList.innerHTML = "<li>Nenhum mangá encontrado.</li>";
                return;
            }

            // Limitar resultados ao máximo permitido inicialmente
            const limitedResults = data.data.slice(0, maxResults);

            // Exibir resultados limitados
            limitedResults.forEach(manga => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <strong>${manga.title}</strong><br>
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
                            <strong>${manga.title}</strong><br>
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
        } finally {
            // Ocultar o loader após a busca
            loader.style.display = "none";
        }
    }, 300); // 300ms de atraso
}
