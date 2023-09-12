# Cypress Test Approach

Reference: [Mural](https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1692989444688/0044b9825c82d8d23920601f68c41a61d047d681?sender=ue51e6049230e03c1248b5078)

We want to test all possible flows to ensure the display logic is functioning as expected, and the user can
navigate forward and backward correctly in any situation. This includes navigation between questions, and
to and from the introduction screen and results screens.

## Service Period Folders

There are 3 folders for SERVICE_PERIOD ("When did you serve in the U.S. military?") responses:
- 1990 or later
- 1989 or earlier
- During both of these time periods

These three folders correspond to the 3 response options for this question.

Each of these responses takes a unique path through the application, with "During both of these time periods"
being the most complex, and including the most questions.

## Service Period Files (Yes, No, I'm not sure)

Each of the files inside the 3 folders listed above have a "Yes," "No" and "I'm not sure" spec file. This means that every question that has
radio options will be answered based on the file name (answered "Yes" in the `yes.cypress.spec.js` file, for instance). Checkboxes in these flows
will have one response.