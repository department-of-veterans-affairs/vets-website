import { cloneDeep } from 'lodash';
import {
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const blankSchema = { type: 'object', properties: {} };

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const sponsorNameSchema = {
  uiSchema: {
    ...titleUI('Sponsor information', ({ formData }) => {
      const isBeneficiary = formData?.certifierRole === 'applicant';
      return `Enter the information for the sponsor (this is the Veteran or service member 
        the beneficiary is connected to). We’ll use the sponsor’s information to verify ${
          isBeneficiary ? 'your' : 'the beneficiary’s'
        } eligibility.`;
    }),
    sponsorName: fullNameMiddleInitialUI,
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      sponsorName: fullNameSchema,
    },
  },
};
