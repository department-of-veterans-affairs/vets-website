import React from 'react';
import { DBQ_URL } from '../constants';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

const alertContent = (
  <p className="vads-u-font-size--base">
    You’ll need to submit your completed{' '}
    <a href={DBQ_URL} target="_blank" rel="noreferrer">
      Separation Health Assessment - Part A Self-Assessment
    </a>{' '}
    so we can request your VA exams. You can submit this form on VA.gov after
    you file your BDD claim.
  </p>
);

export const BddEvidenceSubmitLater = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isShowBDDSHA = useToggleValue(TOGGLE_NAMES.form526BddSha);

  return (
    isShowBDDSHA && (
      <div aria-live="polite">
        <va-alert status="warning">
          <h3 slot="headline">
            Submit your Separation Health Assessment - Part A Self-Assessment as
            soon as you can
          </h3>
          {alertContent}
        </va-alert>
      </div>
    )
  );
};
