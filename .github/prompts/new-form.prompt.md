---
mode: 'agent'
---
# New Form Workspace Creation

## Goal
Help the user create a **new form** workspace, referencing existing form paths in the [src/applications/manifest-catalog.md](src/applications/manifest-catalog.md) file.

### Steps:

1. **Check if the form exists** using the `src/applications/manifest-catalog.json`.
2. If it exists, confirm if the user wants to:
   - Create a new form with a different name.
   - Use the existing form
3. If it doesn’t exist:
   - Propose a suggested folder name (e.g. `src/applications/form-foo-bar`)
   - Confirm with the user before proceeding.
4. On confirmation:
   - Create the folder structure:
     ```
     src/applications/form-foo-bar/
       └── agent/
           ├── tasks.md
           └── form-spec.md
     ```
   - Generate:
     - `tasks.md` with a planning outline (starting with PRD and Yeoman generator prep)
     - `form-spec.md` as an empty or skeleton file
5. Prompt user to begin task 1: writing the form spec.