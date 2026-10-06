document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');
    const searchInput = document.getElementById('search-input');
    
    let masterScriptsArray = [];

    const offlineMemoryArray = [
        { "id": "novaui", "title": "NovaUI" },
        { "id": "zurai-hub", "title": "Zurai-hub" }
    ];

    // Fetch master config list using cache busting parameters
    fetch(`./posts.json?cb=${Date.now()}`)
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(savedScripts => {
            masterScriptsArray = savedScripts;
            renderScripts(masterScriptsArray);
        })
        .catch(() => {
            masterScriptsArray = offlineMemoryArray;
            renderScripts(masterScriptsArray);
        });

    function renderScripts(scriptsToDisplay) {
        scriptsContainer.innerHTML = '';

        if (!scriptsToDisplay || scriptsToDisplay.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px 0;">No matching script profiles discovered.</p>';
            return;
        }

        // Global jsDelivr public wrapper ensures instant execution matrix updates without delay
        const cdnExecutionUrl = "https://jsdelivr.net";

        scriptsToDisplay.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // Fixed dynamic link builder running directly off your web index configurations
            const loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${cdnExecutionUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

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
