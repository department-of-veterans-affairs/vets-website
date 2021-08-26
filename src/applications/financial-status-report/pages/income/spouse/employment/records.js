import React from 'react';
import ItemLoop from '../../../../components/ItemLoop';
import CardDetailsView from '../../../../components/CardDetailsView';
import EmploymentRecord from '../../../../components/EmploymentRecord';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        Your spouse’s employment information
      </legend>
      <p className="vads-u-padding-top--2">
        Tell us about the jobs your spouse has had in the past two years for
        which they received paychecks. You’ll need to provide their income
        information for any current job.
      </p>
    </>
  ),
  personalData: {
    employmentHistory: {
      spouse: {
        employmentRecords: {
          'ui:field': ItemLoop,
          'ui:options': {
            viewField: CardDetailsView,
            doNotScroll: true,
            showSave: true,
            itemName: 'job',
            keepInPageOnReview: true,
          },
          items: {
            'ui:field': EmploymentRecord,
            'ui:options': {
              classNames: 'vads-u-margin-bottom--3',
              userType: 'spouse',
              userArray: 'spCurrEmployment',
            },
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        employmentHistory: {
          type: 'object',
          properties: {
            spouse: {
              type: 'object',
              properties: {
                employmentRecords: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['type', 'to', 'from', 'employerName'],
                    properties: {
                      type: {
                        type: 'string',
                        enum: [
                          'Full time',
                          'Part time',
                          'Seasonal',
                          'Temporary',
                        ],
                      },
                      from: {
                        type: 'string',
                      },
                      to: {
                        type: 'string',
                      },
                      isCurrent: {
                        type: 'boolean',
                      },
                      employerName: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
