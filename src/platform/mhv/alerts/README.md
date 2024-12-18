# mhv-alerts

Wrap your application or jsx content with the `<MhvAlerts />` component to render important authorization-based alerts to Veterans when they do not have the appropriate credentials to access VA.gov Health Portal Tools.

When no alerting conditions are detected in redux state, the content within the component is rendered.

## Usage

```jsx
import React from 'react';
import MhvAlerts from '@department-of-veterans-affairs/mhv/exports';

const Container = () => {
  return (
    <>
      {/* Render alerts or content */}
      <MhvAlerts>{content}<MhvAlerts />

      {/* Render alerts, if any present */}
      <MhvAlerts />
    </>
  )
}
```

## Run specs

```bash
$ yarn test:unit "src/platform/mhv/alerts/tests/**/*.unit.spec.{js,jsx}"
```
