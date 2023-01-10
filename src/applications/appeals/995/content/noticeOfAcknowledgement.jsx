import React from 'react';

export const acknowledge5103Description = ({ formContext }) => {
  const Header = formContext.onReviewPage ? 'h4' : 'h3';
  return (
    <>
      <Header>Review and acknowledge this notice of evidence needed.</Header>
      <p>
        You’ll need to submit new evidence we haven’t reviewed before that’s
        related to the issue you’re claiming.
      </p>
      <p>
        <strong>
          We’ll look for evidence that shows both of these are true:
        </strong>
      </p>
      <ul>
        <li>
          You have a current physical or mental disability (damage to your body
          or mind that makes you less able—or totally unable—to do everyday
          tasks, including meaningful work), <strong>and</strong>
        </li>
        <li>
          An event, injury, or illness that happened while you were serving in
          the military caused this disability
        </li>
      </ul>
      <p>
        You’ll need to submit or give us permission to gather medical evidence
        from a VA medical center, other federal facility, or your private health
        care provider.
      </p>
    </>
  );
};

export const acknowledge5103Error =
  'You need to certify that you have reviewed the notice of evidence needed.';

export const acknowledge = {
  certify: 'I certify that',
  reviewed: ' I have reviewed the notice of evidence needed.',
};

export const acknowledge5103Label = (
  <>
    <strong>{acknowledge.certify}</strong>
    {acknowledge.reviewed}
  </>
);

export const reviewField = () => (
  <div className="review-row">
    <dt>
      {acknowledge.certify} {acknowledge.reviewed}
    </dt>
    <dd>Yes, I certify</dd>
  </div>
);
