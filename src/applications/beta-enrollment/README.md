# Beta Enrollment

This was designed to create React-powered buttons that when clicked enrolls the user into a beta program by adding the unique name of the service into the user's services array. It was used during user acceptance test (UAT) on the Veteran Personalization project.

## Personalization Product Example
During a screenshare session, the veteran was instructed to navigate to `beta-enrollment/personalization/`, which contained an overview of the Personalization product suite - the Dashboard, VA Profile, and Account. The bottom of the page contained an Enroll button, which when pressed, sent request to the API to add the `dashboard-beta` service into the `user.profile.services` array, which enabled all Personalization features across the site for that user. The veteran was then redirected to their personalized homepage, referred to as the Dashboard.

## Implementing In Other Applications
To create a similar process for another application, follow these steps:

1. Create the content/Markdown page in `content/beta-enrollment` where you would like the enrollment button to reside. [Example from Personalization UAT](https://github.com/department-of-veterans-affairs/vets-website/blob/b2baab7e9ad26c7d464c417366f9241a3bbab660/content/pages/beta-enrollment/personalization.md).
2. Make sure to include a React root element in the Markdown file, `<div id="react-root"></div>`.
3. Register the route as React entrypoint by creating the button in `beta-enrollment/routes.js`.
4. Any applications that are part of that Beta should be wrapped in a `BetaApp` tags. For example, Personalization products were wrapped in:
    - `<BetaApp featureName={features.dashboard} redirect="/beta-enrollment/personalization/">`
    - In the event the user navigated there without being enrolled, they would be redirected to the enrollment page.
    - The FE and API have to agree on the name of your beta. Make sure it exists in the [API](https://github.com/department-of-veterans-affairs/vets-api/blob/master/config/routes.rb#L202) `beta_registration` controller.

## Unenrolling from Beta
There is an action available for deleting a service from the user's services array, but it must be implemented manually.
