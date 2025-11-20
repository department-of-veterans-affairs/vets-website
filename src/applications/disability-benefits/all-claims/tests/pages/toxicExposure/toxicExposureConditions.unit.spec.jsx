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
import ToxicExposureConditions from '../../../components/confirmationFields/ToxicExposureConditions';

describe('Toxic Exposure Conditions', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.toxicExposureConditions;

  it('expect that nothing shows up when user selects "I am not claiming any conditions related to toxic exposure" checkbox', () => {
    const formData = {
      toxicExposure: {
        conditions: {
          none: true,
        },
      },
      newDisabilities: [{ condition: 'Asthma' }, { condition: 'COPD' }],
    };
    const { queryByText } = render(
      <ToxicExposureConditions formData={formData} />,
    );

    expect(queryByText(/toxic exposure/i)).to.be.null;
    expect(queryByText(/none claimed/i)).to.be.null;
    expect(queryByText(/asthma/i)).to.be.null;
    expect(queryByText(/copd/i)).to.be.null;
  });

  it('expect that nothing shows up when no toxic exposure selection is made (the question is optional)', () => {
    const formData = {
      toxicExposure: {
        conditions: {},
      },
      newDisabilities: [{ condition: 'Asthma' }, { condition: 'COPD' }],
    };
    const { queryByText } = render(
      <ToxicExposureConditions formData={formData} />,
    );

    expect(queryByText(/toxic exposure/i)).to.be.null;
    expect(queryByText(/none claimed/i)).to.be.null;
    expect(queryByText(/asthma/i)).to.be.null;
    expect(queryByText(/copd/i)).to.be.null;
  });

  it('renders claimed toxic exposure conditions', () => {
    const formData = {
      toxicExposure: {
        conditions: {
          asthma: true,
          copd: true,
        },
      },
      newDisabilities: [
        { condition: 'Asthma' },
        { condition: 'COPD' },
        { condition: 'Sleep Apnea' },
      ],
    };
    const { getByRole, queryByText, getByText } = render(
      <ToxicExposureConditions formData={formData} />,
    );
    expect(getByRole('heading', { name: /toxic exposure/i })).to.exist;
    expect(getByText(/asthma/i)).to.exist;
    expect(getByText(/copd/i)).to.exist;
    expect(queryByText(/sleep apnea/i)).to.be.null;
    expect(queryByText(/none claimed/i)).to.be.null;
  });

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

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect($('va-checkbox-group').error).to.equal(noneAndConditionError);
    });
  });

  describe('ui:confirmationField', () => {
    it('should render the custom ToxicExposureConditions confirmation component', () => {
      const formData = {
        toxicExposure: {
          conditions: {
            anemia: true,
            tinnitus: true,
          },
        },
      };

      const confirmationField = uiSchema['ui:confirmationField']({ formData });
      const { container } = render(confirmationField);

      const heading = container.querySelector('h4');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Toxic Exposure');
      // Check that the list includes exactly 2 claimed conditions
      const list = heading.nextElementSibling;
      const items = list.querySelectorAll('li');
      expect(items.length).to.equal(0);
    });

    it('should not render the component if "none" is selected', () => {
      const formData = {
        toxicExposure: {
          conditions: {
            none: true,
          },
        },
      };

      const confirmationField = uiSchema['ui:confirmationField']({ formData });
      expect(confirmationField).to.be.null;
    });
  });
});
