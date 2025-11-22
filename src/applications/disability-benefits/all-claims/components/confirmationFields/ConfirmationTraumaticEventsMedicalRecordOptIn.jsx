import React from 'react';
import PropTypes from 'prop-types';
import {
  TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_TITLE,
  TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_SECTION_TITLE,
} from '../../constants';
import { CONSENT_OPTION_INDICATOR_CHOICES } from '../../content/form0781/consentPage';

const ConfirmationTraumaticEventsMedicalRecordOptIn = ({ formData }) => {
  const optionIndicator = formData?.optionIndicator;

  if (!optionIndicator) {
    return null;
  }

  const getDisplayText = indicator => {
    return CONSENT_OPTION_INDICATOR_CHOICES[indicator] || indicator;
  };

  return (
    <li>
      <h4>{TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_SECTION_TITLE}</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        <li>
          <div className="vads-u-color--gray">
            {TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_TITLE}
          </div>
          <div>{getDisplayText(optionIndicator)}</div>
        </li>
      </ul>
    </li>
  );
};

ConfirmationTraumaticEventsMedicalRecordOptIn.propTypes = {
  formData: PropTypes.shape({
    optionIndicator: PropTypes.string,
  }),
};

export default ConfirmationTraumaticEventsMedicalRecordOptIn;
