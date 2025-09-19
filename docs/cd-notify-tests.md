## CD Failure Notifications – Test Playbook

This guide runs four safe simulations on the test branch without touching production deploys. The workflow supports workflow_dispatch inputs and a dry-run mode.

Prereqs
- Installed GitHub CLI (`gh`) and authenticated
- Test branch exists on GitHub: `cd-notify-tests` (created off the feature branch)
- Slack channel for tests: `C06JM7UUHE3`

Best order to run
1. Rejected
2. Expired (cancel while pending)
3. Cancelled during execution (approve, then cancel)
4. Error during run (force_fail)

Common variables (copy/paste once per shell session)
```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
BRANCH=cd-notify-tests
APP=third-party-app-directory
CH=C06JM7UUHE3
SHA=$(git rev-parse $BRANCH)
```

Simulation 1 – Rejected (deny approval)
- Workflow: Continuous Deploy Production
- Where to act: Run page → Environments banner → Review deployments → Reject
- When to act: As soon as the run shows “Review deployments” (before any jobs start beyond Notify of Pending Deployment)
- Expected Slack: Red message: “Deployment for <APP> was rejected … Commit: <SHA> … run link”
- Expected jobs: `Notify of Pending Deployment` succeeds; `Deploy` never starts; `Notify Failure` runs
```bash
# Trigger run in dry-run mode
gh workflow run "Continuous Deploy Production" --ref $BRANCH \
  -f github_sha=$SHA -f entry_app=$APP -f slack_channel=$CH -f dry_run_cd=true
# Capture run id and open the run
RUN_ID=$(gh run list --workflow "Continuous Deploy Production" --json databaseId,headBranch -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1)
open https://github.com/$REPO/actions/runs/$RUN_ID
# ACTION IN UI: Click “Review deployments” → Reject → Confirm
```

Simulation 2 – Expired (cancel while pending approval)
- Workflow: Continuous Deploy Production
- Where to act: CLI cancels the run; do NOT approve
- When to act: While the run still shows “Review deployments” (no `Deploy` job yet)
- Expected Slack: Yellow message: “expired without approval … Commit: <SHA> … run link”
- Expected jobs: `Notify of Pending Deployment` succeeds; `Deploy` never starts; `Notify Failure` runs
```bash
# Trigger run in dry-run mode and cancel before approval
gh workflow run "Continuous Deploy Production" --ref $BRANCH \
  -f github_sha=$SHA -f entry_app=$APP -f slack_channel=$CH -f dry_run_cd=true
RUN_ID=$(gh run list --workflow "Continuous Deploy Production" --json databaseId,headBranch -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1)
# Cancel while pending approval
gh run cancel $RUN_ID
open https://github.com/$REPO/actions/runs/$RUN_ID
```

Simulation 3 – Cancelled during execution (approve, then cancel)
- Workflow: Continuous Deploy Production
- Where to act: First approve; then cancel via CLI when the `deploy` job is running its "Dry run (no deploy executed)" step
- When to act: After approval and after you see Jobs → `Deploy` → step “Dry run (no deploy executed)”
- Expected Slack: Gray message: “cancelled during execution … Commit: <SHA> … run link”
- Expected jobs: `Deploy` starts (shows “Mark job started” then “Dry run (no deploy executed)”); you cancel; `Notify Failure` runs
```bash
# Trigger run in dry-run mode
gh workflow run "Continuous Deploy Production" --ref $BRANCH \
  -f github_sha=$SHA -f entry_app=$APP -f slack_channel=$CH -f dry_run_cd=true
RUN_ID=$(gh run list --workflow "Continuous Deploy Production" --json databaseId,headBranch -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1)
open https://github.com/$REPO/actions/runs/$RUN_ID
# ACTION IN UI: Click “Review deployments” → Approve → Confirm
# Wait until Jobs shows: Deploy → step “Dry run (no deploy executed)”
# Then cancel the run
gh run cancel $RUN_ID
```

Simulation 4 – Error during run (force_fail)
- Workflow: Continuous Deploy Production
- Where to act: Approve; the job will fail itself (test-only) during the dry-run path
- When to act: Approve when prompted; no manual cancel needed
- Expected Slack: Red message: “failed due to a code or system error … Commit: <SHA> … run link”
- Expected jobs: `Deploy` starts (shows “Mark job started”, “Dry run (no deploy executed)”, then “Force failure (test-only)” fails); `Notify Failure` runs
```bash
# Trigger run in dry-run with forced failure
gh workflow run "Continuous Deploy Production" --ref $BRANCH \
  -f github_sha=$SHA -f entry_app=$APP -f slack_channel=$CH -f dry_run_cd=true -f force_fail=true
RUN_ID=$(gh run list --workflow "Continuous Deploy Production" --json databaseId,headBranch -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1)
open https://github.com/$REPO/actions/runs/$RUN_ID
# ACTION IN UI: Click “Review deployments” → Approve → Confirm
```

What to watch for
- GitHub run page: environment approval banner; jobs/steps named here appear exactly in the UI
- Slack channel `C06JM7UUHE3`: exactly one message per run with app name, commit SHA, and run link; colors: red (rejected/error), yellow (expired), gray (cancelled during execution)

Notes
- All commands operate against the `cd-notify-tests` branch only
- Dry run ensures no S3 writes; `force_fail` fails a harmless step
- Use your browser’s back button to return from the run details to approve/reject additional tests

