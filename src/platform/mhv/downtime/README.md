## MHV Downtime

The downtime implementation for My HealtheVet applications is based in part on the platform monitoring `DowntimeNotification` implementation, and is intended to be passed to the `DowntimeNotification` component's render method.

## Usage

You should be able to import the `renderMHVDowntime` function and pass that to the `DowntimeNotification` component:

```jsx
<>
  <h1>App heading</h1>
  <DowntimeNotification
    appTitle="An MHV Application"
    dependencies={[externalServices.mhvPlatform, externalServices.mhvSm]}
    render={renderMHVDowntime}
  >
    <p>Child content that gets hidden during a downtime.</p>
  </DowntimeNotification>
  <p>This content stays visible during downtime.</p>
</>
```

The `renderMHVDowntime` will receive the `appTitle` along with props that `DowntimeNotification` passes on concerning the soonest service to go down (if any).

### No child content to hide?

If you don't have content you want hidden during the downtime, you can simply add the `DowntimeNotification` as a self-closing tag:

```jsx
<>
  <h1>App heading</h1>
  <DowntimeNotification
    appTitle="An MHV Application"
    dependencies={[externalServices.mhvPlatform, externalServices.mhvSm]}
    render={renderMHVDowntime}
  />
  <p>This content stays visible during downtime.</p>
</>
```

### appTitle as "tool label"

**appTitle** should be a value like `appTitle='this medical records tool'` that uses text appropriate to append to sentences like `you won't be able to use this ${appTitle}.`.

### Implementation details

### Accessibility: App heading must be visible during downtime

You must make sure your app's heading and breadcrumbs are rendered _outside_ of the `DowntimeNotification` component. Children of the `DowntimeNotification` component are not rendered during downtime, and a page that does not present an appropriate heading is an accessibility concern.
