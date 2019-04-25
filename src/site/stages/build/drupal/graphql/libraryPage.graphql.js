/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
 fragment libraryPage on NodeLibrary {
    ${entityElementsFromPages}
    changed
    title
 }
`;
