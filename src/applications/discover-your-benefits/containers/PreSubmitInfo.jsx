// added until testing of new radio buttons is completed

import React, { useEffect } from 'react';
import { VaPrivacyAgreement } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

export const PreSubmitInfo = ({ formData, showError, setPreSubmit }) => {
  useEffect(
    () => {
      // This ensures the user will always have to accept the privacy agreement.
      setPreSubmit('privacyAgreementAccepted', false);
    },
    [setPreSubmit],
  );
  const privacyAgreementAccepted = formData.privacyAgreementAccepted || false;

  return (
    <VaPrivacyAgreement
      enableAnalytics
      class="vads-u-margin-y--4"
      name="privacyAgreementAccepted"
      onVaChange={event =>
        setPreSubmit('privacyAgreementAccepted', event.detail.checked)
      }
      showError={showError && !privacyAgreementAccepted}
    />
  );
};

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(PreSubmitInfo);
