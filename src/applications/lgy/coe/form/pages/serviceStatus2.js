import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { serviceStatuses } from '../constants';

export default {
  uiSchema: {
    ...titleUI(
      'Service status',
      'Later in this form you will be asked to upload documents confirming your service.',
    ),
    identity: radioUI({
      title: 'Which of these describes you?',
      labels: {
        [serviceStatuses.VETERAN]:
          "I'm a Veteran, or previously activated member of the National Guard or Reserves",
        [serviceStatuses.ADSM]: "I'm an active-duty service member",
        [serviceStatuses.NADNA]:
          "I'm a current member of the National Guard or Reserves and was never activated",
        [serviceStatuses.DNANA]:
          "I'm a discharged member of the National Guard and was never activated",
        [serviceStatuses.DRNA]:
          "I'm a discharged member of the Reserves and was never activated",
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      identity: radioSchema([
        serviceStatuses.VETERAN,
        serviceStatuses.ADSM,
        serviceStatuses.NADNA,
        serviceStatuses.DNANA,
        serviceStatuses.DRNA,
      ]),
    },
    required: ['identity'],
  },
};
