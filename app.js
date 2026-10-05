document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');

    // Hardcoded fallback data so your site works perfectly offline or locally on your PC
    const localFallbackData = [
        {
            "id": "novaui",
            "title": "NovaUI",
            "content": "loadstring(game:HttpGet(\"https://githubusercontent.com\"))()"
        }
    ];

    // Attempt to fetch from your store.json file
    fetch('store.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not load store.json file.");
            return response.json();
        })
        .then(savedScripts => {
            renderScripts(savedScripts);
        })
        .catch(err => {
            console.warn("Browser blocked local file read (CORS) or store.json is missing. Using fallback script data.");
            renderScripts(localFallbackData);
        });

    function renderScripts(savedScripts) {
        scriptsContainer.innerHTML = '';

        if (!savedScripts || savedScripts.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted);">No scripts found inside store.json.</p>';
            return;
        }

        // Detects your repository username and path structure dynamically
        const baseUrl = window.location.href.split('index.html')[0];

        savedScripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // Point directly to your online static store json file setup
            const rawFileUrl = `${baseUrl}store.json`;
            
            // This Lua string pulls down the JSON from GitHub and extracts your specific script payload
            const loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${rawFileUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <div class="script-actions">
                    <button class="btn btn-primary copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
                </div>
            `;
            scriptsContainer.appendChild(card);
        });

        // Copy button interactions
        document.querySelectorAll('.copy-loadstring-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loadstring = e.target.getAttribute('data-loadstring');
                navigator.clipboard.writeText(loadstring).then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = "Copied!";
                    setTimeout(() => { e.target.textContent = originalText; }, 1500);
                }).catch(() => {
                    alert("Failed to auto-copy. Make sure you are using a secure connection (HTTPS) or localhost.");
                });
            });
        });
    }

    // Helper to safely parse and escape characters for the UI template
    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
