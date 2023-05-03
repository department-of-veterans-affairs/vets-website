import React from 'react';
import { DBQ_URL } from '../constants';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

const alertContent = (
  <>
    <p className="vads-u-font-size--base">
      You’ll need to upload your completed{' '}
      <a href={DBQ_URL} target="_blank" rel="noreferrer">
        Separation Health Assessment - Part A Self-Assessment
      </a>{' '}
      so we can request your VA exams. Use a desktop computer or laptop to
      download and fill out the form.
    </p>
    <p>
      You can submit this form on VA.gov after you file your BDD claim. Go to My
      VA to find your claim. When you upload your Separation Health Assessment,
      select this for document type:{' '}
      <strong>Disability Benefits Questionaire</strong>.
    </p>
  </>
);

export const BddConfirmationAlert = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isShowBDDSHA = useToggleValue(TOGGLE_NAMES.form526BddSha);

  return (
    isShowBDDSHA && (
      <div className="vads-u-margin-top--2">
        <va-alert status="warning">
          <h3 slot="headline">
            Submit your Separation Health Assessment - Part A Self-Assessment
            now if you haven’t already
          </h3>
          {alertContent}
        </va-alert>
      </div>
    )
  );
};
