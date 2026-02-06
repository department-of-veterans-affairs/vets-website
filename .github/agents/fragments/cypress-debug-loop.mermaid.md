```mermaid
flowchart TD
    Fail[E2E Failure Detected] --> A[Call cypress-screenshots/analyze_latest_failures]
    A --> B{Recent Failures Found?}
    B -->|Yes| C[Get top 3 → get_screenshot each]
    C --> D[View images + extract test names/spec files]
    D --> E[Correlate with code changes]
    E --> F[Diagnose root cause (UI text, selector, timing, data)]
    F --> G[Propose precise fix + file/line]
    G --> H[Return to Implementer with diff]
    style Fail fill:#ffebee,stroke:#c62828
    style H fill:#e8f5e9,stroke:#2e7d32
```
