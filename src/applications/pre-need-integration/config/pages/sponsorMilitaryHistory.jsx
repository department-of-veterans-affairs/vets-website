import { merge } from 'lodash';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';

import { selfServiceRecordsUI } from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    veteran: {
      serviceRecords: merge({}, selfServiceRecordsUI, {
        'ui:title': 'Sponsor’s service period(s)',
        items: {
          'ui:order': [
            'serviceBranch',
            'dateRange',
            'highestRank',
            'dischargeType',
            'nationalGuardState',
          ],
          serviceBranch: {
            'ui:title': 'Sponsor’s branch of service',
          },
          dateRange: dateRangeUI(
            'Sponsor’s Service Start Date',
            'Sponsor’s Service End Date',
            'Service start date must be before end date',
          ),
          dischargeType: {
            'ui:title': 'Sponsor’s discharge character of service',
          },
          highestRank: {
            'ui:title': 'Sponsor’s highest rank attained',
          },
          nationalGuardState: {
            'ui:title': 'Sponsor’s state (for National Guard Service only)',
          },
        },
      }),
    },
    'ui:options': {
      customTitle: ' ',
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: {
            serviceRecords: veteran.properties.serviceRecords,
          },
        },
      },
    },
  },
};
