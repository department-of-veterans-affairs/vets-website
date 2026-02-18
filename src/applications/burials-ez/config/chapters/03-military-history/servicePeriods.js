import React from 'react';
import PropTypes from 'prop-types';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530EZ-schema.json';
import format from 'date-fns-tz/format';
import parseISO from 'date-fns/parseISO';
import {
  currentOrPastDateUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateDateRange } from '@department-of-veterans-affairs/platform-forms-system/validation';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';

import { DateReviewField } from '../../../utils/helpers';
import ListItemView from '../../../components/ListItemView';

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
    from: {
      ...currentOrPastDateUI(from),
      'ui:reviewField': props => (
        <DateReviewField {...props} title="Service start date" />
      ),
    },
    to: {
      ...currentOrPastDateUI(to),
      'ui:reviewField': props => (
        <DateReviewField {...props} title="Service end date" />
      ),
    },
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
    ...titleUI('Service periods'),
    'ui:options': {
      pageClass: 'service-period-view',
    },
    toursOfDuty: {
      'ui:options': {
        itemName: 'Service period',
        viewField: ServicePeriodView,
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
        rank: textUI({
          title: 'Grade, rank or rating',
          width: 'lg',
        }),
        placeOfEntry: textUI({
          title: 'Place of entry',
          hint: 'Enter the city and state or name of the military base',
        }),
        placeOfSeparation: textUI({
          title: 'Place of separation',
          hint: 'Enter the city and state or name of the military base',
        }),
        unit: textUI('Unit'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      toursOfDuty,
    },
  },
};
