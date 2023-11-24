import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { Link } from 'react-router';

const SummaryItemCard = ({ formData }) => {
  return (
    <div>
      <h3>Review your employers</h3>
      <span>
        <span>
          {formData.employers?.length &&
            formData.employers.map((item, index) => {
              return (
                <div key={index}>
                  <div>{item?.name}</div>
                  <div>
                    {item?.dateStart} - {item?.dateEnd}
                  </div>
                  <span>
                    <Link
                      to={`/array-multiple-step-one/${index}?=edit`}
                      className="va-button-link vads-u-margin-left--4"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/array-multiple-step-one/${index}?=edit`}
                      className="va-button-link vads-u-margin-left--4"
                    >
                      Remove
                    </Link>
                  </span>
                </div>
              );
            })}
        </span>
      </span>
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': ({ formData }) => {
      if (formData?.employers?.length > 0) {
        return <SummaryItemCard formData={formData} />;
      }
      return <div />;
    },
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
