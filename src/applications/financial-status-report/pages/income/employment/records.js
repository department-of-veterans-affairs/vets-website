import React from 'react';
import ItemLoop from '../../../components/shared/ItemLoop';
import CardDetailsView from '../../../components/shared/CardDetailsView';
import EmploymentRecord from '../../../components/employment/EmploymentRecord';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">Your work history</legend>
      <p>
        Tell us about the jobs you’ve had in the past 2 years that you received
        paychecks for. You’ll need to provide your income information for any
        current job.
      </p>
    </>
  ),
  personalData: {
    employmentHistory: {
      veteran: {
        employmentRecords: {
          'ui:field': ItemLoop,
          'ui:options': {
            viewField: CardDetailsView,
            doNotScroll: true,
            itemName: 'job',
            keepInPageOnReview: true,
          },
          items: {
            'ui:field': EmploymentRecord,
            'ui:options': {
              classNames: 'vads-u-margin-bottom--3',
              userType: 'veteran',
              userArray: 'currEmployment',
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
            veteran: {
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
