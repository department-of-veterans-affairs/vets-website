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
To use these test events in content-build, set a cookie with the name
 `useGeneratedTestEvents` and with any value such as "1", then reload the page.
