## CD Failure Notifications – Test Playbook


1) Rejected (deny approval)
- Expected Slack: Red message: "Deployment for <APP> was rejected … Commit: <SHA> … run link"


2) Expired-like (cancel while pending)
- Expected Slack: Yellow message: "expired without approval … Commit … run link"


3) Cancelled during execution (approve, then cancel)
- Expected Slack: Gray message: "cancelled during execution … Commit … run link"


4) Error during run (force_fail)
Approve and let the dry-run step fail explicitly with `force_fail=true` (safe; no S3 writes).
- Expected Slack: Red message: "failed due to a code or system error … Commit … run link"

