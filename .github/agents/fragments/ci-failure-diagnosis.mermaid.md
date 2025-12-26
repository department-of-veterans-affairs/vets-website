```mermaid
flowchart TD
    A[CI Red Detected] --> B[run: gh pr checks {pr} --repo department-of-veterans-affairs/vets-website]
    B --> C{Failed jobs?}
    C -->|Yes| D[Extract run_id from failure URL or run list --status failure]
    D --> E[run: gh run view {run_id} --repo ... → get job IDs]
    E --> F[For each failed job → gh run view --job {job_id} --log-failed]
    F --> G[Exact failing spec file + test name + assertion line appears in output]
    G --> H[Correlate with recent git changes → pinpoint breaking commit]
    style A fill:#ffebee,stroke:#c62828
    style H fill:#e8f5e9,stroke:#2e7d32
```
