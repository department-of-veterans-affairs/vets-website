```mermaid
flowchart TD
    Start[Agent Activated] --> GH[which gh]
    GH -->|not found| FailGH[❌ gh CLI missing → brew install gh\nor https://cli.github.com]
    GH -->|found| MCP[ls ~/.copilot/mcp-servers/github-mcp-server* 2>/dev/null]
    MCP -->|not found| FailMCP[❌ GitHub MCP server missing → Follow https://docs.github.com/en/copilot/customizing-copilot/using-mcp-servers]
    MCP -->|found| Cypress[test -f .github/mcp-server/cypress-screenshots.js]
    Cypress -->|not found| FailCypress[❌ Cypress MCP server missing → \ncp your/cypress-screenshots.js .github/mcp-server/]
    Cypress -->|found| Ready[✅ All prerequisites ready]
    FailGH & FailMCP & FailCypress --> Stop[Stop and give user the exact command above]
    style Ready fill:#e8f5e9,stroke:#2e7d32
    style FailGH,FailMCP,FailCypress fill:#ffebee,stroke:#c62828
```