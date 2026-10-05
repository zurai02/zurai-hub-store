document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');

    // Hardcoded fallback data so the site renders when opened offline or locally on your desktop
    const localFallbackData = [
        {
            "id": "novaui",
            "title": "NovaUI",
            "content": "loadstring(game:HttpGet(\"https://githubusercontent.com\"))()"
        }
    ];

    // Read scripts directly out of posts.json file
    fetch('posts.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not find posts.json");
            return response.json();
        })
        .then(savedScripts => {
            renderScripts(savedScripts);
        })
        .catch(() => {
            console.warn("Local file reading restricted or posts.json missing. Using local fallback view.");
            renderScripts(localFallbackData);
        });

    function renderScripts(savedScripts) {
        scriptsContainer.innerHTML = '';

        if (!savedScripts || savedScripts.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted);">No scripts found inside posts.json.</p>';
            return;
        }

        // Dynamically identifies your repository web address on GitHub Pages
        const baseUrl = window.location.href.split('index.html')[0];

        savedScripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            const rawFileUrl = `${baseUrl}posts.json`;
            
            // This Lua string handles reading the live JSON data mapping and executing the chosen script content block
            const loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${rawFileUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <div class="script-actions">
                    <button class="btn btn-primary copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
                </div>
            `;
            scriptsContainer.appendChild(card);
        });

        // Initialize click-to-copy interactions
        document.querySelectorAll('.copy-loadstring-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loadstring = e.target.getAttribute('data-loadstring');
                navigator.clipboard.writeText(loadstring).then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = "Copied!";
                    setTimeout(() => { e.target.textContent = originalText; }, 1500);
                }).catch(() => {
                    alert("Copy interaction failed. Make sure your webpage is using HTTPS on GitHub.");
                });
            });
        });
    }

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
