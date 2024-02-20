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
          primaryDescription: 'Test description',
          'view:serviceConnectedDisability': {},
          condition: 'anemia',
        },
        {
          cause: 'NEW',
          primaryDescription: 'Test description',
          'view:serviceConnectedDisability': {},
          condition: 'tinnitus (ringing or hissing in ears)',
        },
      ],
    };
    const { getByText, getByLabelText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(conditionsPageTitle);
    getByText(conditionsQuestion);
    getByText(
      'Toxic exposures include exposures to substances like Agent Orange',
      { exact: false },
    );

    // checkboxes built based on new conditions
    getByLabelText('Anemia');
    getByLabelText('Tinnitus (Ringing Or Hissing In Ears)');
  });
});
