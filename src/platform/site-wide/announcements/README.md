# Announcements
Announcements were designed to be configurable site-wide without messing with the source code of other applications or digging into Metalsmith layout files to conditionally render. They are configured in `config/index.js` using regular expressions to determine which announcements render on what pages.

## Basic Use Cases
In the following example, any pages that matches the `paths` property will render the corresponding component in the `component` property. The `name` property should be unique. The `relatedAnnouncements` property refers to the names of other announcements, which should also be disabled when this announcement is dismissed by the user.

**config/index**
```jsx
import React from 'react';

const config = {
  announcements: [
    {
      name: 'New Education Feature',
      paths: /^(\/education\/)$/,
      component: ({ announcement, dismiss, isLoggedIn, profile }) => {
        return (
          <div className="education-announcement">
            {announcement.name}
            <a href="/education/new-feature" onClick={dismiss}>Check out our new Education feature</a>
          </div>
        );
      },
      relatedAnnouncements: ['Education Intro']
    },
    {
      name: 'Education Intro',
      // ...
    }
  ]
};

export default config;
```
The `announcement` property in the rendered component will contain the announcement as stored in the config, so in this case `announcement.name` will render `New Education Feature`. The `dismiss` property will disable the announcement "permanently" by storing its name in localStorage. Any related announcements will also be disabled by being stored there as well.

## Architecture
The Announcement entry point uses React to bind to an element above the footer of the website. It was designed this way because announcement will always render as fixed elements or as modal dialogs. If no announcement matches the current path, or if the matching announcement has been dismissed, it will render as an empty div.

## E2E Tests
Announcements are disabled during E2E tests for two reasons -

1. Philosophically, because they change over time, while E2E tests should run consistently.
2. Functionally, because it is likely that announcements will use "position: fixed" in their style, which will interrupt Nightwatch's browser focus while tests are running and break things.

The helper for disabling announcements is named `disableAnnouncements` and is located in `platform/testing/e2e/helpers.js`.
