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
            <a href="/education/new-feature" onClick={dismiss}>
              Check out our new Education feature
            </a>
          </div>
        );
      },
      relatedAnnouncements: ['Education Intro'],
    },
    {
      name: 'Education Intro',
      // ...
    },
  ],
};

export default config;
```

The `announcement` property in the rendered component will contain the announcement as stored in the config, so in this case `announcement.name` will render `New Education Feature`.

The `show` perperty can be set to one of 3 values defined in the AnnouncementBehavior enum constant, which are SHOW_ONCE, SHOW_EVERY_TIME and SHOW_ONCE_PER_SESSION. The SHOW_ONCE option persists to `localStorage`, the SHOW_ONCE_PER_SESSION persists to the `sessionStorage` nad the SHOW_EVERY_TIME does not persist dismissal at all.

## Architecture

The Announcement entry point uses React to bind to an element inside an announcement-root div at the top of the page body. It renders an empty div in its place when there is no announcement to show. Placing the Announcement div at the top of the html body allows focus to be directed to the skip-link element of the page on modal close, allowing for an accessible user experience.

## E2E Tests

Announcements are disabled during E2E tests for two reasons -

1. Philosophically, because they change over time, while E2E tests should run consistently.
2. Functionally, because it is likely that announcements will use "position: fixed" in their style, which will interrupt Nightwatch's browser focus while tests are running and break things.

The helper for disabling announcements is named `disableAnnouncements` and is located in `platform/testing/e2e/helpers.js`.
