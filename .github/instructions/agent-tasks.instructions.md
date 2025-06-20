---
applyTo: "**/src/applications/**/agent/tasks.md"
---
# Instructions for Agent Tasks and Writing to tasks.md

Tasks are instructions for the agent to follow when working on a project. They should be clear, actionable, and structured in a way that allows for easy tracking of progress.
Tasks should be executed in a sequential manner, unless specified otherwise.

## Scope
- Tasks in a `tasks.md` file should be related to the current application only, e.g. `src/applications/my-app/` is the scope for tasks at `src/applications/my-app/agent/tasks.md`.

## Format for writing to tasks
- Use Markdown format for tasks.
- Use bold for task names, use regular text for subtasks.
- Use checkboxes and ordered numbers for tasks.
- Use `[ ]` for incomplete tasks or not started tasks, and `[x]` for completed tasks.

## Example of tasks.md
```markdown
# Tasks for {appName}

- [ ] 1 - **Create PRD**
   - [ ] 1.1 - Define the problem statement.
   - [ ] 1.2 - Identify user needs.
   - [ ] 1.3 - Outline the solution.
- [ ] 2 - **Set up the project**
   - [ ] 2.1 - Create the project structure.
   - [ ] 2.2 - Initialize version control.
- [ ] 3 - **Implement features**
   - [ ] 3.1 - Develop the user interface.
   - [ ] 3.2 - Implement business logic.
   - [ ] 3.3 - Write tests.
```

## Task rules
- Tasks should be completed in the order they are listed, unless the user specifies otherwise.
- Complete tasks should be marked with `[x]` and should not be modified further.
- Stop after each task or subtask to allow the user to review and provide feedback.
- Mark tasks as completed when all subtasks are done.
- If a task is blocked or cannot be completed, mark it as `[ ]` and provide a reason for the blockage.
- When adding new tasks, ensure they are added at the end, unless they are related to a specific task that is currently being worked on, or the user specifies otherwise.
- Tasks may be rearranged if the user requests it, but ensure that the order of tasks is logical and follows the flow of the project.