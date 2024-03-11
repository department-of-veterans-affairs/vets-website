import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  conditionsPageTitle,
  conditionsQuestion,
  noneAndConditionError,
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

    const addlInfo = container.querySelector('va-additional-info');
    expect(addlInfo).to.have.attribute('trigger', 'What is toxic exposure?');

    await waitFor(() => {
      expect($$('va-checkbox-group', container).length).to.equal(1);
      expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
        conditionsQuestion,
      );

      expect($$('va-checkbox', container).length).to.equal(3);
      expect($(`va-checkbox[label="Anemia"]`, container)).to.exist;
      expect(
        $(
          `va-checkbox[label="Tinnitus (Ringing Or Hissing In Ears)"]`,
          container,
        ),
      ).to.exist;
      expect(
        $(
          `va-checkbox[label="I am not claiming any conditions related to toxic exposure"]`,
          container,
        ),
      ).to.exist;
    });
  });

  it('should display error when condition and "none"', async () => {
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

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: true, dataset: { key: 'anemia' } },
      detail: { checked: true },
    });
    await checkboxGroup.__events.vaChange({
      target: {
        checked: true,
        dataset: { key: 'none' },
      },
      detail: { checked: true },
    });

    await userEvent.click(getByText('Submit'));
    expect($('va-checkbox-group').error).to.equal(noneAndConditionError);
  });
});
