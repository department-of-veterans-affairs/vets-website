# Find-a-Form Documentation
## Product Outline
See here: https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/find-a-va-form
## Form PDF Download
When a user clicks to download a form PDF, a [lengthy process](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/10061#issuecomment-1213584116) is undertaken to attempt to validate that the requested PDF is valid.

[This process needs refinement](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/10268#issuecomment-1226214179), as it likely does not result in the best-possible veteran experience.

### Datadog Error Tracking
Along this process, there are a number of places where error conditions can arise. When one of these conditions arises, we send an error event to Datadog.

Ostensibly, there are four (4) possible event messages sent to Datadog (it appears that one will never be sent, though):
1. `Find Forms - Form Detail - onDownloadLinkClick function error`
     - Sent when one of two things fails after clicking on download link:
        1. API call to Forms API to check if PDF is valid
        2. HEAD request to the actual URL of the PDF
     - There are likely superfluous calls being made to Datadog every time one of these conditions is met. It seems, however, that Datadog may be handling duplicate events appropriately.
     - Events of this type make up the vast majority of events being sent to Datadog as they relate to Find-a-Form.
2. `Find Forms - Form Detail - invalid PDF link`
   - Sent when the Forms API indicates the PDF is valid, but the HEAD request to its URL does not fetch a valid response.
3. `Find Forms - Form Detail - invalid PDF accessed`
   - Sent when the Forms API indicates the PDF is invalid, but the domain is cross-origin so the HEAD request to its URL cannot be made.
4. `Find Forms - Form Detail - invalid PDF accessed & invalid PDF link`
   - Logically, this would be sent when the Forms API indicates an invalid PDF _and_ the HEAD request to its URL does not fetch a valid response. In reality, these two conditions will never coexist. It doesn't appear that this event can actually ever be sent to Datadog.
