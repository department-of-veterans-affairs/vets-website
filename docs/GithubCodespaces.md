# Github Codespaces

Support for Codespaces is a work in progress.

## Getting Started

1. Visit `vets-website` [Github repository](https://github.com/department-of-veterans-affairs/vets-website)

1. Click green "Code" button and select "Open with Codespaces"

1. If this is your first time using Codespaces select "New codespace"

1. On initial creation the Codespace will perform these actions:

   - Configure Node, NPM, NVM, and Yarn
   - Install dependencies

   > While setup is in process the "Configure Codespace" step will be active. Click notifications (bell icon in bottom right corner) "See progress logs" to view status, or run `>Codespaces: View Creation Log`  
   > Full log is available at `~/post-create.log`

1. Start the development server
   - Open terminal
   - `yarn watch`

## Codespaces Config

### Settings sync

- Click on user icon in lower left hand corner and select "Turn on settings sync"
- Select your Github username
