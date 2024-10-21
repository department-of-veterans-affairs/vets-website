// added until testing of new radio buttons is completed

import React from 'react';
import { VaPrivacyAgreement } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

function PreSubmitInfo({ formData, showError, setPreSubmit }) {
  const privacyAgreementAccepted = formData.privacyAgreementAccepted || false;

  return (
    <VaPrivacyAgreement
      class="vads-u-margin-y--4"
      name="privacyAgreementAccepted"
      onVaChange={event =>
        setPreSubmit('privacyAgreementAccepted', event.detail.checked)
      }
      showError={showError && !privacyAgreementAccepted}
    />
  );
}

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(PreSubmitInfo);
