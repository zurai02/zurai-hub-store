document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');

    // Strict Request Channel: Pull configuration data directly from the network file
    fetch('posts.json')
        .then(response => {
            if (!response.ok) throw new Error("Network data unreadable.");
            return response.json();
        })
        .then(savedScripts => {
            renderScripts(savedScripts);
        })
        .catch(err => {
            scriptsContainer.innerHTML = `<p style="color: #ff7b72;">Error loading dashboard. Make sure posts.json is created and formatted properly.</p>`;
        });

    function renderScripts(savedScripts) {
        scriptsContainer.innerHTML = '';

        if (!savedScripts || savedScripts.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted);">No entries found inside posts.json.</p>';
            return;
        }

        // Dynamically identifies your custom environment or production deployment path
        const baseUrl = window.location.href.split('index.html');
        const rawFileUrl = `${baseUrl}posts.json`;

        savedScripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // High-compatibility Lua query string for Roblox executors
            const loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${rawFileUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

        // Event mappings for clipboard interaction handles
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

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
