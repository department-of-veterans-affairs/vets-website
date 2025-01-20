# Widgets for Health Care pages

This folder contains widgets that are used for a few of the pages in https://www.va.gov/health-care/#manage-your-health-and-benefits.

## Why isn't this in Drupal?

The widgets were created as part of [this epic](https://github.com/department-of-veterans-affairs/va.gov-team/issues/10240), which includes design specs for these pages where the content changes based on whether a user is authenticated and is a Cerner patient. This functionality is not currently available in Drupal, so the solution we chose was to make the pages React widgets that do have access to authenticated state.

## How do I implement one?

Go to Drupal and click on a page that you would like to insert one of the widgets into. You can use any of the `widgetType`s found [here](https://github.com/department-of-veterans-affairs/vets-website/src/platform/site-wide/widgetTypes.js).
