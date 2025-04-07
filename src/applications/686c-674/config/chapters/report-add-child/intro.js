import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
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
            <CancelButton
              buttonText="Cancel adding children"
              dependentType="children"
              isAddChapter
            />
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
