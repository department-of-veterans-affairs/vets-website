# Secondary Navigation

This directory contains components and utilities related to the secondary navigation for the My HealtheVet (MHV) section of the VA.gov website.

## Contents

- **Components**: React components for rendering the secondary navigation UI.
- **Utilities**: Helper functions and constants used by the navigation components.
- **Styles**: CSS or SCSS files for styling the navigation.

## Usage

Import and use the relevant components in your MHV-related pages:

```js
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';

<MhvSecondaryNav />
```

Include the following SASS file in your application's entry point (e.g. in your `app-entry.jsx` file):

```js
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';
```
