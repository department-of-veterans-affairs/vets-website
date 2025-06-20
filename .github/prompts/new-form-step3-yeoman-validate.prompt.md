---
mode: 'agent'
---
We want to validate the new form. Make sure we have the new-app-folder name as context, otherwise stop and ask the user which form/folder.

1. `npm run lint:js:untracked:fix`
2. `yarn test:unit --app-folder {new-app-folder} --log-level all`
