document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');
    const searchInput = document.getElementById('search-input');
    
    let masterScriptsArray = [];

    // Natively fetch data entries directly from posts.json 
    fetch('./posts.json')
        .then(response => {
            if (!response.ok) throw new Error("File could not be opened.");
            return response.json();
        })
        .then(savedScripts => {
            masterScriptsArray = savedScripts;
            renderScripts(masterScriptsArray);
        })
        .catch(err => {
            console.error(err);
            scriptsContainer.innerHTML = `<p style="color: #ff7b72; text-align: center; padding: 20px;">Error loading data map. Ensure posts.json exists and is properly formatted.</p>`;
        });

    function renderScripts(scriptsToDisplay) {
        scriptsContainer.innerHTML = '';

        if (!scriptsToDisplay || scriptsToDisplay.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No matching scripts found.</p>';
            return;
        }

        // Dynamically calculates your site's domain base path to avoid hardcoded domain strings
        const currentUrl = new URL(window.location.href);
        const baseUrl = currentUrl.origin + currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/') + 1);
        const liveSiteJsonUrl = baseUrl + 'posts.json';

        scriptsToDisplay.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // High-compatibility execution macro targeting your own site domain mapping
            const loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${liveSiteJsonUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

        // Interactive click event handlers for clipboard copying
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

    // Dynamic UI Filtering Input Listeners
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
