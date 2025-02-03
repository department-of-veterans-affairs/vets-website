This MHV verify sign-in call-to-action widget shows an alert if the user is unauthenticated or unverified, or otherwise will show any provided content.

The default alert content matches the global versions of sign-in alerts that will eventually be included as part of VADS.

## Widget Features
- Displays an alert instead of content if the user is not signed in
- Displays an alert instead of content if the user is not verified
- Displays optional custom content if no alert is displayed
  - Custom content is defined under a child element with the `static-widget-content` class (see sample in Template section below). This allows the static content maintainers to update or change the content as needed. 
  - If there is no content specified then simply nothing is displayed. This allows this widget to be used with or without content. 
  - For security, custom content HTML is sanitized before being displayed.
- The default alert header level is `3`. To overwrite the header level, static content maintainers may include a different value on the `data-heading-level` attribute

## Template for Static Pages
The template follows the existing established [template defined in vets-website](https://github.com/department-of-veterans-affairs/vets-website/blob/cb8e27a144d78ab2b6f7d378468b6d14da4fcb5e/src/platform/landing-pages/dev-template.ejs#L195) and already used in other static pages like the [secure messaging static page](https://staging.va.gov/health-care/secure-messaging/).

Here is a specific template example to use this new widget:
```html
<div data-template="paragraphs/react_widget" data-entity-id="13348" data-widget-type="mhv-signin-cta"
  data-widget-timeout="20" data-heading-level="4" data-service-description="order medical supplies">
  <div class="loading-indicator-container">
    <div aria-label="Loading..." aria-valuetext="Loading your application..." class="loading-indicator" role="progressbar">
    </div>
    <span class="loading-indicator-message loading-indicator-message--normal">      
    </span>
    <span class="loading-indicator-message loading-indicator-message--slow vads-u-display--none" aria-hidden="true">
          Sorry, this is taking longer than expected.
    </span>
  </div>
  <span class="static-widget-content vads-u-display--none" aria-hidden="true">
    <p>
      <a class="vads-c-action-link--green" href="https://staging.va.gov/health-care/order-hearing-aid-or-CPAP-supplies-form" hreflang="en">
        Order hearing aid and CPAP supplies online</a>
    </p>
  </span>
  <div class="usa-alert usa-alert-error sip-application-error vads-u-display--none" aria-hidden="true">
    <div class="usa-alert-body">
      <strong>We&#x2019;re sorry. Something went wrong on our end.</strong><br>Please try refreshing your browser.
    </div>
  </div>
</div>
```

- Note the use of `data-widget-type="mhv-signin-cta"` on the first line. All the HTML content under the first div is replaced by the React component which is the widget.
- `data-service-description` is an optional service description string to be added to the headline of the alerts, so they read more specific to the intended call to action
- Also note the content under the span with the class `static-widget-content`. This is the optional content to be displayed if no alert is shown. This content can be zero or more HTML elements.