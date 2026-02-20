```mermaid
flowchart TB
    subgraph "CRITICAL Gates – Block Merge If Failed"
    A[Change] --> H{Hardcoded string?}
    H -->|Yes| B1[→ Use Paths/Alerts/ErrorMessages]
    H -->|No| P{PII no mask?}
    P -->|Yes| B2[→ data-dd-privacy="mask"]
    P -->|No| W{onChange on web component?}
    W -->|Yes| B3[→ Use onInput/custom events]
    W -->|No| D{Draft saves attachment/sig?}
    D -->|Yes| B4[→ FORBIDDEN]
    D -->|No| S{Missing 45-day check?}
    S -->|Yes| B5[→ Use isOlderThan util]
    S -->|No| PASS[✅ Compliant]
    end
    style B1,B2,B3,B4,B5 fill:#ffcdd2,stroke:#c62828
    style PASS fill:#c8e6c9,stroke:#2e7d32
```
