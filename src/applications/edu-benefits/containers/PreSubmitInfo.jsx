import React from 'react';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import { connect } from 'react-redux';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

function PreSubmitNotice({ formData, showError, setPreSubmit }) {
  const privacyAgreementAccepted = formData.privacyAgreementAccepted || false;

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

  return <>{privacyAgreement}</>;
}

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(PreSubmitNotice);
