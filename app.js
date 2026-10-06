document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');

    // Natively fetch configuration index from posts.json for user interface rendering
    fetch('./posts.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not read posts.json");
            return response.json();
        })
        .then(savedScripts => {
            renderScripts(savedScripts);
        })
        .catch(err => {
            console.error(err);
            scriptsContainer.innerHTML = `<p style="color: #ff7b72; padding: 20px;">Error loading data map. Ensure posts.json exists and is properly formatted.</p>`;
        });

    function renderScripts(savedScripts) {
        scriptsContainer.innerHTML = '';

        if (!savedScripts || savedScripts.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted);">No entries found inside posts.json.</p>';
            return;
        }

        // Exact locked-in GitHub Raw base URL for absolute execution stability
        const rawGitHubBaseUrl = "https://githubusercontent.com";

        savedScripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // High-compatibility, short execution script for your Roblox executor
            const loadstringText = `loadstring(game:HttpGet("${rawGitHubBaseUrl}raw.lua"))()("${script.id}")`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

        // Set up click interactive copy listener
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
