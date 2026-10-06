document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');

    // Safe offline dataset matrix for local desktop troubleshooting fallback scenarios
    const repositoryManifest = [
        {
            "id": "novaui",
            "title": "NovaUI"
        },
        {
            "id": "zurai-hub",
            "title": "Zurai-hub"
        }
    ];

    // Natively fetch target list profiles
    fetch('./posts.json')
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(savedScripts => {
            renderScripts(savedScripts);
        })
        .catch(() => {
            console.warn("Using offline fallback engine layout matrix.");
            renderScripts(repositoryManifest);
        });

    function renderScripts(savedScripts) {
        scriptsContainer.innerHTML = '';

        if (!savedScripts || savedScripts.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted);">Empty config mapping detected.</p>';
            return;
        }

        // --- EXECUTOR FIX ROUTING LOGIC ---
        // Translates deployment addresses directly into raw text channels
        let rawFileUrl = '';
        const currentUrl = new URL(window.location.href);

        if (currentUrl.hostname.includes('github.io')) {
            const user = currentUrl.hostname.split('.')[0];
            const repo = currentUrl.pathname.split('/').filter(Boolean)[0];
            rawFileUrl = `https://githubusercontent.com{user}/${repo}/main/posts.json`;
        } else {
            // Local fallback routing if running on localhost / test directories
            rawFileUrl = currentUrl.origin + currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/') + 1) + 'posts.json';
        }

        savedScripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            // Flawless JSON data mapping loop built explicitly for Roblox executors
            const loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${rawFileUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;

            card.innerHTML = `
                <h3>${escapeHtml(script.title)}</h3>
                <button class="copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
            `;
            scriptsContainer.appendChild(card);
        });

        // Setup copy logic interaction bindings
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
