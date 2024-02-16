import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PropTypes from 'prop-types';
import ArrayBuilderSummaryCardList from '../arrayBuilder/components/ArrayBuilderSummaryCardList';

const CardContent = ({ item }) => {
  const incomplete =
    !item?.name ||
    !item?.address?.country ||
    !item?.address?.city ||
    !item?.address?.street ||
    !item?.address?.postalCode;
  return (
    <>
      {incomplete && (
        <div className="vads-u-margin-bottom--1">
          <span className="usa-label">INCOMPLETE</span>
        </div>
      )}
      <div className="vads-u-font-weight--bold">{item?.name}</div>
      <div>
        {item?.dateStart} - {item?.dateEnd}
      </div>
      {incomplete && (
        <div className="vads-u-margin-top--2">
          <va-alert status="warning" uswds>
            This item is missing information. Edit and complete this item’s
            information before continuing.
          </va-alert>
        </div>
      )}
    </>
  );
};

CardContent.propTypes = {
  item: PropTypes.object,
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': (
      <ArrayBuilderSummaryCardList
        title="Review your employers"
        CardContent={CardContent}
        arrayPath="employers"
        itemBasePathUrl="/array-multiple-page-builder-item-page-1"
        removeTitle="Are you sure you want to remove this employer?"
        removeDescription={itemName =>
          `This will remove ${itemName} and all their information from your list of employers.`
        }
        removeYesLabel="Yes, remove this employer"
      />
    ),
    hasEmployment: yesNoUI({
      updateUiSchema: formData => {
        return formData?.employers?.length
          ? {
              'ui:title': `Do you have another employer to report?`,
              'ui:options': {
                labelHeaderLevel: '',
                hint: '',
                labels: {
                  Y: 'Yes, I have another employer to report',
                  N: 'No, I don’t have another employer to report',
                },
              },
            }
          : {
              'ui:title': `Do you have any employment, including self-employment for the last 5 years to report?`,
              'ui:options': {
                labelHeaderLevel: '3',
                hint:
                  'Include self-employment and military duty (including inactive duty for training).',
                labels: {
                  Y: 'Yes, I have employment to report',
                  N: 'No, I don’t have employment to report',
                },
              },
            };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      hasEmployment: yesNoSchema,
    },
    required: ['hasEmployment'],
  },
};
