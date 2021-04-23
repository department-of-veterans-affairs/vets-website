import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import environment from 'platform/utilities/environment';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

function PreSubmitNotice({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  const privacyAgreementAccepted = formData.privacyAgreementAccepted || false;

  // set AGREED (onSectionComplete) to value of privacyAgreementAccepted
  // if goes to another page (unmount), set AGREED (onSectionComplete) to false
  useEffect(
    () => {
      onSectionComplete(privacyAgreementAccepted);

      return () => {
        onSectionComplete(false);
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [privacyAgreementAccepted],
  );

  const activeDutyNote = (
    <div className="vads-u-margin-bottom--3">
      {formData.activeDuty ? (
        <div>
          <strong>By submitting this form you certify that:</strong>
          <ul>
            <li>
              All statements in this application are true and correct to the
              best of your knowledge and belief
            </li>
            <li>
              As an active duty servicemember, you have consulted with an
              Education Service Officer (ESO) regarding your education program
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <strong>By submitting this form</strong> you certify that all
          statements in this application are true and correct to the best of
          your knowledge and belief.
        </div>
      )}
    </div>
  );

  const privacyAgreementLabel = (
    <span>
      I have read and accept the{' '}
      <a
        aria-label="Privacy policy, will open in new tab"
        target="_blank"
        href="/privacy-policy/"
      >
        privacy policy
      </a>
    </span>
  );

  const privacyAgreement = (
    <div>
      <div>
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </div>
      <Checkbox
        required
        checked={privacyAgreementAccepted}
        onValueChange={value => setPreSubmit('privacyAgreementAccepted', value)}
        name={'privacyAgreementAccepted'}
        errorMessage={
          showError && !privacyAgreementAccepted
            ? 'You must accept the privacy policy before continuing.'
            : undefined
        }
        label={privacyAgreementLabel}
      />
    </div>
  );

  return (
    <>
      {!environment.isProduction() && activeDutyNote}
      {privacyAgreement}
    </>
  );
}

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(PreSubmitNotice);
