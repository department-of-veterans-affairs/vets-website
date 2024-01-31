import React from 'react';
import PropTypes from 'prop-types';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
// import ServicePeriodView from '@department-of-veterans-affairs/platform-forms/ServicePeriodView';
import { formatReviewDate } from '@department-of-veterans-affairs/platform-forms-system/helpers';
import dateRangeUI from '@department-of-veterans-affairs/platform-forms-system/dateRange';
import { generateTitle, generateHelpText } from '../../../utils/helpers';
import ListItemView from '../../../components/ListItemView';

const { toursOfDuty } = fullSchemaBurials.properties;

export function ServicePeriodView({ formData }) {
  let from = '';
  let to = '';
  if (formData?.dateRange) {
    from = formatReviewDate(formData?.dateRange?.from);
    to = formatReviewDate(formData?.dateRange?.to);
  }

  return (
    <>
      <ListItemView title={formData?.serviceBranch} />
      <p>{formData?.dateRange ? `${from} - ${to}` : ''}</p>
    </>
  );
}

ServicePeriodView.propTypes = {
  formData: PropTypes.shape({
    dateRange: PropTypes.string,
    serviceBranch: PropTypes.string,
  }),
};

export default {
  uiSchema: {
    'ui:title': generateTitle('Service periods'),
    militaryServiceNumber: {
      'ui:title': 'Military Service number',
      'ui:description': generateHelpText(
        'Enter this only if the deceased Veteran has one',
      ),
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
    toursOfDuty: {
      'ui:options': {
        itemName: 'Service Period',
        viewField: ServicePeriodView,
        hideTitle: true,
        classNames: 'vads-u-margin--0',
        reviewTitle: 'Service periods',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
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
        },
        rank: {
          'ui:title': 'Grade, rank or rating',
        },
        placeOfEntry: {
          'ui:title': 'Place of entry',
        },
        placeOfSeparation: {
          'ui:title': 'Place of separation',
        },
        unit: {
          'ui:title': 'Unit',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceNumber: {
        type: 'string',
      },
      toursOfDuty,
    },
  },
};
