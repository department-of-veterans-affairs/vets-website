import React from 'react';
import {
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { representativeTypeMap } from '../../utilities/helpers';

export const uiSchema = {
  'ui:description': ({ formData }) => {
    return (
      <>
        <h3>Authorization for access outside of VA’s systems</h3>
        <p className="appoint-text">
          You’ve authorized this accredited{' '}
          {representativeTypeMap[formData.repTypeRadio] || 'representative'}
          ’s team to access your records outside of VA’s information technology
          systems.
        </p>
      </>
    );
  },
  authorizeNamesTextArea: {
    ...textUI({
      title: `Enter the name of each team member who can access your records
    outside of VA’s information technology systems`,
      hint: 'Use commas to separate names',
    }),
  },
  'view:unsureNote': {
    'ui:description': formData => {
      return (
        <>
          <p className="appoint-text">
            <strong>Note:</strong> If you’re not sure who to enter, ask the
            accredited {formData.repTypeRadio || 'representative'} you’re
            appointing.{' '}
          </p>
        </>
      );
    },
  },
};

export const schema = {
  type: 'object',
  required: ['authorizeNamesTextArea'],
  properties: {
    authorizeNamesTextArea: textSchema,
    'view:unsureNote': {
      type: 'object',
      properties: {},
    },
  },
};
