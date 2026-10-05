document.addEventListener('DOMContentLoaded', () => {
    const scriptForm = document.getElementById('script-form');
    const scriptsContainer = document.getElementById('scripts-container');

    // 1. Storage buckets: Load your hardcoded web scripts list, and local browser-added scripts
    let webScripts = [];
    let browserScripts = JSON.parse(localStorage.getItem('rbx_browser_scripts')) || [];

    // Pull configuration details directly from your posted files index
    fetch('posts.json')
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(data => {
            webScripts = data;
            combineAndRender();
        })
        .catch(() => {
            console.warn("Using baseline defaults. Run via GitHub or host for indexing dependencies.");
            // Default baseline if posts.json is not initialized properly yet
            webScripts = [{
                "id": "novaui",
                "title": "NovaUI",
                "content": "loadstring(game:HttpGet(\"https://githubusercontent.com\"))()"
            }];
            combineAndRender();
        });

    // Handle incoming browser additions
    scriptForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('script-title').value;
        const content = document.getElementById('script-content').value;
        const id = 'browser_' + Date.now().toString(); // Creates a distinct target namespace

        const newBrowserScript = { id, title, content, isBrowserSaved: true };
        browserScripts.push(newBrowserScript);

        // Store into persistent browser sandbox partition
        localStorage.setItem('rbx_browser_scripts', JSON.stringify(browserScripts));
        
        combineAndRender();
        scriptForm.reset();
    });

    function combineAndRender() {
        // Merge shared list with individual browser inputs seamlessly
        const compiledList = [...webScripts, ...browserScripts];
        renderScripts(compiledList);
    }

    function renderScripts(savedScripts) {
        scriptsContainer.innerHTML = '';

        if (!savedScripts || savedScripts.length === 0) {
            scriptsContainer.innerHTML = '<p style="color: var(--text-muted);">No scripts indexed at this address.</p>';
            return;
        }

        const baseUrl = window.location.href.split('index.html')[0];

        savedScripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';

            let loadstringText = '';

            if (script.isBrowserSaved) {
                // EXECUTOR STRATEGY FOR DIRECT BROWSER STORAGE:
                // Since this data lives inside your local browser memory sandbox instead of GitHub's server files,
                // we convert your raw string code instantly into a direct data-stream variable macro block.
                // This payload works seamlessly in all executors on any network without needing a server endpoint file!
                const safePayload = btoa(unescape(encodeURIComponent(script.content)));
                loadstringText = `loadstring(game:GetService("HttpService"):Base64Decode("${safePayload}"))()`;
            } else {
                // EXECUTOR STRATEGY FOR GITHUB POSTS.JSON STORAGE:
                const rawFileUrl = `${baseUrl}posts.json`;
                loadstringText = `local json = game:GetService("HttpService"):JSONDecode(game:HttpGet("${rawFileUrl}")) for _, s in pairs(json) do if s.id == "${script.id}" then loadstring(s.content)() break end end`;
            }

            card.innerHTML = `
                <h3>${escapeHtml(script.title)} ${script.isBrowserSaved ? '<span class="badge-local">Browser Local</span>' : ''}</h3>
                <div class="script-actions">
                    <button class="btn btn-primary copy-loadstring-btn" data-loadstring="${escapeHtml(loadstringText)}">Copy Loadstring</button>
                    ${script.isBrowserSaved ? `<button class="btn btn-secondary delete-btn" data-id="\${script.id}">Delete</button>` : ''}
                </div>
            `;
            scriptsContainer.appendChild(card);
        });

        // Initialize click tracking to copy code elements 
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

        // Initialize local deletion pathways
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-id');
                browserScripts = browserScripts.filter(s => s.id !== targetId);
                localStorage.setItem('rbx_browser_scripts', JSON.stringify(browserScripts));
                combineAndRender();
            });
        });
    }

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
