# View Dependents Application

## 1. Overview of the Application

The View Dependents application allows Veterans to view their dependents who are on and not on their VA benefits award. The application provides a streamlined interface for Veterans to:

- View dependents currently on their VA benefits award
- View dependents not currently on their benefits award
- Verify dependent information when requested by the VA
- Access options to add, remove, or update dependent information (when feature flags are enabled)

This application is accessed at `/view-change-dependents/view` on the VA website.

## 2. Directory Structure

```
view-dependents/
├── actions/              # Redux action creators
├── components/           # Reusable UI components
├── containers/           # Connected React components
├── layouts/              # Layout components
├── manage-dependents/    # Sub-application for managing dependents
├── reducers/             # Redux reducers
├── sass/                 # Styling
├── tests/                # Test files
├── util/                 # Utility functions
├── manifest.json         # Application manifest
├── routes.jsx            # Application routes
└── view-dependents-entry.jsx  # Application entry point
```

## 3. Key Components and Their Responsibilities

### Main Components

- **ViewDependentsApp (containers/ViewDependentsApp.jsx)**
  - The top-level container component
  - Connects to Redux state
  - Handles authentication and authorization
  - Manages downtime notifications for external services
  - Fetches dependent data upon mount

- **ViewDependentsLayout (layouts/ViewDependentsLayout.jsx)**
  - Main layout component that structures the UI
  - Handles conditional rendering based on loading and error states
  - Displays appropriate messages for different application states
  - Manages the layout grid (main content and sidebar)

- **ViewDependentsLists (layouts/ViewDependentsLists.jsx)**
  - Renders lists of dependents (both on-award and not on-award)
  - Conditionally renders based on available data

- **ViewDependentsSidebar (components/ViewDependentsSidebar/ViewDependentsSidebar.jsx)**
  - Displays informational sidebar blocks
  - Provides contextual information to the user

- **ViewDependentsHeader (components/ViewDependentsHeader/ViewDependentsHeader.jsx)**
  - Renders the page header
  - Shows notifications related to dependency verification status

- **ViewDependentsList (components/ViewDependentsList/ViewDependentsList.jsx)**
  - Displays a formatted list of dependents
  - Handles the presentation of dependent information in a structured format
  - Serves as a container for individual dependent list items

- **ViewDependentsListItem (components/ViewDependentsList/ViewDependentsListItem.jsx)**
  - Renders individual dependent information
  - Displays relevant details for each dependent (name, relationship, status, etc.)
  - Handles UI formatting for dependent-specific data

- **ViewDependentsFooter (components/ViewDependentsFooter.jsx)**
  - Provides footer information and links
  - Contains navigation options for additional dependent-related tasks

- **ViewDependentsSidebarBlock (components/ViewDependentsSidebar/ViewDependentsSidebarBlock.jsx)**
  - Represents individual information blocks within the sidebar
  - Displays contextual help information and guidance
  - Structured with headings and content for easy consumption

## 4. State Management

The application uses Redux for state management with the following key state slices:

### Main Reducers

- **allDependents (reducers/index.js)**
  - Tracks loading state for dependents data
  - Stores lists of on-award and not-on-award dependents
  - Manages API error states

- **verifyDependents (reducers/dependencyVerification.js)**
  - Handles dependency verification status
  - Manages diary update states (pending, success, failed, skipped)
  - Stores verifiable dependents data

### Key Actions

- **FETCH_ALL_DEPENDENTS_SUCCESS/FAILED**
  - Triggered after API call to fetch dependents
  - Updates the dependent lists and loading state

- **DEPENDENCY_VERIFICATION_CALL_SUCCESS/FAILED**
  - Handles response from dependency verification API
  - Updates verification status

- **UPDATE_DIARIES_STARTED/SUCCESS/FAILED/SKIP**
  - Manages the state for diary update process
  - Provides user feedback on verification process status

## 5. Feature Flags

The application uses feature flags to conditionally enable functionality:

- **manageDependents**
  - Controls whether users can add, remove, or update dependents
  - When enabled, provides UI elements for dependent management

- **dependencyVerification**
  - Controls the dependency verification workflow
  - When enabled, allows users to verify their dependents as requested by the VA

These flags are managed through the platform's feature toggle system and accessed via Redux.

## 6. Error Handling

The application implements comprehensive error handling:

- **API Error Handling**
  - Server errors (5xx) display a technical error message
  - Client errors (4xx) display a user-friendly message
  - Specific error codes trigger appropriate UI messages

- **Loading States**
  - Loading indicator displayed during data fetching
  - Graceful UI transitions between loading and loaded states

- **Empty States**
  - Appropriate messaging when no dependents are found
  - Guidance provided when verification is not needed

## 7. Dependencies and Services

### External Services

The application depends on several VA backend services:

- **BGS (Benefits Gateway Service)**
  - Primary data source for dependent information
  - Handles verification of dependent status

- **MVI (Master Veteran Index)**
  - Used for veteran identity verification

- **VA Profile**
  - Provides veteran profile information

- **VBMS (Veterans Benefits Management System)**
  - Backend system for benefits management

### Technical Dependencies

- **React/Redux** - Frontend framework and state management
- **Platform Components** - VA.gov shared components and utilities
- **DowntimeNotification** - Service monitoring and downtime alerts
- **RequiredLoginView** - Authentication and authorization

