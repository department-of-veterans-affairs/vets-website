import React from 'react';
import PropTypes from 'prop-types';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import format from 'date-fns-tz/format';
import parseISO from 'date-fns/parseISO';
import { currentOrPastDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import { validateDateRange } from '@department-of-veterans-affairs/platform-forms-system/validation';
import {
  VaTextInputField,
  VaSelectField,
} from 'platform/forms-system/src/js/web-component-fields';

import {
  serviceNumberSchema,
  serviceNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns/ssnPattern';
import { generateTitle, generateHelpText } from '../../../utils/helpers';
import ListItemView from '../../../components/ListItemView';
import ReviewRowView from '../../../components/ReviewRowView';

const { toursOfDuty } = fullSchemaBurials.properties;

function formatDate(dateString) {
  const date = parseISO(dateString);
  return format(date, 'LLLL d, yyyy');
}

export function dateRangeUI(
  from = 'From',
  to = 'To',
  rangeError = 'To date must be after From date',
) {
  return {
    'ui:validations': [validateDateRange],
    'ui:errorMessages': {
      pattern: rangeError,
      required: 'Please enter a date',
    },
    from: currentOrPastDateUI(from),
    to: currentOrPastDateUI(to),
  };
}

export function ServicePeriodView({ formData }) {
  const from = formData?.dateRange?.from
    ? formatDate(formData?.dateRange?.from)
    : '';
  const to = formData?.dateRange?.to ? formatDate(formData?.dateRange?.to) : '';

  return (
    <>
      <ListItemView title={formData?.serviceBranch} />
      <p>{formData?.dateRange ? `${from} - ${to}` : ''}</p>
    </>
  );
}

ServicePeriodView.propTypes = {
  formData: PropTypes.shape({
    dateRange: PropTypes.object,
    serviceBranch: PropTypes.string,
  }),
};

export default {
  uiSchema: {
    'ui:title': generateTitle('Service periods'),
    'ui:options': {
      pageClass: 'service-period-view',
    },
    militaryServiceNumber: {
      ...serviceNumberUI('Military Service number'),
      'ui:description': generateHelpText(
        'Enter this only if the deceased Veteran has one',
      ),
      'ui:reviewField': ReviewRowView,
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
    toursOfDuty: {
      'ui:options': {
        itemName: 'Service period',
        viewField: ServicePeriodView,
        uswds: true,
        classNames: 'vads-u-margin--0',
        reviewTitle: 'Service periods',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
        itemAriaLabel: entry => entry.serviceBranch,
      },
      items: {
        dateRange: {
          ...dateRangeUI(
            'Service start date',
            'Service end date',
            'End of service must be after start of service',
          ),
        },
        serviceBranch: {
          'ui:title': 'Branch of service',
          'ui:webComponentField': VaSelectField,
          'ui:required': () => true,
        },
        rank: {
          'ui:title': 'Grade, rank or rating',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            width: 'lg',
          },
        },
        placeOfEntry: {
          'ui:title': 'Place of entry',
          'ui:description': generateHelpText(
            'Enter the city and state or name of the military base',
          ),
          'ui:webComponentField': VaTextInputField,
        },
        placeOfSeparation: {
          'ui:title': 'Place of separation',
          'ui:description': generateHelpText(
            'Enter the city and state or name of the military base',
          ),
          'ui:webComponentField': VaTextInputField,
        },
        unit: {
          'ui:title': 'Unit',
          'ui:webComponentField': VaTextInputField,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceNumber: serviceNumberSchema,
      toursOfDuty,
    },
  },
};
