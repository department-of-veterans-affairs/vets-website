import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { DBQ_URL } from '../constants';
// import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

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
      When you upload your Separation Health Assessment, select this for
      document type: <strong>Disability Benefits Questionaire</strong>
    </p>
  </>
);

export const selfAssessmentAlert = () => {
  // TODO: fix me. adding the toggle here breaks the unit tests :'(
  // const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  // const isShowBDDSHA = useToggleValue(TOGGLE_NAMES.form526BddSha);

  const isShowBDDSHA = !environment.isProduction();

  return (
    isShowBDDSHA && (
      <>
        <va-alert status="warning">
          <h3 slot="headline">
            Please submit your Separation Health Assessment - Part A
            Self-Assessment as soon as possible
          </h3>
          {alertContent}
        </va-alert>
        <h3>Other documents or evidence</h3>
      </>
    )
  );
};
