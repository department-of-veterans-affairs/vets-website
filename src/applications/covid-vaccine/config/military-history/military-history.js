import { serviceBranchEnum, dischargeTypeEnum } from './helper';

export const schema = {
  militaryHistory: {
    type: 'object',
    properties: {
      lastBranchOfService: {
        type: 'string',
        enum: serviceBranchEnum(),
      },
      serviceStartYear: {
        type: 'string',
      },
      serviceEndYear: {
        type: 'string',
      },
      characterOfService: {
        type: 'string',
        enum: dischargeTypeEnum(),
      },
    },
  },
};

export const uiSchema = {
  militaryHistory: {
    lastBranchOfService: {
      'ui:title': 'Last branch of service',
      'ui:required': () => {
        return true;
      },
    },
    serviceStartYear: {
      'ui:title': 'Service start year',
      'ui:required': () => {
        return true;
      },
    },
    serviceEndYear: {
      'ui:title': 'Service end year',
      'ui:required': () => {
        return true;
      },
    },
    characterOfService: {
      'ui:title': 'Character of service',
      'ui:required': () => {
        return true;
      },
    },
  },
};
