import React from 'react';
import { render } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import userEvent from '@testing-library/user-event';
import formConfig from '../../../config/form';

describe('Toxic Exposure Intro', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.toxicExposureIntro;

  it('should render intro page', () => {
    const screen = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    // verify options are present
    screen.getByRole('radio', { name: 'Yes' });
    screen.getByRole('radio', { name: 'No' });

    screen.getByText(
      'Would you like to answer questions related to toxic exposure?',
    );
  });

  it('should display error when none of the options are selected', () => {
    const screen = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    userEvent.click(screen.getByRole('button'));

    screen.getByText('Please provide a response');
  });
});
