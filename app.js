document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');

    fetch('./posts.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not find or read posts.json");
            return response.json();
        })
        .then(savedScripts => {
            renderScripts(savedScripts);
        })
        .catch(err => {
            console.error(err);
            scriptsContainer.innerHTML = `<p style="color: #ff7b72; padding: 20px;">Error loading posts.json file data.</p>`;
        });

    function renderScripts(savedScripts) {
        scriptsContainer.innerHTML = '';

        if (!savedScripts || savedScripts.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted);">No entries found inside posts.json.</p>';
            return;
        }

        // Calculate your live GitHub raw assets folder path dynamically
        const currentUrl = new URL(window.location.href);
        let rawBaseUrl = '';

        if (currentUrl.hostname.includes('github.io')) {
            const user = currentUrl.hostname.split('.')[0];
            const repo = currentUrl.pathname.split('/').filter(Boolean)[0];
            rawBaseUrl = `https://githubusercontent.com{user}/${repo}/main/`;
        } else {
            // Local fallback directory mapping if testing locally
            rawBaseUrl = currentUrl.origin + currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/') + 1);
        }

        savedScripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // GENERATES FLAWLESS COMPATIBLE LUA FOR EXECUTORS:
            // Packs your base repo path variable and fires the clean raw.lua router script 
            const loadstringText = `_G.ScriptHubBaseUrl = "${rawBaseUrl}" loadstring(game:HttpGet("${rawBaseUrl}raw.lua"))()("${script.id}")`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

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
