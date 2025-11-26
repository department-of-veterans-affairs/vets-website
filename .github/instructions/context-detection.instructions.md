---
applyTo: "**"
description: "Automatically build context for the specific directory you're working in"
---

# Context Detection for Universal Agents

This document provides reusable context detection logic that all agents should execute before performing their main duties. This enables agents to work across any application in the vets-website monorepo.

---

## Context Discovery Workflow

All agents should execute this workflow at the start of each session to automatically determine which application they're working with. **Note**: GitHub Copilot automatically loads instruction files based on `applyTo` frontmatter, so agents don't need to manually load instructions - they're already in context.

### Step 1: Gather Context Signals

Collect information from multiple sources to identify the working context:

#### A. From GitHub Ticket (if provided)
- Extract owner/repo/number from URL
- Use GitHub MCP tools to fetch ticket details
- Look for application indicators in:
  - **Labels**: `mhv-secure-messaging`, `claims-status`, `my-health-*`
  - **Title**: Application name or path references
  - **Body/Description**: File path mentions (e.g., `src/applications/mhv-secure-messaging`)
  - **Comments**: Developer discussions mentioning specific apps

#### B. From Git Changes
```bash
# Get list of modified files
git diff --name-only main...HEAD

# Extract application paths
git diff --name-only main...HEAD | grep "^src/applications/" | head -5

# Pattern match: src/applications/{app-name}/
```

#### C. From Current Editor Context
- Check currently open file path
- Look for workspace root context
- Identify recent file edits in workspace

#### D. From Conversation History
- Review previous messages for application mentions
- Check if user explicitly stated application name
- Look for file paths referenced in conversation

### Step 2: Parse Application Path

Once you have context signals, extract the application identifier:

```
Pattern: src/applications/{APPLICATION_ID}/

Examples:
- src/applications/mhv-secure-messaging/components/ComposeForm.jsx
  → APPLICATION_ID = "mhv-secure-messaging"

- src/applications/claims-status/actions/index.js
  → APPLICATION_ID = "claims-status"

- src/applications/edu-benefits/1990/config/form.js
  → APPLICATION_ID = "edu-benefits/1990"
```

**Variables to extract:**
- `APPLICATION_ID`: The directory name under `src/applications/`
- `APPLICATION_PATH`: Full path `src/applications/{APPLICATION_ID}`
- `APPLICATION_NAME`: Human-readable name (from manifest.json or inferred)

### Step 3: Load Application Instructions

**Note**: GitHub Copilot automatically loads instruction files based on `applyTo` frontmatter when working in matching paths. Agents don't need to manually load instructions - they're already in context.

**Verification Process:**
1. **Check if instruction file exists** using `file_search` tool
2. **Confirm Copilot loading** - instructions are automatically available when working in `{APPLICATION_PATH}`
3. **Reference loaded instructions** throughout workflow

**Instruction Loading Priority (handled automatically by Copilot):**
1. **App-Specific**: `.github/instructions/{app-id}.instructions.md` (highest priority)
2. **General VA**: `.github/copilot-instructions.md` (fallback)

**If no app-specific instructions exist:**
```
⚠️ No app-specific instructions found for {APPLICATION_NAME}
- Copilot will use general VA patterns from .github/copilot-instructions.md
- Consider creating {INSTRUCTION_FILE} using .github/instructions/_template.instructions.md
```

### Step 4: Confirm with User

After detecting context, **always confirm** before proceeding:

```
✅ Context Detected:
- Application: {APPLICATION_NAME}
- Path: {APPLICATION_PATH}
- Instructions: Automatically loaded by Copilot (applyTo: "{APPLICATION_PATH}")

Ready to proceed with {APPLICATION_NAME} context.
Is this correct, or would you like to specify a different application?
```

**If ambiguous or no context found:**
```
❓ Context Unclear

I couldn't automatically detect which application you're working on.
Please specify:
1. The application name (e.g., "mhv-secure-messaging", "claims-status")
2. Or provide a GitHub ticket URL
3. Or specify a file path you're working with

I can work with any application in src/applications/
```

### Step 5: Verify Instruction Availability

Since Copilot automatically loads instructions, verify they're available:

1. **Check instruction file exists** (for reference purposes)
2. **Assume instructions are loaded** when working in application paths
3. **Reference patterns throughout workflow** - they're already in context
4. **Use fallback patterns** if no app-specific instructions exist

**Success confirmation:**
```
✅ Context Established:
- Application: {APPLICATION_NAME}
- Instructions: Automatically loaded by Copilot
- Ready to proceed with application-specific patterns
```

---

## Implementation for Each Agent

### For Spec_Builder

```markdown
### Context Discovery (Execute First)

**Step 0: Request GitHub Ticket**
If no ticket provided: "Please provide the GitHub ticket URL you'd like me to analyze."

**Step 1: Fetch and Analyze Ticket**
- Use GitHub MCP tools to read issue/PR
- Extract application context from labels, paths, or description
- Look for patterns: src/applications/{app-name}

**Step 2: Confirm Context**
"Working on **{APPLICATION_NAME}** (`{APPLICATION_PATH}`)
Instructions automatically loaded by Copilot."

**Step 3: Proceed with Spec Building**
Reference loaded instructions throughout workflow (already in context)
```

