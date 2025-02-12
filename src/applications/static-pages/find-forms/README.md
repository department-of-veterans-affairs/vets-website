# Find-a-Form Documentation

## Product Outline
See here: https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/find-a-va-form

## Environment Testing Gotchas
When you run the Find Forms application locally, in most cases you will not be able to open the download modal on either the **search results** page or the **form detail** pages. Because another team manages the form data and makes frequent updates, there is a chance that URLs can be entered incorrectly, or forms moved or deleted. To avoid sending users to a page that 404s, we ping the given form URL with a HEAD HTTP call to see if there is a response returned from the page. If this call fails, we don't show the download modal, but instead show an error banner.

Due to CORS, we can't make a HEAD HTTP call from one environment (e.g. localhost) to another (e.g. staging or production). Only same-domain forms can be checked. Unless you download the forms onto your machine, you'll always get a 404 for that HEAD HTTP call when running the code locally.

To get the download modal to appear, you'll need to make code changes to force it. In `checkFormValidity` in `src/applications/static-pages/find-forms/api/index.js`, you can directly return the values that will meet the modal criteria:

```
return {
  formPdfIsValid: true,
  formPdfUrlIsValid: true,
  networkRequestError: false,
};
```

This should allow the modal to appear, and the download button on the modal should take you to the production version of the form.

## Form PDF Download
When a user clicks to download a form PDF, a [lengthy process](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/10061#issuecomment-1213584116) is undertaken to attempt to validate that the requested PDF is valid.

[This process needs refinement](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/10268#issuecomment-1226214179), as it likely does not result in the best-possible veteran experience.

### Sentry Error Tracking
Along this process, there are a number of places where error conditions can arise. When one of these conditions arises, we send an error event to Sentry.

Ostensibly, there are four (4) possible event messages sent to Sentry (it appears that one will never be sent, though):
1. `Find Forms - Form Detail - onDownloadLinkClick function error`
     - Sent when one of two things fails after clicking on download link:
        1. API call to Forms API to check if PDF is valid
        2. HEAD request to the actual URL of the PDF
     - There are likely superfluous calls being made to Sentry every time one of these conditions is met. It seems, however, that [Sentry is more than likely debouncing them](https://dsva.slack.com/archives/CT4GZBM8F/p1661447143753809).
     - Events of this type make up the vast majority of events being sent to Sentry as they relate to Find-a-Form.
2. `Find Forms - Form Detail - invalid PDF link`
   - Sent when the Forms API indicates the PDF is valid, but the HEAD request to its URL does not fetch a valid response.
3. `Find Forms - Form Detail - invalid PDF accessed`
   - Sent when the Forms API indicates the PDF is invalid, but the domain is cross-origin so the HEAD request to its URL cannot be made.
4. `Find Forms - Form Detail - invalid PDF accessed & invalid PDF link`
   - Logically, this would be sent when the Forms API indicates an invalid PDF _and_ the HEAD request to its URL does not fetch a valid response. In reality, these two conditions will never coexist. It doesn't appear that this event can actually ever be sent to Sentry.
