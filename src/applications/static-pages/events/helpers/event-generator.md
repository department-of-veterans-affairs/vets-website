# Event Generator
The event-generator.js script exists to make testing the Events app easier. It's
 hard (time consuming, finicky) to generate mock data for events in test
  environments in order to do testing.

## Testing Events in vets-website
The event-generator.js script is used to generate contextual Event data for unit
 testing purposes on vets-website.

See `src/applications/static-pages/events/components/Results/index.unit.spec.js`
 for examples of how to use the script in unit tests.

## Testing Events in content-build
The generateTestEvents() function outputs events suitable for passing to the
Events app as a prop. In order to use it in content-build, modify App/index.js
 to import the generateTestEvents function, and pass in the result as the pop to
 the Events component. See below:

```js
diff --git a/src/applications/static-pages/events/components/App/index.js b/src/applications/static-pages/events/components/App/index.js
index 1151139aa5..645f556902 100644
--- a/src/applications/static-pages/events/components/App/index.js
+++ b/src/applications/static-pages/events/components/App/index.js
@@ -4,12 +4,13 @@ import PropTypes from 'prop-types';
 // Relative imports.
 import Events from '../Events';
 import { fleshOutRecurringEvents, removeDuplicateEvents } from '../../helpers';
-
+import { generateTestEvents } from '../../helpers/event-generator';
 export const App = ({ rawEvents }) => {
   return (
-    <Events
-      rawEvents={fleshOutRecurringEvents(removeDuplicateEvents(rawEvents))}
-    />
+    // <Events
+    //   rawEvents={fleshOutRecurringEvents(removeDuplicateEvents(rawEvents))}
+    // />
+    <Events rawEvents={generateTestEvents()} />
   );
 };
```
Set this up before running `yarn watch` or `yarn build` in content-build.
