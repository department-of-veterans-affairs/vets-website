import React from 'react';
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../../components/AutoSaveNotice';

export default {
  uiSchema: {
    // Auto-save notice before heading
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Funeral home details</h3>
        <p className="vads-u-margin-top--0">
          {/* TODO: Replace with final approved content */}
          Provide the funeral home’s name.
        </p>
      </>
    ),

    funeralHomeName: {
      ...textUI({
        title: 'Funeral home name',
        errorMessages: { required: 'Enter the funeral home name' },
      }),
      'ui:required': () => true,
    },
  },

  schema: {
    type: 'object',
    properties: {
      funeralHomeName: textSchema,
    },
    required: ['funeralHomeName'],
  },
};
