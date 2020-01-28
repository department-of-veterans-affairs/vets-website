import { SET_SUBMISSION } from '../../../platform/forms-system/src/js/actions';
import recordEvent from '../../../platform/monitoring/record-event';
import get from 'lodash/get';

const analyticsEvents = [
  {
    action: SET_SUBMISSION,
    event: store => {
      const state = store.getState();
      if (!get(state, 'form.data.privacyAgreementAccepted', false)) {
        recordEvent({
          event: 'edu-0994--response-missing',
          'missing-field-question':
            'Education - Form 22-0994 - Review Application - Privacy Policy Agreement',
        });
      }
    },
  },
];

export default analyticsEvents;
