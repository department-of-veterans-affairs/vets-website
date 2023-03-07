import React from 'react';
import EnhancedVehicleRecord from '../../../components/EnhancedVehicleRecord';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        Your car or other vehicle
      </legend>
      <p className="vads-u-padding-top--2">
        Enter your vehicle’s information below.
      </p>
    </>
  ),
  personalData: {
    employmentHistory: {
      veteran: {
        employmentRecords: {
          'ui:field': EnhancedVehicleRecord,
          'ui:options': {
            classNames: 'vads-u-margin-bottom--3',
            userType: 'veteran',
            userArray: 'vehicles',
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
