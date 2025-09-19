## CD Failure Notifications – Test Playbook

This guide runs four safe simulations on the test branch without touching production deploys. The workflow supports workflow_dispatch inputs and a dry-run mode.

Prereqs
- Installed GitHub CLI (`gh`) and authenticated
- You are on the `cd-notify-tests` branch in GitHub (created off the feature branch)
- Slack channel for tests: `C06JM7UUHE3`

Common variables
```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
BRANCH=cd-notify-tests
APP=third-party-app-directory
CH=C06JM7UUHE3
SHA=$(git rev-parse $BRANCH)
```

1) Rejected (deny approval)
- What this does: Triggers the CD workflow on the test branch in dry-run; you manually reject the environment approval.
- Expected Slack: Red message: "Deployment for <APP> was rejected … Commit: <SHA> … run link"
```bash
gh workflow run "Continuous Deploy Production" --ref $BRANCH \
  -f github_sha=$SHA -f entry_app=$APP -f slack_channel=$CH -f dry_run_cd=true
RUN_ID=$(gh run list --workflow "Continuous Deploy Production" --json databaseId,headBranch -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1)
open https://github.com/$REPO/actions/runs/$RUN_ID
# In GitHub → Review deployments → Reject
```

2) Expired-like (cancel while pending)
- What this does: Triggers in dry-run and cancels before approval.
- Expected Slack: Yellow message: "expired without approval … Commit … run link"
```bash
gh workflow run "Continuous Deploy Production" --ref $BRANCH \
  -f github_sha=$SHA -f entry_app=$APP -f slack_channel=$CH -f dry_run_cd=true
RUN_ID=$(gh run list --workflow "Continuous Deploy Production" --json databaseId,headBranch -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1)
gh run cancel $RUN_ID
```

3) Cancelled during execution (approve, then cancel)
- What this does: Approve so the job starts; then cancel while the "Dry run (no deploy executed)" step is running.
- Expected Slack: Gray message: "cancelled during execution … Commit … run link"
```bash
gh workflow run "Continuous Deploy Production" --ref $BRANCH \
  -f github_sha=$SHA -f entry_app=$APP -f slack_channel=$CH -f dry_run_cd=true
RUN_ID=$(gh run list --workflow "Continuous Deploy Production" --json databaseId,headBranch -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1)
open https://github.com/$REPO/actions/runs/$RUN_ID
# In GitHub → Review deployments → Approve
# When the job shows "Dry run (no deploy executed)", run:
gh run cancel $RUN_ID
```

4) Error during run (force_fail)
- What this does: Approve and let the dry-run step fail explicitly with `force_fail=true` (safe; no S3 writes).
- Expected Slack: Red message: "failed due to a code or system error … Commit … run link"
```bash
gh workflow run "Continuous Deploy Production" --ref $BRANCH \
  -f github_sha=$SHA -f entry_app=$APP -f slack_channel=$CH -f dry_run_cd=true -f force_fail=true
RUN_ID=$(gh run list --workflow "Continuous Deploy Production" --json databaseId,headBranch -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1)
open https://github.com/$REPO/actions/runs/$RUN_ID
# In GitHub → Review deployments → Approve
```

What to watch for
- GitHub: Environment approval prompts on the run
- Slack: A single message per run in `C06JM7UUHE3` with app name, commit SHA, and run link

Cleanup
- Delete the test runs from Actions if desired
- Leave the test branch until you are done validating

