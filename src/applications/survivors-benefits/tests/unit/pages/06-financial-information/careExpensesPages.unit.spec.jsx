import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  careExpensesPages,
  options,
} from '../../../../config/chapters/06-financial-information/careFacilityExpenses/careExpensesPages';
import {
  careRecipientLabels,
  careFrequencyLabels,
} from '../../../../utils/labels';

const arrayPath = 'careExpenses';

describe('Care Expenses Pages', () => {
  it('renders the care expenses page intro', async () => {
    const { careExpensesIntro } = careExpensesPages;

    const form = render(
      <DefinitionTester
        schema={careExpensesIntro.schema}
        uiSchema={careExpensesIntro.uiSchema}
        data={{}}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(careExpensesIntro.title);
  });

  it('renders the care expenses recipient page', async () => {
    const { careRecipientPage } = careExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careRecipientPage.schema}
        uiSchema={careRecipientPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRecipient = $(
      'va-radio[label*="Who is the expense for?"]',
      formDOM,
    );
    expect(vaRecipient.getAttribute('required')).to.equal('true');
    const vaRecipientOtherSelector =
      'va-text-input[label*="Full name of the person who received care"]';
    const vaRecipientOptions = $$('va-radio-option', formDOM);
    expect(form.getByRole('heading')).to.have.text(
      'Care recipient and provider name',
    );
    expect(vaRecipientOptions.length).to.equal(2);
    Object.keys(careRecipientLabels).forEach((key, index) => {
      expect(vaRecipientOptions[index].getAttribute('label')).to.equal(
        careRecipientLabels[key],
      );
    });

    vaRecipient.__events.vaValueChange({
      detail: { value: 'OTHER' },
    });
    expect($(vaRecipientOtherSelector, formDOM)).to.exist;
    vaRecipient.__events.vaValueChange({
      detail: { value: 'SURVIVING_SPOUSE' },
    });
    expect($(vaRecipientOtherSelector, formDOM)).to.not.exist;
  });
  it('should render only frequency and payment amount if not in home care attendant', () => {
    const { careCostPage } = careExpensesPages;
    const formData = {
      careType: 'NURSING_HOME',
    };
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careCostPage.schema}
        uiSchema={careCostPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaFrequencyRadio = $(
      'va-radio[label*="How often are the payments?"]',
      formDOM,
    );
    expect(vaFrequencyRadio.getAttribute('required')).to.equal('true');
    const vaFrequencyOptions = $$('va-radio-option', formDOM);
    expect(vaFrequencyOptions.length).to.equal(2);
    Object.keys(careFrequencyLabels).forEach((key, index) => {
      expect(vaFrequencyOptions[index].getAttribute('label')).to.equal(
        careFrequencyLabels[key],
      );
    });

    const vaPaymentAmount = $(
      'va-text-input[label*="How much is each payment?"]',
      formDOM,
    );
    expect(vaPaymentAmount.getAttribute('required')).to.equal('true');

    const vaHourlyRate = $(
      'va-text-input[label*="What is the provider’s rate per hour?"]',
      formDOM,
    );
    expect(vaHourlyRate).to.not.exist;
    const vaWeeklyHours = $(
      'va-text-input[label*="How many hours per week does the care provider work?"]',
      formDOM,
    );
    expect(vaWeeklyHours).to.not.exist;
  });
  it('should render all fields if in home care attendant', () => {
    const { careCostPage } = careExpensesPages;
    const formData = {
      careType: 'IN_HOME_CARE_ATTENDANT',
    };
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careCostPage.schema}
        uiSchema={careCostPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaFrequencyRadio = $(
      'va-radio[label*="How often are the payments?"]',
      formDOM,
    );
    expect(vaFrequencyRadio.getAttribute('required')).to.equal('true');
    const vaFrequencyOptions = $$('va-radio-option', formDOM);
    expect(vaFrequencyOptions.length).to.equal(2);
    Object.keys(careFrequencyLabels).forEach((key, index) => {
      expect(vaFrequencyOptions[index].getAttribute('label')).to.equal(
        careFrequencyLabels[key],
      );
    });

    const vaPaymentAmount = $(
      'va-text-input[label*="How much is each payment?"]',
      formDOM,
    );
    expect(vaPaymentAmount.getAttribute('required')).to.equal('true');

    const vaHourlyRate = $(
      'va-text-input[label*="What is the provider’s rate per hour?"]',
      formDOM,
    );
    expect(vaHourlyRate.getAttribute('required')).to.equal('true');
    const vaWeeklyHours = $(
      'va-text-input[label*="How many hours per week does the care provider work?"]',
      formDOM,
    );
    expect(vaWeeklyHours.getAttribute('required')).to.equal('true');
  });

  it('should check if isItemIncomplete', () => {
    const { isItemIncomplete } = options;
    const completeItem = {
      careDateRange: { from: '2020-01-01', to: '2020-01-31' },
      provider: 'John Doe',
      careType: 'NURSING_HOME',
      paymentAmount: 100,
      recipient: 'SURVIVING_SPOUSE',
    };
    const incompleteItem = {
      careDateRange: { to: '2020-01-01' },
    };

    expect(isItemIncomplete(completeItem)).to.be.false;
    expect(isItemIncomplete(incompleteItem)).to.be.true;
  });
  it('should show the correct getItemName output', () => {
    const { text } = options;
    const itemWithName = {
      provider: 'John Doe',
    };
    const itemWithoutName = {};

    expect(text.getItemName(itemWithName)).to.equal('John Doe');
    expect(text.getItemName(itemWithoutName)).to.equal('Care provider');
  });
  it('should show the correct cardDescription output', () => {
    const { text } = options;
    const completeItem = {
      careDateRange: { from: '2020-01-01', to: '2020-01-31' },
    };
    const partialItem = {
      careDateRange: { from: '2020-01-01' },
    };
    const incompleteItem = {};

    expect(text.cardDescription(completeItem)).to.equal(
      `01/01/2020 - 01/31/2020`,
    );
    expect(text.cardDescription(partialItem)).to.equal('01/01/2020');
    expect(text.cardDescription(incompleteItem)).to.equal(
      'Care dates not provided',
    );
  });
});
