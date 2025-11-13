# mhv-secure-messaging

## App

This app provides veterans with secure messaging functionality through My HealtheVet (MHV) on VA.gov. Veterans can communicate with their care teams, send and receive messages, manage attachments, organize messages in folders, and maintain secure healthcare communications.

## Quick start to get running locally

Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.

- clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
- run `yarn install`
- create the directory structure if it doesn't exist
  `mkdir -p build/localhost/data/cms`
- fetch the CMS data and save to the specified location
  `curl -o build/localhost/data/cms/vamc-ehr.json "https://www.va.gov/data/cms/vamc-ehr.json"`

### Option 1: Using Local Mocks (Recommended for most development)

- turn on local mocks `yarn mock-api --responses src/platform/mhv/api/mocks/index.js`
- start app `yarn watch --env entry=mhv-secure-messaging`
- Run this in your browser console to simulate being logged in `localStorage.setItem('hasSession', true);`
- visit the app: `http://localhost:3001/my-health/secure-messages`

### Option 2: Tunneling into Upstream Services

For development that requires real backend data and API responses, you can tunnel into upstream MHV services:

- Follow the setup guide: [Setting up SM with MHV API Tunnel](https://github.com/department-of-veterans-affairs/mhv-developer-docs/blob/main/how-to/setting_up_SM_with_mhv_api_tunnel.md)
- start app `yarn watch --env entry=mhv-secure-messaging,auth,static-pages,sign-in,terms-of-use,login-page`
- Authentication can be handled using [Mocked Authentication](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/identity/Products/Mocked%20Authentication)
- visit the app: `http://localhost:3001/my-health/secure-messages/inbox/`

## Running tests

Unit tests can be run using this command: `yarn test:unit --app-folder mhv-secure-messaging`. To get detailed errors, run this command with `--log-level=debug`. To get coverage reports run this command `yarn test:unit --app-folder mhv-secure-messaging --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `mhv-secure-messaging` to run end to end tests for this app.

Run Cypress from command line:

- Run all `yarn cy:run --spec "src/applications/mhv-secure-messaging/**/**/*"`
- Use the `-b electron` option to specify the Electron browser, which is lightweight, tightly integrated with Cypress, and comes pre-installed, removing the need for separate installation.

### Test coverage

```bash
$ yarn test:unit --app-folder mhv-secure-messaging --coverage --coverage-html
$ cd ./coverage
$ npx http-server
$ open http://localhost:8080
```

## Features

The MHV Secure Messaging application provides the following messaging capabilities:

- **Compose messages** - Create and send secure messages to healthcare providers and care teams
- **Message threads** - View and participate in conversation threads with healthcare providers
- **Folders** - Organize messages using folders (Inbox, Sent, Drafts, Trash, Custom folders)
- **Search** - Search through messages and conversations
- **Attachments** - Attach files to messages and view attachments from received messages
- **Recipients management** - Select and manage care team recipients
- **Draft management** - Save and edit message drafts
- **Message categories** - Categorize messages by type (appointments, medications, test results, etc.)
- **Emergency messaging** - Crisis line integration and emergency contact information

## Architecture

The application follows standard VA.gov patterns with:

- **Redux** for state management
- **React Router** for navigation
- **RJSF** (React JSON Schema Form) for form components when applicable
- **VA Design System** web components for UI consistency
- **Platform utilities** for API requests and common functionality

Key directories:

- `actions/` - Redux action creators for messaging operations
- `api/` - API service functions for secure messaging endpoints
- `components/` - Reusable React components (message lists, compose forms, etc.)
- `containers/` - Connected components and page containers
- `hooks/` - Custom React hooks for messaging functionality
- `reducers/` - Redux reducers for messaging state management
- `sass/` - Styling and CSS for messaging interfaces
- `tests/` - Unit, integration, and E2E tests
- `api/mocks/` - Mock API responses for development and testing

## Mock API Development

The application includes comprehensive mock data for local development. Mock responses are configured in `src/platform/mhv/api/mocks/index.js` and include:

- Message data for all supported message types and folders
- Recipient and care team information
- Folder structures and organization
- Message categories and threading
- Attachment handling
- Error scenarios for testing error handling
- Maintenance window notifications
- Authentication and session management

To use mock data during development, ensure the mock API server is running with the responses file specified.

## Key Components

- **Compose** - Message composition interface with recipient selection and attachments
- **ThreadDetails** - Display individual message threads and conversations
- **FolderThreadListView** - List view of messages organized by folders
- **MessageThread** - Thread-based message display and navigation
- **SearchResults** - Search functionality across messages
- **Dashboard** - Main landing page with message overview
- **Navigation** - App-specific navigation and folder management

## API Integration

The app integrates with My HealtheVet secure messaging APIs for:

- Message CRUD operations (create, read, update, delete)
- Folder management and organization
- Recipient and care team data
- File attachment handling
- Message threading and conversation management
- Search and filtering capabilities
