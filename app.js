document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');
    const searchInput = document.getElementById('search-input');
    
    let masterScriptsArray = [];

    // Natively fetch content entries out of posts.json mapping index file
    fetch('./posts.json')
        .then(response => {
            if (!response.ok) throw new Error("File could not be parsed.");
            return response.json();
        })
        .then(savedScripts => {
            masterScriptsArray = savedScripts;
            renderScripts(masterScriptsArray);
        })
        .catch(err => {
            console.error(err);
            scriptsContainer.innerHTML = `<p style="color: #ff7b72; text-align: center;">Error loading configuration index map (posts.json).</p>`;
        });

    function renderScripts(scriptsToDisplay) {
        scriptsContainer.innerHTML = '';

        if (!scriptsToDisplay || scriptsToDisplay.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No matching scripts discovered.</p>';
            return;
        }

        // Direct static raw assets link pointing directly to your repository variables
        const rawGitHubBaseUrl = "https://githubusercontent.com";

        scriptsToDisplay.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // High-compatibility executor instruction command loop macro configuration
            const loadstringText = `loadstring(game:HttpGet("${rawGitHubBaseUrl}raw.lua"))()("${script.id}")`;

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
    searchInput.addEventListener('input', (e) => {
        const queryText = e.target.value.toLowerCase().trim();
        const filteredList = masterScriptsArray.filter(script => 
            script.title.toLowerCase().includes(queryText)
        );
        renderScripts(filteredList);
    });

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
