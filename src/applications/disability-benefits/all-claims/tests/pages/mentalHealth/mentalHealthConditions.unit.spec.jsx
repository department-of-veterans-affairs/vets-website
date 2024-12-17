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
} from '../../../content/mentalHealth';
import formConfig from '../../../config/form';

describe('Mental health conditions', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.mentalHealthConditions;

  it('should render conditions page with multiple conditions', async () => {
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

    const addlInfo = container.querySelector('va-accordion-item');
    const headline = addlInfo.querySelector('h3[slot="headline"]');
    expect(headline).to.have.text('Examples of traumatic events');

    await waitFor(() => {
      expect($$('va-checkbox-group', container).length).to.equal(1);
      expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
        conditionsQuestion,
      );

      expect($$('va-checkbox', container).length).to.equal(3);
      expect($(`va-checkbox[label="Anemia"]`, container)).to.exist;
      expect(
        $(
          `va-checkbox[label="Tinnitus (ringing or hissing in ears)"]`,
          container,
        ),
      ).to.exist;
      expect(
        $(
          `va-checkbox[label="I am not claiming any mental health conditions related to a traumatic event."]`,
          container,
        ),
      ).to.exist;
    });
  });

  it('should display error when condition and "none" selected', async () => {
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