### Authentication Requirements

- Requires user to be logged in
- Requires `USER_PROFILE` service access

## 8. Utility Functions

The application includes several utility functions that support core functionality:

### Key Constants

- **PAGE_TITLE** (`'Your VA dependents'`)
  - Used for consistent page titling throughout the application
  - Combined with TITLE_SUFFIX to create full document titles

- **TITLE_SUFFIX** (`' | Veteran Affairs'`)
  - Appended to page titles for VA branding consistency

### API Interaction

- **getData(apiRoute, options)**
  - Wrapper around platform's apiRequest for standardized API interactions
  - Returns data.attributes from successful responses
  - Handles error responses consistently

### Data Processing

- **splitPersons(persons)**
  - Categorizes dependents into "on award" and "not on award" groups
  - Creates a structured object containing both categories
  - Critical for organizing the display of dependent information

### Error Handling Utilities

- **isServerError(errCode)** 
  - Validates if an error code is a server error (5xx)
  - Used for conditional UI rendering based on error type

- **isClientError(errCode)**
  - Validates if an error code is a client error (4xx)
  - Used for conditional UI rendering based on error type

### Security and Accessibility

- **mask(value)**
  - Masks sensitive information (typically SSNs)
  - Implements screen reader compatible substitutions
  - Displays only the last 4 digits while making the full value accessible

## 9. Styling

The application uses SCSS for styling, with a focus on customizing the VA design system components for the specific needs of the View Dependents functionality.

### SASS Dependencies

- **VA CSS Library** (`@department-of-veterans-affairs/css-library`)
  - Provides design tokens and variables for consistent styling
  - Ensures compliance with VA design standards

- **Platform Form Styles** (`platform/forms/sass/m-schemaform`)
  - Leverages the common form styling patterns 
  - Provides base styles for form-like components

### Key Style Overrides

- **Additional Info Button Override**
  ```scss
  .additional-info-button {
    white-space: normal !important;
  }
  ```
  - Overrides default `white-space: no-wrap` to prevent button overflow issues
  - Ensures buttons display properly within their containers

- **Alert Component Customizations**
  ```scss
  .usa-alert {
    padding: 0.9375rem 1.25rem 0.75rem 0.875rem;
  }
  .schemaform-warning-header {
    display: none;
  }
  .usa-alert-body p:nth-child(2) {
    display: none;
  }
  ```
  - Customizes padding for alert components
  - Hides unnecessary warning headers and secondary paragraphs
  - Creates a more streamlined appearance for alerts

- **Dependents List Item Layout**
  ```scss
  .mng-dependents-list-item dt, 
  .mng-dependents-list-item dd {
    display: inline-block;
  }
  ```
  - Adjusts the layout of definition terms and descriptions
  - Creates a horizontal layout for improved readability of dependent information

### CSS Class Usage

- **Layout Classes**
  - Uses VA Design System layout grid classes (e.g., `vads-l-grid-container`, `vads-l-row`, `vads-l-col--12`)
  - Implements responsive breakpoints with classes like `medium-screen:vads-l-col--8`

- **Utility Classes**
  - Leverages VA Design System utility classes (e.g., `vads-u-padding--2`)
  - Provides consistent spacing and layout without custom CSS

- **Component-Specific Classes**
  - `mng-dependents-list-item` for styling dependent list entries
  - Custom alert styling for error and information messages

## 10. Testing

The application includes a comprehensive test suite that verifies functionality across all layers of the application.

### Test Directory Structure

The test directory mirrors the application's structure, making it easy to locate tests for specific components:

```
tests/
├── actions/        # Tests for Redux actions
├── components/     # Tests for React components
├── containers/     # Tests for container components
├── layouts/        # Tests for layout components
├── util/           # Tests for utility functions
└── e2e/            # End-to-end tests
```

### Types of Tests

- **Unit Tests**
  - Tests for Redux actions verify correct action creators and async flows
  - Component tests verify rendering and user interactions
  - Container tests verify Redux connections and prop mappings
  - Utility tests verify data transformation and helper functions

- **Integration Tests**
  - Verify interactions between connected components
  - Test Redux state changes in response to actions

- **End-to-End Tests**
  - Simulate user flows through the application
  - Verify critical paths like viewing dependents and verification processes
  - Test feature-flag conditional rendering

### Testing Patterns and Practices

- **Component Testing**
  - Snapshot testing to verify UI consistency
  - Event simulation to test user interactions
  - Prop validation to ensure components receive correct data

- **Redux Testing**
  - Action creator tests to verify proper action objects
  - Reducer tests to verify state transitions
  - Thunk/async tests to verify API interaction patterns

- **Mocking**
  - API responses are mocked to test success and failure scenarios
  - Feature flags are mocked to test conditional rendering
  - External dependencies are mocked to isolate test scope

- **Accessibility Testing**
  - Components are tested for accessibility compliance
  - Screen reader compatibility is verified

The test suite ensures that the View Dependents application functions correctly across different scenarios and provides a reliable experience for Veterans accessing their dependent information.

---

This application is part of the larger VA.gov platform, designed to provide Veterans with easy access to information about their dependents and streamline the process of managing those dependents when needed.

