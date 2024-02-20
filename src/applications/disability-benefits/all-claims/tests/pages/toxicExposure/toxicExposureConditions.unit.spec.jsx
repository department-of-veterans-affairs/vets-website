import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  conditionsPageTitle,
  conditionsQuestion,
} from '../../../content/toxicExposure';
import formConfig from '../../../config/form';

describe('Toxic Exposure Conditions', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.toxicExposureConditions;

  it('should render conditions page', async () => {
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
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(conditionsPageTitle);

    await waitFor(() => {
      expect($$('va-checkbox-group', container).length).to.equal(1);
      expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
        conditionsQuestion,
      );

      expect($$('va-checkbox', container).length).to.equal(3);

      expect($$(`va-checkbox[label="Anemia"]`, container)).to.exist;
      expect(
        $$(
          `va-checkbox[label="Tinnitus (Ringing Or Hissing In Ears)"]`,
          container,
        ),
      ).to.exist;
      expect(
        $$(
          `va-checkbox[label="I am not claiming any conditions related to toxic exposure"]`,
          container,
        ),
      ).to.exist;
    });
  });
});
