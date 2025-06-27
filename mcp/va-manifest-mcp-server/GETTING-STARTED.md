# Getting Started - Real Developer Scenarios 🚀

## Common VA Development Tasks

### 🏗️ Starting a New Form Project

**Scenario**: You're building a new disability compensation form and need to understand the existing patterns.

```
You: "Search for disability forms"
You: "Show me form validation patterns"
You: "Find applications that use the forms-system"
```

This helps you find:
- Similar forms to use as templates
- Validation patterns already in use
- URL structures that follow VA conventions

### 🔍 Finding the Right App to Modify

**Scenario**: You need to add a feature to the "health care application" but don't know where it lives.

```
You: "Search for health care applications"
You: "Get info about the 10-10EZ application"
You: "Show me the manifest for hca"
```

Returns the exact directory path, URL structure, and entry points.

### 📋 Understanding Form Patterns

**Scenario**: You need to implement address validation like other VA forms.

```
You: "Find web component patterns with 'address'"
You: "Search patterns for validation"
You: "Show me form field patterns"
```

Discovers reusable components you can import instead of building from scratch.

### 🔄 Migrating Legacy Forms

**Scenario**: Converting an old form to use the forms-system.

```
You: "Find all applications NOT using forms-system"
You: "Search for legacy form implementations"
You: "Show manifests without formConfig"
```

Identifies forms that need migration and examples of successful migrations.

### 🏥 Adding to an Existing App

**Scenario**: Adding a new section to the disability benefits app.

```
You: "Get application info for disability-benefits"
You: "Show me the routes for 526EZ"
You: "Find patterns used in disability forms"
```

Get the app structure, routing patterns, and components already in use.

### 📊 Quick Reporting

**Scenario**: Your manager asks "How many forms do we have?"

```
You: "Generate a manifest catalog"
You: "Scan all manifests and show summary"
You: "How many apps use the forms-system?"
```

Instant metrics for planning and reporting.

## Pro Tips

### Find Similar Forms
```
"Search for education forms" 
"Which apps have similar URLs to /education/apply?"
```

### Discover Shared Components
```
"Find all React patterns"
"Show me validation components"
"Search for date picker patterns"
```

### Check URL Conflicts
```
"Which app uses the /health-care URL?"
"Find all apps under /disability path"
```

### Validate Before Deploy
```
"Validate the manifest for my-new-form"
"Check if gi-bill-benefits manifest is valid"
```

## Real Example: Building a New Benefits Form

1. **Research existing forms**:
   ```
   "Search for benefits applications"
   "Show me forms that use direct deposit"
   ```

2. **Find the right patterns**:
   ```
   "Find bank account validation patterns"
   "Search for SSN input components"
   ```

3. **Check URL availability**:
   ```
   "Which apps use /benefits URLs?"
   "Get info about benefits-delivery app"
   ```

4. **Validate your manifest**:
   ```
   "Validate manifest at src/applications/my-benefits-form/manifest.json"
   ```

That's how you use this tool to ship forms faster! 🎯