import React from 'react';

export const Notice5103Details = () => (
  <va-additional-info
    class="vads-u-margin-top--2"
    trigger="What if I have a presumptive condition?"
  >
    <div>
      If you’re filing a claim for a condition that we now consider presumptive
      under a new law or regulation (like the PACT Act), it also counts as new
      and relevant evidence.
    </div>
  </va-additional-info>
);

export const content = {
  header: 'Review and acknowledge the notice of evidence needed.',
  error:
    'You need to certify that you have reviewed the notice of evidence needed.',
  label:
    'I certify that I have reviewed the notice of evidence needed or I received my decision less than 1 year ago.',
  update: 'Update page',
  updateLabel: 'Update notice of evidence needed page',
  descriptionInCheckbox: (
    <>
      <p>
        If you’re filing a Supplemental Claim more than 1 year after you got
        your decision notice, you’ll need to review and acknowledge our notice
        of evidence needed for your disability claim.
      </p>
      <p>
        <va-link
          href="/disability/how-to-file-claim/evidence-needed/"
          external
          text="Review the notice of evidence needed"
        />
      </p>
    </>
  ),
};

export const reviewField = ({ children }) => (
  <div className="review-row">
    <dt>{content.label}</dt>
    <dd>
      {children?.props?.formData ? (
        'Yes, I certify'
      ) : (
        <span className="usa-input-error-message">No, I didn’t certify</span>
      )}
    </dd>
  </div>
);
