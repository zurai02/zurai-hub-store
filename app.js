document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');
    const searchInput = document.getElementById('search-input');
    
    let masterScriptsArray = [];

    // Fallback data configuration structure
    const fallbackData = [
        { "id": "novaui", "title": "NovaUI" },
        { "id": "zurai-hub", "title": "Zurai-hub" }
    ];

    // Natively fetch data profiles out of your live posts.json file config
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
            console.warn("Using offline memory fallback layout.");
            masterScriptsArray = fallbackData;
            renderScripts(masterScriptsArray);
        });

    function renderScripts(scriptsToDisplay) {
        scriptsContainer.innerHTML = '';

        // Dynamically calculates your EXACT live website address folder path context
        const currentUrl = new URL(window.location.href);
        const baseUrl = currentUrl.origin + currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/') + 1);
        
        // This targets the live JSON configuration file directly on YOUR site domain
        const liveSiteJsonUrl = baseUrl + 'posts.json';

        scriptsToDisplay.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // GENERATES 100% COMPATIBLE DYNAMIC LUA FOR EXECUTORS:
            // This loads data from your website domain link and reads the string key target
            const loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${liveSiteJsonUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

        // Set up click interactive copy execution listener 
        document.querySelectorAll('.copy-loadstring-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loadstring = e.target.getAttribute('data-loadstring');
                navigator.clipboard.writeText(loadstring).then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = "Copied!";
                    setTimeout(() => { e.target.textContent = originalText; }, 1500);
                });
            });
        });
    }

    // Dynamic Search Input Input Event Filtering Handle Loop
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const queryText = e.target.value.toLowerCase().trim();
            const filteredList = masterScriptsArray.filter(script => 
                script.title.toLowerCase().includes(queryText)
            );
            renderScripts(filteredList);
        });
    }

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
