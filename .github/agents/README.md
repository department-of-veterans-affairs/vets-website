# Custom Agents for vets-website

This directory contains custom AI agents for VS Code Copilot that provide specialized development workflows for the vets-website monorepo.

## 📁 File Structure

```
.github/
├── agents/               # Custom agent definitions
│   ├── *.agent.md       # Agent files (detected automatically by VS Code)
│   └── README.md        # This file
└── instructions/        # Application-specific instruction files
    └── *.instructions.md # Pattern files (auto-loaded based on applyTo)
```

## 🤖 Available Agents

| Agent | Purpose | Key Tools |
|-------|---------|-----------|
| **Spec_Builder** | Transform GitHub tickets into implementation specs | GitHub MCP, search, fetch |
| **Feature_Implementer** | Implement features following app-specific patterns | Edit, GitHub MCP, problems |
| **Test_Engineer** | Write comprehensive unit and E2E tests | Edit, runCommands, testFailure |
| **Code_Reviewer** | Review code against VA standards and app patterns | Search, usages, problems |
| **Documentation_Updater** | Update instruction files when patterns change | Edit, search, changes |
| **PR_Assistant** | Create context-aware pull requests | GitHub MCP, changes |

## 🔄 Agent Workflow (Handoffs)

Agents support seamless transitions through handoffs:

```
Spec_Builder
  ↓ (Begin Implementation)
Feature_Implementer
  ↓ (Evaluate Tests)
Test_Engineer
  ↓ (Review Code Quality)
Code_Reviewer
  ↓ (Document Changes)
Documentation_Updater
  ↓ (Build PR)
PR_Assistant
```

## 📝 Agent File Format

Agent files use the `.agent.md` extension and follow this structure:

```markdown
---
name: Agent_Name             # No spaces allowed, use underscores
description: Brief purpose
tools: ['tool1', 'tool2/*']  # Available tools
handoffs:                    # Optional workflow transitions
  - label: Next Step
    agent: Target_Agent      # Must match actual agent name
    prompt: Pre-filled prompt for next agent
    send: false              # Set to true to auto-submit
---

# Agent Instructions

Your agent's system prompt and instructions go here in Markdown format.
Can reference instruction files, context variables, etc.
```

## 🎯 Key Conventions

### Agent Names
- **Format**: `Agent_Name` (underscores, no spaces)
- **Matching**: Handoff `agent` field must match the exact `name` in target agent's frontmatter
- **Case-sensitive**: `Feature_Implementer` ≠ `feature_implementer`

### Tools
- **Wildcards**: Use `github/github-mcp-server/*` to include all tools from an MCP server
- **Specific**: Or list specific tools like `github/github-mcp-server/issue_read`
- **Built-in**: Tools like `search`, `edit`, `usages` are always available

### Handoffs
- **send: false** (recommended): User reviews prompt before submitting
- **send: true**: Auto-submit for seamless transitions (use sparingly)
- **prompt**: Can reference context from previous agent's work

## 🔗 Integration with Instructions

Agents work with application-specific instruction files:

1. **Instructions** (`.github/instructions/*.instructions.md`):
   - Auto-loaded by Copilot based on `applyTo` glob patterns
   - Provide technical patterns, constants, business rules
   - Example: `mhv-secure-messaging.instructions.md` auto-loads when working in `src/applications/mhv-secure-messaging/`

2. **Agents** (`.github/agents/*.agent.md`):
   - Manually selected from agent dropdown
   - Define AI personas and available tools
   - Reference loaded instructions in their workflows

### Context Detection

All agents follow a context discovery workflow defined in `_context-detection.md`:

1. **Detect Application**: From git changes, file paths, or GitHub tickets
2. **Verify Instructions**: Confirm app-specific instructions are loaded
3. **Extract Variables**: Set `{APPLICATION_NAME}`, `{APPLICATION_PATH}`, etc.
4. **Proceed**: Use context throughout workflow

## 🚀 Usage

### Selecting an Agent

1. Open VS Code Copilot Chat
2. Click the agent dropdown (default shows `@workspace`)
3. Select your custom agent (e.g., `@Spec_Builder`)
4. Start chatting with that agent's specialized context

### Using Handoffs

1. Complete work with current agent
2. Agent response includes handoff buttons (e.g., "Begin Implementation")
3. Click handoff button to switch agents
4. Review pre-filled prompt, optionally edit, then send

### Creating New Agents

1. Run `Chat: New Custom Agent` from Command Palette
2. Choose "Workspace" location (`.github/agents/`)
3. Name your agent file (e.g., `my_agent.agent.md`)
4. Fill in frontmatter and instructions
5. Agent appears in dropdown automatically

## 📚 Documentation References

- [VS Code Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Chat Tools](https://code.visualstudio.com/docs/copilot/chat/chat-tools)

## 🛠️ Troubleshooting

### Agent not appearing in dropdown
- Verify file has `.agent.md` extension
- Check frontmatter YAML is valid
- Ensure file is in `.github/agents/` directory

### Handoff fails
- Verify target agent name matches exactly (case-sensitive)
- Check target agent file exists and is valid
- Confirm target agent is visible in agent dropdown

### Instructions not loaded
- Instruction files (`.instructions.md`) auto-load based on file path
- Check `applyTo` pattern matches your current file
- Instructions files are separate from agent files

## 🔄 Maintenance

When updating agents:
- Keep handoff chains consistent
- Update this README when adding/removing agents
- Test handoff workflows after agent changes
- Follow naming conventions (underscores, no spaces)
- Document new context variables or patterns
