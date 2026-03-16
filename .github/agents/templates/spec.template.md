# Implementation Spec

> **Session:** {session_id}
> **Created:** {created_at}
> **Last Updated:** {updated_at}

## Context

| Field | Value |
|-------|-------|
| Ticket | {ticket_url} |
| Application | {application} |
| Branch | {branch} |
| PR | {pr_url} |

## Summary

{One paragraph describing what this change accomplishes}

## Acceptance Criteria

- [ ] {Criterion 1}
- [ ] {Criterion 2}
- [ ] {Criterion 3}

## Files to Create

| File | Purpose |
|------|---------|
| {path/to/new/file.jsx} | {Brief description} |

## Files to Modify

| File | Changes |
|------|---------|
| {path/to/existing/file.jsx} | {What changes are needed} |

## Patterns to Follow

Reference these existing patterns:

- **{Pattern Name}**: `{path/to/example}`
- **{Pattern Name}**: `{path/to/example}`

## API Contracts

{If this involves API calls, document request/response shapes}

```js
// Request
POST /api/endpoint
{ field: "value" }

// Response
{ data: { ... } }
```

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| {Edge case 1} | {How to handle} |
| {Error condition} | {How to handle} |

## Out of Scope

- {Thing explicitly NOT being done}
- {Thing deferred to future work}

## Open Questions

- [ ] {Question needing human input}
- [x] {Resolved question} → Answer: {answer}

## Decisions Made

| Decision | Rationale | Made By |
|----------|-----------|---------|
| {Decision} | {Why} | {Agent} |
