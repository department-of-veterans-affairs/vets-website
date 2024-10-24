# ConfirmationView

The forms-system `component/ConfirmationView` contains the standard view elements necessary for your application's `container/ConfirmationPage`. Can be used as a single component, or by using subcomponent pattern `ConfirmationView.ChildElements` pattern to omit/add/replace individual components.

## Table of contents
- [ConfirmationView](#confirmationview)
  - [Table of contents](#table-of-contents)
  - [Usage - Simple](#usage---simple)
  - [Usage - Custom (Subcomponents)](#usage---custom-subcomponents)
    - [Add additional content](#add-additional-content)
    - [Omit content](#omit-content)
    - [Replace content](#replace-content)
    - [Subcomponent customization](#subcomponent-customization)
    - [One-Off Usage](#one-off-usage)
  - [Props](#props)
  - [Subcomponents](#subcomponents)
  - [Conflicting imports](#conflicting-imports)
  - [A/B Testing](#ab-testing)
  - [Updating tests](#updating-tests)

## Usage - Simple

```jsx
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

<ConfirmationView
  submitDate={submitDate}
  confirmationNumber={confirmationNumber}
  formConfig={formConfig}
  pdfUrl={submission.response?.pdfUrl}
  devOnly={{
    showButtons: true,
    mockData,
  }}
/>
```

## Usage - Custom (Subcomponents)

If you need to replace, omit, or add individual parts of the confirmation page, use the subcomponent pattern.

```jsx
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

<ConfirmationView
  submitDate={submitDate}
  confirmationNumber={confirmationNumber}
  formConfig={formConfig}
  pdfUrl={submission.response?.pdfUrl}
  devOnly={{
    showButtons: true,
    mockData,
  }}
>
  <ConfirmationView.SubmissionAlert />
  <ConfirmationView.SavePdfDownload />
  <ConfirmationView.ChapterSectionCollection />
  <ConfirmationView.PrintThisPage />
  <ConfirmationView.WhatsNextProcessList />
  <ConfirmationView.HowToContact />
  <ConfirmationView.GoBackLink />
  <ConfirmationView.NeedHelp />
</ConfirmationView>
```

### Add additional content
```jsx
<ConfirmationView ...>
  <ConfirmationView.SubmissionAlert />
  <ConfirmationView.SavePdfDownload />
  <ConfirmationView.ChapterSectionCollection />
  <ConfirmationView.PrintThisPage />
  <div>Hello world</div>
  <ConfirmationView.WhatsNextProcessList />
  <ConfirmationView.HowToContact />
  <ConfirmationView.GoBackLink />
  <ConfirmationView.NeedHelp />
</ConfirmationView>
```

### Omit content
```jsx
<ConfirmationView ...>
  <ConfirmationView.SubmissionAlert />
  <ConfirmationView.GoBackLink />
  <ConfirmationView.NeedHelp />
</ConfirmationView>
```

### Replace content
```jsx
<ConfirmationView ...>
  <ConfirmationView.SubmissionAlert />
  <ConfirmationView.SavePdfDownload />
  <ConfirmationView.ChapterSectionCollection />
  <ConfirmationView.PrintThisPage />
  <div className='confirmation-whats-next-process-list-section'>
      <h2>What to expect</h2>
      <VaProcessList>
        <VaProcessListItem>...</VaProcessListItem>
      </VaProcessList>
  </div>
  <ConfirmationView.HowToContact />
  <ConfirmationView.GoBackLink />
  <ConfirmationView.NeedHelp />
</ConfirmationView>
```

### Subcomponent customization
You might not need to entirely replace a subcomponent. Many subcomponents also have props you can pass in. For example:

```jsx
<ConfirmationView ...>
  ...
  <ConfirmationView.SubmissionAlert
    title="Your application has been submitted."
    content={
      <p>Thank you for applying for VA benefits. We usually process applications within 30 days.</p>
    }
  />
  <ConfirmationView.ChapterSectionCollection
    header="Your form data"
  />
  ...
</ConfirmationView>
```

### One-Off Usage

You can also import indvidual components if desired, but you must pass in the necessary props since we no longer have the context of the parent `ConfirmationView`.

```jsx
import { ChapterSectionCollection } from 'platform/forms-system/src/js/components/ConfirmationView';

<ChapterSectionCollection
    formConfig={formConfig}
    header="Information you submitted on this form"
/>
```

## Props
| Prop | Description/Type |
| --- | --- |
`formConfig` | `object` |
`[submitDate]` | `Date` |
`[confirmationNumber]` | `string` |
`[pdfUrl]` | `string` - if applicable |
`[devOnly]` | `object` - if provided, will only show on `localhost` and `dev.va.gov`. Hidden on staging and production. |
| `[devOnly.showButtons]` | `boolean` - Shows buttons at bottom of page for "Simulate submission" and "Simulate page reload". Data such as the confirmation number, submission date, and pdf url, for example, may not be shown if you navigate directly to the confirmation page, so pressing this button will populate these. |
| `[devOnly.mockData]` | `object` - data to populate the `ChapterCollapsibleSection` on clicking "Simulate submission" |

## Subcomponents
| Subcomponent | Description | Props |
| --- | --- | --- |
| `SubmissionAlert` | The top alert that displays the confirmation number and submit date. Accepts props to change the `status`, `title`, `content`, `actions` |
| `SavePdfDownload` | The section that allows the user to download a PDF of their submission. Hidden if `pdfUrl` not provided. |
| `ChapterSectionCollection` | The "Information you submitted..." section. All of the user's `formData`, by chapter. Display of fields in this section can be overridden using `ui:confirmationView`. |
| `PrintThisPage` | The print section that allows the user to print the confirmation page. |
| `WhatsNextProcessList` | The process list of next steps for the user. You can customize the content, or you may want to entirely replace this component if you have different steps. |
| `HowToContact` | The section that displays how to contact the VA. You can replace the title/content, or you may want to replace the entire component if you have specific recommendation for your application. |
| `GoBackLink` | Defaults to `/`. Can be customized. |
| `NeedHelp` | The section that displays how to get help. Can replace the content. |

## Conflicting imports

You can rename the import if you have name conflicts.
```jsx
import { ConfirmationView as ConfirmationViewV2 } from 'platform/forms-system/src/js/components/ConfirmationView';

<ConfirmationViewV2
  submitDate={submitDate}
  confirmationNumber={confirmationNumber}
  formConfig={formConfig}
  pdfUrl={submission?.response?.pdfUrl}
/>;
```

## A/B Testing

If you want to A/B test the old confirmation vs the new on dev/staging/prod, one suggestion is to test only on dev first, or use a toggler with flipper.

```jsx
if (environment.isLocalhost() || environment.isDev()) {
  return (<ConfirmationView
    submitDate={submitDate}
    confirmationNumber={confirmationNumber}
    formConfig={formConfig}
    pdfUrl={submission?.response?.pdfUrl}
  />);
}

return (<OldConfirmationPage />);
```

Or use a toggler with flipper:
```jsx
<Toggler toggleName={Toggler.TOGGLE_NAMES.ConfirmationPageNew10210}>
    <Toggler.Enabled>
      <ConfirmationView
        submitDate={submitDate}
        confirmationNumber={confirmationNumber}
        formConfig={formConfig}
        pdfUrl={submission?.response?.pdfUrl}
      />
    </Toggler.Enabled>

    <Toggler.Disabled>
      <OldConfirmationPage />
    </Toggler.Disabled>
</Toggler>
```

## Updating tests
If your unit tests break when migrating to the new pattern, be sure to include `route.formConfig` prop either manually or through redux `connect` to the `ConfirmationPage` component to give to `ConfirmationView`.

Before:
```jsx
<ConfirmationPage />
```

After:
```jsx
<ConfirmationPage route={{ formConfig }} />
```