# Cypress Test Approach

Reference: [Mural](https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1692989444688/0044b9825c82d8d23920601f68c41a61d047d681?sender=ue51e6049230e03c1248b5078)

We want to test as many flows as possible to ensure the display logic is functioning as expected, and the user can
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

## 1990 or later

This folder has a "No" and "I'm not sure" spec file, and a folder for 3 "Yes" spec files

### "Yes" folder

The path for "1990 or later" has 3 ways to get to results screen 1. Each of the Burn Pit questions, when answered
"Yes", will skip questions after, if applicable, and lead to results screen 1. This covers "Yes" for all 3 questions.
In order to get to the 2nd and 3rd Burn Pit questions, "No" must be answered for the preceding question.

### "No" and "I'm not sure" spec files

The path for both of these flows is the same; when each Burn Pit question is answered "No" or "I'm not sure",
this leads to results screen 1.

## 1989 or earlier

This folder has a folder for "Yes," "No" and "I'm not sure" spec files. The main folder has a mix spec file.

### "Yes" folder

The "Yes" flow has 4 paths to get to a results screen. Agent Orange 2.2.A, 2.2.1.A, and 2.2.2, when answered "Yes,"
will skip any subsequent Agent Orange questions and proceed to Radiation, then Camp Lejeune. Each of these flows is 
tested separately and ends at results screen 1. The 4th way requires a "Yes" response to Camp Lejeune only; meaning 
all the other questions are answered "No."

### "No" folder

The "No" flow has 2 paths to get to a results screen. If every question is answered "No," results screen 3 will show.
If 1 question is answered "Yes," results screen 1 will show.

### "I'm not sure" folder

The "I'm not sure" flow has 2 paths to get to a results screen. If every question is answered "I'm not sure," results screen 3 will show.
If 1 question is answered "Yes," results screen 1 will show.

### Mix spec file

The mix spec file is intended to cover a mix of the above scenarios.

## During both of these time periods

### "Yes" folder

The "Yes" flow has 4 paths to get to a results screen. Agent Orange 2.2.A, 2.2.1.A, and 2.2.2, when answered "Yes,"
will skip any subsequent Agent Orange questions and proceed to Radiation, then Camp Lejeune. Each of these flows is 
tested separately and ends at results screen 1. The 4th way requires a "Yes" response to Camp Lejeune only; meaning 
all the other questions are answered "No."

### "No" folder

The "No" flow has 2 paths to get to a results screen. If every question is answered "No," results screen 3 will show.
If 1 question is answered "Yes," results screen 1 will show.

### "I'm not sure" folder

The "I'm not sure" flow has 2 paths to get to a results screen. If every question is answered "I'm not sure," results screen 3 will show.
If 1 question is answered "Yes," results screen 1 will show.

### Mix spec file

The mix spec file is intended to cover a mix of the above scenarios.
