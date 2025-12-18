# Environment Guard

**Execute this FIRST before any other agent work. If any check fails → STOP ALL WORK.**

```mermaid
flowchart TD
    Start([🚀 Agent Activated]) --> CheckGH{Test gh CLI}
    
    CheckGH -->|"Run: gh auth status"| GHResult{Exit 0?}
    GHResult -->|Yes| CheckGitHubMCP{Test GitHub MCP}
    GHResult -->|No| HALT_GH_CLI[🚫 HALT - gh CLI not authenticated]
    
    CheckGitHubMCP -->|"Call: mcp_github_get_me"| GitHubResult{Response?}
    GitHubResult -->|Success| CheckCypress{Test Cypress MCP}
    GitHubResult -->|Error| HALT_GH_MCP[🚫 HALT - GitHub MCP unavailable]
    
    CheckCypress -->|"Call: mcp_cypress-scree_search_screenshots"| CypressResult{Response?}
    CypressResult -->|Success| AllReady[✅ All checks passed]
    CypressResult -->|Error| HALT_CY[🚫 HALT - Cypress MCP unavailable]
    
    AllReady --> Continue([Continue to agent workflow])
    HALT_GH_CLI & HALT_GH_MCP & HALT_CY --> STOP([❌ STOP - Do not proceed])

    style AllReady fill:#c8e6c9,stroke:#2e7d32
    style Continue fill:#e8f5e9,stroke:#2e7d32
    style HALT_GH_CLI fill:#b71c1c,stroke:#b71c1c,color:#fff
    style HALT_GH_MCP fill:#b71c1c,stroke:#b71c1c,color:#fff
    style HALT_CY fill:#b71c1c,stroke:#b71c1c,color:#fff
    style STOP fill:#b71c1c,stroke:#b71c1c,color:#fff
```

| Check | Command/Tool | Success |
|-------|--------------|---------|
| gh CLI | `gh auth status` | Exit code 0 |
| GitHub MCP | `mcp_github_get_me` | Returns user login |
| Cypress MCP | `mcp_cypress-scree_search_screenshots` | Returns results array |

---

## ⛔ STOP — Execute the flow above and display results before proceeding

| Check | Status | Result |
|-------|--------|--------|
| gh CLI | ✅/❌ | |
| GitHub MCP | ✅/❌ | |
| Cypress MCP | ✅/❌ | |

**All pass → continue. Any fail → HALT and inform user.**


