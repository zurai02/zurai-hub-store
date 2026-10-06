document.addEventListener('DOMContentLoaded', () => {
    const scriptsContainer = document.getElementById('scripts-container');

    // Fetch scripts natively from posts.json using a safe relative path
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
            scriptsContainer.innerHTML = `
                <div style="color: #ff7b72; padding: 20px; background: #21262d; border-radius: 6px; border: 1px solid #30363d;">
                    <p><strong>Error loading dashboard.</strong></p>
                    <p style="font-size: 0.85rem; color: #8b949e; margin-top: 5px;">
                        If you are opening index.html directly from your computer files, browsers block local JSON files. 
                        <strong>Upload these files to GitHub Pages</strong> and it will instantly work live!
                    </p>
                </div>`;
        });

    function renderScripts(savedScripts) {
        scriptsContainer.innerHTML = '';

        if (!savedScripts || savedScripts.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted);">No entries found inside posts.json.</p>';
            return;
        }

        // Dynamically creates a rock-solid base folder URL without complex splitting logic
        const currentUrl = new URL(window.location.href);
        const baseUrl = currentUrl.origin + currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/') + 1);
        const rawFileUrl = baseUrl + 'posts.json';

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
