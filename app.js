document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');
    const searchInput = document.getElementById('search-input');
    
    let masterScriptsArray = [];

    // Production Cache-Busting Fallback: Native load execution targets used during offline testing loops
    const offlineMemoryArray = [
        { "id": "novaui", "title": "NovaUI" },
        { "id": "zurai-hub", "title": "Zurai-hub" }
    ];

    // Fetch master config list using cache busting string configurations
    fetch(`./posts.json?cb=${Date.now()}`)
        .then(response => {
            if (!response.ok) throw new Error("Manifest file unreadable.");
            return response.json();
        })
        .then(savedScripts => {
            masterScriptsArray = savedScripts;
            renderScripts(masterScriptsArray);
        })
        .catch(err => {
            console.warn("Deploying client-side structural cache container fallback layout.", err);
            masterScriptsArray = offlineMemoryArray;
            renderScripts(masterScriptsArray);
        });

    function renderScripts(scriptsToDisplay) {
        scriptsContainer.innerHTML = '';

        if (!scriptsToDisplay || scriptsToDisplay.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px 0;">No matching script profiles discovered.</p>';
            return;
        }

        // PRODUCTION CDN PIPELINE:
        // By pulling data through the jsDelivr open proxy wrapper, we ensure script changes are delivered instantly
        // to Roblox executors worldwide without encountering traditional 5-minute GitHub Pages replication cache lag!
        const cdnExecutionUrl = "https://jsdelivr.net";

        scriptsToDisplay.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // High-performance executor macro targeting your global CDN endpoint profile map
            const loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${cdnExecutionUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

        // Interactive clipboard interaction controllers
        document.querySelectorAll('.copy-loadstring-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const buttonElement = e.target;
                const loadstring = buttonElement.getAttribute('data-loadstring');
                
                navigator.clipboard.writeText(loadstring).then(() => {
                    const originalText = buttonElement.textContent;
                    buttonElement.textContent = "Copied!";
                    buttonElement.classList.add('copied');
                    
                    setTimeout(() => {
                        buttonElement.textContent = originalText;
                        buttonElement.classList.remove('copied');
                    }, 1500);
                });
            });
        });
    }

    // Dynamic Client UI Search Layout Filter Hook
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
