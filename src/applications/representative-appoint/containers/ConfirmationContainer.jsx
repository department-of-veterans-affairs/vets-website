import React from 'react';
import { useSelector } from 'react-redux';
import ConfirmationPrintSign from './ConfirmationPrintSign';
import ConfirmationDigitalSubmission from './ConfirmationDigitalSubmission';

import useV2FeatureToggle from '../hooks/useV2FeatureVisibility';

export default function ConfirmationContainer() {
  const { data: formData } = useSelector(state => state.form);

  const isDigitalSubmission =
    formData.representativeSubmissionMethod === 'digital';

  const v2IsEnabled = useV2FeatureToggle();

  return (
    <>
      {v2IsEnabled && isDigitalSubmission ? (
        <ConfirmationDigitalSubmission />
      ) : (
        <ConfirmationPrintSign />
      )}
    </>
  );
}
