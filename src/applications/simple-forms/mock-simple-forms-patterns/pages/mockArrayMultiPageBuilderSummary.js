import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PropTypes from 'prop-types';
import ArrayBuilderSummaryCardList from '../arrayBuilder/components/ArrayBuilderSummaryCardList';

const CardContent = ({ item }) => (
  <>
    <div className="vads-u-font-weight--bold">{item?.name}</div>
    <div>
      {item?.dateStart} - {item?.dateEnd}
    </div>
  </>
);

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
      title: 'Do you have any employment to report?',
      description:
        'Includes self-employment and military duty (including inactive duty for training).',
      labelHeaderLevel: '3',
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
