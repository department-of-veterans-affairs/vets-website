# Environment Guard

## Session Check First — Skip if Already Verified

**Before running any checks**, read `tmp/copilot-session/session.json` if it exists.

If `session.json` contains:
```json
"environment_check": {
  "passed": true,
  "checked_at": "..."
}
```

✅ **SKIP ALL CHECKS** — Output: "Environment previously verified at {checked_at}" and continue.

If `environment_check.passed` is `false`, missing, or session doesn't exist → Run full checks below.

---

## Required Checks - ⛔ **CRITICAL** that each succeeds

Execute ALL THREE checks below. Each check has ONE acceptable method.

> ⚠️ **IMPORTANT**: You MUST actually execute each check. There are only two valid statuses:
> - ✅ **PASS** — Tool call succeeded with expected response
> - ❌ **FAIL** — Tool call failed, errored, skipped, or not attempted
>
> **"N/A", "skipped", "not available", or "assumed" are NOT valid statuses — these are all FAIL.**

### 1. GitHub MCP Server — MANDATORY TOOL CALL
```
mcp_github_get_me
```
✅ Pass: Returns JSON with `login` field
❌ Fail: Tool not available, returns error, missing `login` field, **or not attempted**

### 2. Cypress MCP Server — MANDATORY TOOL CALL
```
mcp_cypress-scree_list_test_screenshots
```
✅ Pass: Returns object with `screenshots` array (or `total` field)
❌ Fail: Tool not available, returns error, missing expected fields, **or not attempted**

### 3. gh CLI — MANDATORY COMMAND
```bash
gh auth status
```
✅ Pass: Exit code 0
❌ Fail: Command not found, exit code non-zero, not authenticated, **or not attempted**

## ⛔ CHECKPOINT — Report Results

**You MUST fill in this table after attempting each check. No blank cells allowed.**

| Check | Status | Tool/Command Used | Result |
|-------|--------|-------------------|--------|
| GitHub MCP | ✅/❌ | `mcp_github_get_me` (REQUIRED) | {actual response or error} |
| Cypress MCP | ✅/❌ | `mcp_cypress-scree_list_test_screenshots` (REQUIRED) | {actual response or error} |
| gh CLI | ✅/❌ | `gh auth status` (REQUIRED) | {actual output or error} |

## ⛔ STOP EXECUTION IF ANY CHECK IS ❌

**All three checks must show ✅ to proceed. Any ❌ = HALT and inform user.**

---

## Save Results to Session

After checks pass, update `tmp/copilot-session/session.json` with:
```json
"environment_check": {
  "passed": true,
  "checked_at": "{ISO timestamp}",
  "github_mcp": { "status": "pass", "login": "{login}" },
  "cypress_mcp": { "status": "pass" },
  "gh_cli": { "status": "pass" }
}
```

This allows subsequent agents in the same session to skip re-checking.