### For Feature_Implementer

```markdown
### Context Discovery (Execute First)

**Step 1: Detect Application from Spec**
- Check spec/ticket for application references
- Look at git changes: `git diff --name-only`
- Check current editor files

**Step 2: Confirm Context**
"Implementing for **{APPLICATION_NAME}**
Instructions automatically loaded by Copilot for {APPLICATION_PATH}"

**Step 3: Implement with Context Variables**
Use {CONSTANTS_PATH}, {API_CLIENT_PATH}, etc. throughout (patterns already in context)
```

### For Test_Engineer

```markdown
### Context Discovery (Execute First)

**Step 1: Detect from Code Changes**
- Analyze which files were modified
- Extract application path from file paths
- Identify test files to update

**Step 2: Confirm Testing Context**
"Testing **{APPLICATION_NAME}**
Framework: {TESTING_FRAMEWORK}
Instructions automatically loaded by Copilot"

**Step 3: Write Tests with Context**
Use application-specific test utilities and patterns (already in context)
```

### For Documentation_Updater

```markdown
### Context Discovery (Execute First)

**Step 1: Detect from Modified Files**
- Analyze git diff to see changed files
- Extract application path
- Identify if instruction file exists

**Step 2: Confirm Update Target**
"Updating documentation for **{APPLICATION_NAME}**
Instructions automatically loaded by Copilot"

**Step 3: Update with Context Awareness**
Follow instruction file structure and patterns (already in context)
```

### For Code_Reviewer

```markdown
### Context Discovery (Execute First)

**Step 1: Detect from Changes**
- Review git diff for changed files
- Identify application(s) affected
- Instructions automatically loaded by Copilot

**Step 2: Confirm Review Scope**
"Reviewing **{APPLICATION_NAME}** changes
Checking against automatically loaded instructions"

**Step 3: Review with Context**
Validate against application-specific patterns (already in context)
```

### For PR_Assistant

```markdown
### Context Discovery (Execute First)

**Step 1: Detect from Branch/Changes**
- Check current branch changes
- Identify affected application(s)
- Instructions automatically loaded by Copilot

**Step 2: Confirm PR Context**
"Preparing PR for **{APPLICATION_NAME}**
Branch: {CURRENT_BRANCH}"

**Step 3: Generate PR with Context**
Include application name in title
Tag appropriate team/reviewers
```

---

## Context Variables Reference

All agents should maintain these variables throughout their session:

| Variable | Description | Example |
|----------|-------------|---------|
| `{APPLICATION_ID}` | Directory name under src/applications | `mhv-secure-messaging` |
| `{APPLICATION_PATH}` | Full path to application | `src/applications/mhv-secure-messaging` |
| `{APPLICATION_NAME}` | Human-readable name | `MHV Secure Messaging` |
| `{INSTRUCTION_FILE}` | Path to instruction file | `.github/instructions/mhv-secure-messaging.instructions.md` |
| `{INSTRUCTION_SOURCE}` | Source of patterns (app-specific or general) | `MHV-specific instructions` or `General VA patterns` |
| `{STATE_NAMESPACE}` | Redux state namespace | `sm`, `claims`, `form` |
| `{CONSTANTS_PATH}` | Path to constants file | `util/constants.js` |
| `{API_CLIENT_PATH}` | Path to API client | `api/SmApi.js` |
| `{TESTING_FRAMEWORK}` | Testing setup | `Mocha/Chai/Sinon`, `Jest`, etc. |

---

## Fallback Strategies

### When No Context Can Be Determined

If after all attempts, context remains unclear:

1. **Ask the user directly**:
   ```
   I need help identifying which application you're working on.
   
   Please provide ONE of:
   - GitHub ticket URL
   - Application name (e.g., "mhv-secure-messaging")
   - File path you're working with
   
   Available applications: [list from src/applications/]
   ```

2. **Offer to list available applications**:
   Use `list_dir` on `src/applications/` to show options

3. **Proceed with general VA patterns**:
   If user wants to continue without specific context, use `.github/copilot-instructions.md`

### When Multiple Applications Detected

If changes span multiple applications:

1. **Ask user to prioritize**:
   ```
   Detected changes in multiple applications:
   - {APP_1}
   - {APP_2}
   
   Which should I focus on first?
   ```

2. **Or handle each separately**:
   Apply appropriate instructions to each application's changes

---

## Quality Checklist

Before proceeding with main agent duties, verify:

- [ ] Application context is identified and confirmed
- [ ] Instruction file is loaded (or fallback is acknowledged)
- [ ] Context variables are extracted and stored
- [ ] User has confirmed the detected context
- [ ] Ready to proceed with application-specific patterns

---

## Notes for Agent Authors

When creating or updating agents:

1. **Always start with context detection** - make it the first step
2. **Use variables throughout** - never hardcode application names or paths
3. **Confirm with user** - don't assume context is correct
4. **Graceful degradation** - work even without specific instructions
5. **Document assumptions** - note when using fallback patterns
6. **Update this guide** - if you discover better detection methods, add them here
