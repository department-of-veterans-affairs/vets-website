import React from 'react';
import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { CancelButton } from '../../helpers';

export const intro = {
  uiSchema: {
    ...titleUI({
      title: 'Your children',
      description: () => {
        return (
          <>
            <p>
              In the next few questions, we’ll ask you about your children. You
              must add at least one child.
            </p>
            <CancelButton dependentType="children" isAddChapter />
          </>
        );
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
