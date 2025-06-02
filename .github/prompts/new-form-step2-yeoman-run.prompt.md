---
mode: 'agent'
---
First confirm that `.agent/tmp/new_form.json` file exists. If the file does not exist, we will stop and prompt the user to create it first.

Once the file is confirmed to exist, run the task `new-form-from-json` to generate the new form based on the values in the file.

After completed, run linting using
`npm run lint:js:untracked:fix`

Fix any errors until the linting passes.