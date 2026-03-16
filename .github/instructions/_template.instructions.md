---
applyTo: "src/applications/{app-name}"
description: "Application-specific patterns and conventions for {Application Name}"
---
<!-- 
Template for creating application-specific instruction files
Category: {category-name} (e.g., my-health, benefits, forms)
-->

# {Application Name} Instructions

> **Purpose**: This instruction file provides application-specific patterns, conventions, and business rules for **{Application Name}** in the vets-website monorepo. It supplements the general VA patterns in `.github/copilot-instructions.md`.

## 🔄 Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to this application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New paths, error messages, alerts, or configuration
- **Create new helper functions**: New utilities in utility files
- **Implement new business rules**: Domain-specific validation, workflow restrictions, etc.
- **Add new action types or actions**: New Redux actions or state management patterns
- **Create new reducers or modify state shape**: Changes to Redux state structure
- **Add new shared components**: New reusable components
- **Implement new feature flags**: New feature toggles that affect application behavior
- **Add new API endpoints**: New API client functions
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new error codes**: New backend error codes and their handling
- **Modify component patterns**: New web component usage patterns or validation approaches
- **Update navigation structure**: New routes or path handling

### How to Update These Instructions
1. **Locate the relevant section**: Find the section that relates to your change
2. **Add or update documentation**: Include function signatures, parameters, return types, and usage examples
3. **Update examples**: Ensure code examples reflect the new patterns
4. **Mark critical items**: Use **CRITICAL** marker for security-sensitive or business-critical information
5. **Update anti-patterns**: Add new "what NOT to do" items if relevant
6. **Keep it concise**: Focus on practical guidance that helps future development

### Documentation Standards
- Use clear, concise language
- Include code examples for complex patterns
- Document the "why" behind business rules
- Link related concepts (e.g., "see Helper Functions section")
- Use consistent formatting (bullet points, code blocks, headers)
- Mark breaking changes or deprecations clearly

## Application Overview
- **Entry Name**: `{entry-name}` (from manifest.json)
- **Root URL**: `/{root-path}`
- **Entry File**: `{app-entry-file.jsx}`
- **Purpose**: [Brief description of what this application does for veterans]

## Architecture & State Management

### Redux Structure
- **Root reducer**: [Describe where reducer is located and namespace]
- **Reducer modules**: [List key reducers]
- **Action types**: [Where action types are centralized]
- **Selectors**: [Where selectors are defined]
- **State access pattern**: [How to access this app's state, e.g., `state.{namespace}`]

### API Layer
- **Backend Service**: [Which backend service this uses - vets-api, lighthouse, etc.]
- **API client**: [Path to API client file]
- **Base path**: [API base URL or path pattern]
- **API utilities**: [Any app-specific API utilities]
- **Mock responses**: [Location of mock data for development]

## Constants & Configuration

### Core Constants
- **Location**: [Where constants are defined, e.g., `util/constants.js`]
- **Paths**: [Route path constants]
- **Error Messages**: [Error message organization]
- **Alerts**: [Alert configurations]
- **[Other Constants]**: [Application-specific constant groups]

### Helper Functions
- **Location**: [Where helper functions are defined, e.g., `util/helpers.js`]
- **[Category of Helpers]**: 
  - `functionName(params)`: Description and usage
  - Include examples for complex helpers

## Business Logic & Requirements

### [Primary Business Rule/Workflow]
- **Rule**: [Clear statement of the business rule]
- **Implementation**: [How it's implemented in code]
- **UI Impact**: [How it affects the user interface]
- **Validation**: [How it's validated]

### [Secondary Business Rule/Workflow]
[Follow same pattern as above]

## Component Patterns

### Web Components
- **VA Design System Components**: [Which web components are commonly used]
- **Event Handling**: [Application-specific event handling patterns]
- **Error Handling**: [How errors are displayed in components]

### Form Validation
- **Validation Rules**: [Common validation patterns]
- **Validation Timing**: [When validation runs]
- **Error Display**: [How errors are shown to users]

### Container Components
- [Describe container component patterns]
- Key containers: [List important container components]

### Custom Hooks
- [List and describe custom hooks used in the application]

## Testing Patterns

### Unit Tests
- **Testing Framework**: [Mocha/Chai/Sinon, Jest, etc.]
- **Test Utilities**: [Application-specific test utilities]
- **Rendering**: [How to render components in tests]
- **Store Setup**: [How to set up Redux store for tests]
- **Fixtures**: [Where test fixtures are located]
- **Mocking & Stubbing**: [Common mocking patterns]

### E2E Tests (Cypress)
- **Page Objects Pattern**: [Location and usage of page objects]
- **Test Site Setup**: [How to set up test environment]
- **Constants**: [Where E2E constants are defined]
- **Fixtures**: [Where E2E fixtures are located]
- **Accessibility Testing**: [How accessibility is tested]

## Common Patterns & Best Practices

### Action Creators
[Common action creator patterns with examples]

### State Management Details
[Redux state shape and common patterns]

### Feature Flags
[How feature flags are used in this application]

### Analytics & Monitoring
[Analytics tracking patterns - GA, Datadog, etc.]

## Import Patterns & Module Resolution

### Platform Utilities
[Common platform imports used in this application]

### Component Library Imports
[Common component library imports]

### Local Module Patterns
[How local modules are imported]

## Common Pitfalls & Anti-patterns

### What NOT to Do
- ❌ [Anti-pattern 1 with explanation]
- ❌ [Anti-pattern 2 with explanation]
- ❌ [Continue listing common mistakes]

### Performance Considerations
- ✅ [Performance best practice 1]
- ✅ [Performance best practice 2]

### Memory Leak Prevention
- ✅ [Memory management best practice 1]
- ✅ [Memory management best practice 2]

## Error Handling Patterns

### Error Codes & Responses
[Application-specific error codes and how they're handled]

### Error Handling in Actions
[Common error handling patterns with examples]

## Quick Reference Examples

### Creating a New Action
```javascript
// Example action creator pattern
```

### Form Validation Pattern
```javascript
// Example validation pattern
```

### Using Web Components
```jsx
// Example web component usage
```

## Troubleshooting Common Issues

### [Common Issue 1]
- **Symptom**: [What the developer sees]
- **Cause**: [Why it happens]
- **Solution**: [How to fix it]
- **See**: [Related sections]

### [Common Issue 2]
[Follow same pattern]

---

## 📝 Instruction Authoring Notes

**For teams creating new instruction files:**

1. **Copy this template** to `.github/instructions/{your-app-name}.instructions.md`
2. **Update frontmatter** with correct `applyTo` path and category
3. **Fill in all sections** - remove sections that don't apply, add new ones as needed
4. **Provide examples** - code examples are more valuable than descriptions
5. **Explain the why** - don't just list patterns, explain their purpose
6. **Mark critical items** - use **CRITICAL** for security/business-critical patterns
7. **Keep it current** - update as the application evolves
8. **Cross-reference** - link to related sections and parent instructions

**Quality checklist:**
- [ ] All placeholders {like-this} are replaced
- [ ] Code examples are tested and accurate
- [ ] Business rules are clearly explained
- [ ] Anti-patterns section includes real mistakes from code reviews
- [ ] Testing patterns match actual test files
- [ ] Constants and helpers are documented with signatures
- [ ] Error handling patterns include specific error codes
- [ ] Self-maintenance section is customized for this application
