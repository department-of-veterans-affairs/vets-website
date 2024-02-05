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
</>
```

The `renderMHVDowntime` will receive the `appTitle` along with props that `DowntimeNotification` passes on concerning the soonest service to go down (if any).

### Implementation details

#### `appTitle` and dismissible alerts

When a `MHVDowntimeApproaching` alert is dismissed (closed), the `DowntimeNotification` component stores the `appTitle` in Redux under `scheduledDowntime.dismissedDowntimeWarnings`. The `appTitle` is used to determine if an alert has been dismissed previously in order not to render it again.

### Accessibility Notes

You must make sure your app's heading and breadcrumbs are rendered _outside_ of the `DowntimeNotification` component. Children of the `DowntimeNotification` component are not rendered during downtime, and a page that does not present an appropriate heading is an accessibility concern.
