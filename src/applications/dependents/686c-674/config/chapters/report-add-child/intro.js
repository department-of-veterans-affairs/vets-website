import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CancelButton } from '../../helpers';

export const intro = {
  uiSchema: {
    ...titleUI('Your children'),
    'ui:description': () => (
      <>
        <p>
          In the next few questions, we’ll ask you about your children. You must
          add at least one child.
        </p>
        <CancelButton dependentType="children" isAddChapter />
      </>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
