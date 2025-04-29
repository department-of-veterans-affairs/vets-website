# Cypress Test Approach

Refer to this [Mural](https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1692989444688/0044b9825c82d8d23920601f68c41a61d047d681?sender=ue51e6049230e03c1248b5078) for a complete diagram of all question flows.

We want to use automated tests for as many flows as possible to ensure the display logic is functioning as expected and the user can
navigate forward and backward correctly in any situation. This includes navigation between questions and
to and from the introduction page and results pages.

## Cypress testing structure

### Parent folders

Inside `/tests/cypress`, there is a folder for each response to the first question in the flow: "When did you serve in the U.S. military (including time spent in training)?" (known as SERVICE_PERIOD). You can think of these as "parent folders:"
1. 1990 or later
2. 1989 or earlier
3. During both of these time periods

### Child folders
Each of these SERVICE_PERIOD responses takes the user through a unique path of questions with "Yes," "No," and "I'm not sure" responses. These 3 responses have folders inside the parent folders that you can think of as "child folders."

## File anatomy

In most files, there is a comment section at the top describing the path that is verified. 

### `yes` files
The below example is from `service-period-1990-or-later/yes/yes-flow-A.cypress.spec.js`.

```
// Flow A
// Service Period - 1990 or later
// Burn Pit 2.1 - Yes
// Burn Pit 2.1.1 - No
// Burn Pit 2.1.2 - No
// Burn Pit 2.1.3 - No
// Main Flow 2.5 - No
// Results 4
```

Note that this file is a `yes-` file, but it does not use "Yes" for every question. "Yes" responses often change the outcome for the results page. There are multiple `yes` files for each parent folder to cover "Yes" responses to each question.

### `no` and `im-not-sure` files

These files use the same answer ("No" or "I'm not sure" respectively) for every question. These flows are generally longer than "Yes" flows and cover most questions.

### `mix` files

The mix files test a single flow with a variety of responses to questions.

### `deep-linking`

This application should not allow a user to navigate directly to any question in the flow. This file validates that the flow redirects to `/introduction` for every page.

### `form-validation`

This file validates that every question (radio or checkbox) requires a response and does not show an error when it is not needed.