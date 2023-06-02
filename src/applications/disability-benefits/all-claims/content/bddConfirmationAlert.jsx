import React from 'react';
import { bddAlertBegin } from './common';

const alertContent = (
  <>
    {bddAlertBegin}
    <p>
      You can submit this form on VA.gov after you file your BDD claim. Go to My
      VA to find your claim. When you upload your Separation Health Assessment,
      select this for document type:{' '}
      <strong>Disability Benefits Questionaire</strong>.
    </p>
  </>
);

export const BddConfirmationAlert = () => {
  return (
    <div className="vads-u-margin-top--2">
      <va-alert status="warning">
        <h3 slot="headline">
          Submit your Separation Health Assessment - Part A Self-Assessment now
          if you haven’t already
        </h3>
        {alertContent}
      </va-alert>
    </div>
  );
};
