document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');
    const searchInput = document.getElementById('search-input');
    
    let masterScriptsArray = [];

    const fallbackData = [
        { "id": "novaui", "title": "NovaUI" },
        { "id": "zurai-hub", "title": "Zurai-hub" }
    ];

    fetch('./posts.json')
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(savedScripts => {
            masterScriptsArray = savedScripts;
            renderScripts(masterScriptsArray);
        })
        .catch(() => {
            // If GitHub Pages fails to find posts.json, force show the cards anyway!
            masterScriptsArray = fallbackData;
            renderScripts(masterScriptsArray);
        });

    function renderScripts(scriptsToDisplay) {
        scriptsContainer.innerHTML = '';
        const rawGitHubBaseUrl = "https://githubusercontent.com";

        scriptsToDisplay.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';
            const loadstringText = `loadstring(game:HttpGet("${rawGitHubBaseUrl}raw.lua"))()("${script.id}")`;

            card.innerHTML = `
                <h3>${script.title}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${loadstringText}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

        document.querySelectorAll('.copy-loadstring-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loadstring = e.target.getAttribute('data-loadstring');
                navigator.clipboard.writeText(loadstring).then(() => {
                    e.target.textContent = "Copied!";
                    setTimeout(() => { e.target.textContent = "Copy Loadstring"; }, 1500);
                });
            });
        });
    }

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const queryText = e.target.value.toLowerCase().trim();
            const filteredList = masterScriptsArray.filter(script => 
                script.title.toLowerCase().includes(queryText)
            );
            renderScripts(filteredList);
        });
    }
});
