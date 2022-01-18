import recordEvent from 'platform/monitoring/record-event';
import { get } from 'lodash';

export default {
  application: formData => {
    if (get(formData, 'view:directDeposit.declineDirectDeposit', false)) {
      recordEvent({
        event: 'int-checkbox-option-click',
        'checkbox-label': 'I don’t want to use direct deposit',
      });
    }

    const hasSelectedProgram = get(
      formData,
      'view:programSelection.hasSelectedProgram',
      null,
    );
    if (hasSelectedProgram !== null) {
      recordEvent({
        event: 'int-radio-button-option-click',
        'radio-button-label':
          "Do you know which program you'd like to enroll in?",
        'radio-button-optionLabel': hasSelectedProgram ? 'Yes' : 'No',
        'radio-button-required': true,
      });
    }

    const providerName = get(
      formData,
      'view:programSelection.providerName',
      null,
    );
    if (providerName !== null) {
      recordEvent({
        event: 'int-text-input-blur',
        'text-input-label':
          "What's the name of the school or training provider?",
        'text-input-value': providerName,
      });
    }

    const programName = get(
      formData,
      'view:programSelection.programName',
      null,
    );
    if (programName !== null) {
      recordEvent({
        event: 'int-text-input-blur',
        'text-input-label': "What's the name of the program?",
        'text-input-value': programName,
      });
    }

    const programState = get(
      formData,
      'view:programSelection.programState',
      null,
    );
    if (programState !== null) {
      recordEvent({
        event: 'int-text-input-blur',
        'text-input-label': 'Which state is the program in?',
        'text-input-value': programState,
      });
    }
  },
};
