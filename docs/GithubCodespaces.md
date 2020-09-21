# Github Codespaces

Support for Codespaces is a work in progress.

## Getting Started

1. Visit `vets-website` [Github repository](https://github.com/department-of-veterans-affairs/vets-website)

1. Click green "Code" button and select "Open with Codespaces"

   |![code menu](./images/codespaces-menu.png)|
   |-|

1. If this is your first time using Codespaces select "New codespace"

   |![new codespace button](./images/codespaces-new-codespace.png)|
   |-|
   
1. On initial creation the Codespace will perform these actions:

   - Configure Node, NPM, NVM, and Yarn
   - Install dependencies
   - Download `vagov-content` repo
   - Download Drupal cache
   - See `/.devcontainer/post-create.sh` for full script

   > While setup is in process the "Configure Codespace" step will be active. Click notifications (bell icon in bottom right corner) and "See progress logs" to view status. There is also a VS Code command: `>Codespaces: View Creation Log`
   
   |![see progress logs](./images/codespaces-progress-logs.png)|
   |-|
   
   |![creation logs](./images/codespaces-creation-log.png)   |
   |-|

   *Full log available at `~/post-create.log`*

1. Start the development server
   - Open terminal
   - Run command:

      `yarn watch`
   - Ctrl + click on localhost link in terminal to open webserver in new tab

## Customization

### Settings sync

- Click on user icon in lower left hand corner and select "Turn on settings sync"
- Select your Github username
- User settings will be synchronized to `~/.vscode/settings.json` and will override any container or workspace settings.
