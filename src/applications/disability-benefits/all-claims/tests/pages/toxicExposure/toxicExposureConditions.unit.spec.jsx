import React from 'react';
import { render } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import {
  conditionsPageTitle,
  conditionsQuestion,
} from '../../../content/toxicExposure';

describe('Toxic Exposure Conditions', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.toxicExposureConditions;

  it('should render conditions page', () => {
    const formData = {
      newDisabilities: [
        {
          cause: 'NEW',
          condition: 'psoriasis',
          'view:descriptionInfo': {},
        },
        {
          cause: 'NEW',
          condition: 'acne',
          'view:descriptionInfo': {},
        },
      ],
    };
    const screen = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    screen.getByText(conditionsPageTitle);
    screen.getByText(conditionsQuestion);
    screen.getByText(
      'Toxic exposures include exposures to substances like Agent Orange',
      { exact: false },
    );

    // checkboxes built based on new conditions
    screen.getByLabelText('Psoriasis');
    screen.getByLabelText('Acne');
  });
});
