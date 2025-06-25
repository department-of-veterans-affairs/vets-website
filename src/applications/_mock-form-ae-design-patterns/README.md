# Mock form AE Design Patterns
## Project Overview
_mock-form-ae-design-patterns is a mock form application designed to preview and test form design patterns for the VA.gov Authenticated Experience Design Patterns (AEDP) team. This app is **local-only** and is not intended for production use or deployment.

### Our mission & work
Crafting evidence-based, adaptable and adoptable design patterns that will improve Veteran authenticated experiences across government digital services.
Our team was tasked with:
-   Creating 4-8 reusable patterns and components for personalized, authenticated experiences
-   Making it as easy as possible to implement across products and teams
- Creating documentation for personalization patterns ready for integration into both the VA Design System (VADS) and the US Web Design System (USWDS)

Over the contract's year, we developed 6 patterns and components. In this app folder, you will find 
**Pattern 1** --> Help users to…Know when their information is prefilled
**Pattern 2** --> Help users to…Update prefilled information
**Pattern 6** --> Ask users for ...Marital Information

**Pattern 4**: Help users to…Manage Benefits and Tools
**Component 5**: [Service List Item](https://github.com/department-of-veterans-affairs/component-library/tree/main/packages/web-components/src/components/va-service-list-item)
**Component 6**: [Critical Action](https://github.com/department-of-veterans-affairs/component-library/tree/main/packages/web-components/src/components/va-critical-action)
are not located in this app folder. Both the components were built in the [component-library repo](https://github.com/department-of-veterans-affairs/component-library). 

Please refer to our team's [transition documentation](https://github.com/department-of-veterans-affairs/va.gov-team/blob/a04547d9262ba35ff4273835d5bdef60bea25e5f/products/authenticated-patterns/2025%20contract%20hand-off%20document.md) for additional pattern artifacts.

**Codespaces** - Our team introduced GitHub Codespaces to support our user research sessions and to make it easier to share our work with designers, non-engineers, and stakeholders. For more details, please refer to this [documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/set-up-codespaces-for-user-research)

## Getting started
1) Frontend: Run `yarn watch --env entry=mock-form-ae-design-patterns` in the terminal.
2) Server: Run `yarn mock-api --responses src/applications/_mock-form-ae-design-patterns/mocks/server.js` in another terminal window.
3) Navigate to `http://localhost:3001/mock-form-ae-design-patterns/{patternNumber}/`, replacing `{patternNumber}` with the number of the specific pattern you want to preview (e.g., `1` for pattern 1)

## Project Structure
Here are some key folders and files highlighted:
1) Pattern 1 (Prefill info)
	a) Contains sub-folders for 1) Task Green 2) Task Purple 3) Task Yellow. These are separate forms that were used for our user research sessions.
2) Pattern 2 (Update prefilled info) 
	a) Contains sub-folders for 1) Task Blue 2) Task Gray 3) Task Orange 4) Post Study  --> all were used for user research sessions
3) Pattern 6 (Marital info)
a) This folder is different from the other 2 patterns because 
	1) we did not have user research sessions for this pattern
	2) It serves as a library in which designers and engineers can view each form pages individually, as well as go through the entire form if they choose.

Each of the pattern folders contain their own `config/form.js` and related form pages, component files, E2E, and unit tests.

### Mock server
We use a mock server to mock endpoints and data for testing --> `mocks/server.js`
Additionally, we implemented an in-memory database so that when users input data, the same data will persist instead of mock data. This was especially beneficial during research sessions.

### Bonus
This project includes a **Developer Portal (VADX)**, which is gated behind a feature toggle and is accessible only in local development. VADX enables developers to preview individual form pages in isolation—without navigating through the full form flow—and provides an easy way to inspect the current Redux state. This tool is designed to streamline pattern development and debugging.

## Contributing
1.  Create a new folder under  `src/applications/_mock-form-ae-design-patterns/patterns/`.
2. After creating a `config/form.js` file, import it in `routes.jsx` where the app's routes are defined.
3. Add your pattern's data to `utils/data/tabs.js`. This profile provides data for rendering the navigation tabs in the UI.

---
### AEDP Team
-   Fran Cross, Agile Six, Product manager
-   Lynn Stahl, Agile Six, Product manager through April 2025
-   Adam Whitlock, Ad Hoc, Lead software engineer through early May 2025
-   Alex Taker, Ad Hoc, Software engineer
-   Belle Poopongpanit, Agile Six, Software engineer
-   Christine Rose Steiffer, Agile Six, Design Lead
-   Kristen Faiferlick, Ad Hoc, Staff UX Designer