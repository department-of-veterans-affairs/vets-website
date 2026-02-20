```mermaid
flowchart TD
    Start[PR Context Detected] --> Fetch[github-mcp: pull_request_read]
    Fetch --> Branch[Extract head branch name & repo]
    Branch --> Current[run: git fetch origin {branch}:{branch}]
    Current --> Checkout[run: git checkout {branch}]
    Checkout --> Switch[run: git switch {branch} || true]
    Switch --> Pull[run: git pull --ff-only]
    Pull --> Ready[✅ On correct branch, code is local]
    style Ready fill:#e8f5e9,stroke:#2e7d32
```
