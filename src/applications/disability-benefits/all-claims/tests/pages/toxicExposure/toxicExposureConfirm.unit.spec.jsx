import React from 'react';
import { render } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import userEvent from '@testing-library/user-event';
import formConfig from '../../../config/form';
import { confirmQuestion } from '../../../content/toxicExposure';

describe('Toxic Exposure Confirm', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.toxicExposureConfirm;

  it('should render confirm page', () => {
    const screen = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    // verify both options are present
    screen.getByRole('radio', { name: 'Yes' });
    screen.getByRole('radio', { name: 'No' });

    screen.getByText(confirmQuestion);
  });

  it('should display error when none of the options are selected', () => {
    const screen = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    userEvent.click(screen.getByRole('button'));

    screen.getByText('Please provide a response');
  });
});
