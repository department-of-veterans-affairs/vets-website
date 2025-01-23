import React from 'react';
import { VaPrivacyAgreement } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

function PreSubmitNotice({ formData, showError, setPreSubmit }) {
  const privacyAgreementAccepted = formData.privacyAgreementAccepted || false;

  const privacyAgreement = (
    <div>
      <div>
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </div>
      <VaPrivacyAgreement
        name="privacyAgreementAccepted"
        onVaChange={event =>
          setPreSubmit('privacyAgreementAccepted', event.detail.checked)
        }
        showError={showError && !privacyAgreementAccepted}
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
