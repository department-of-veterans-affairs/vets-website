# Environment Guard

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
mcp_cypress-scree_search_screenshots with query: "test"
```
✅ Pass: Returns object with `results` array
❌ Fail: Tool not available, returns error, missing `results` array, **or not attempted**

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
| Cypress MCP | ✅/❌ | `mcp_cypress-scree_search_screenshots` (REQUIRED) | {actual response or error} |
| gh CLI | ✅/❌ | `gh auth status` (REQUIRED) | {actual output or error} |

## ⛔ STOP EXECUTION IF ANY CHECK IS ❌

**All three checks must show ✅ to proceed. Any ❌ = HALT and inform user.**
