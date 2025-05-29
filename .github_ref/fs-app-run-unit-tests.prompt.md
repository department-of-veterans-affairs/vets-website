# Forms app run unit tests (yarn test)

Steps:
1. Determine the {app_folder} we are in [instructions](fs-app-locate-folder.prompt.md). The {app_folder} should be the remaining path after `src/applications`
2. Write the output to `.agent/tmp/input.txt`. Overrite if it exists. Only a single line.
3. Run task `agent-run-tests-current-app`
4. Check results in `.agent/tmp/output.txt`
5. Check if there are any failures, if there are any failures, try to correct and start at step 3 again, Otherwise, report success.