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

  it('should hide care end date when noCareEndDate is checked', () => {
    const { careDatesPage } = careExpensesPages;
    const formData = {
      careDateRange: { from: '2020-01-01', to: '2020-01-31' },
      noCareEndDate: false,
    };
    const testData = { [arrayPath]: [formData] };
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careDatesPage.schema}
        uiSchema={careDatesPage.uiSchema}
        pagePerItemIndex={0}
        data={testData}
      />,
    );
    const formDOM = getFormDOM(form);

    // Initially, both start and end date fields should be visible
    const startDate = $('va-memorable-date[label*="Care start date"]', formDOM);
    let endDate = $('va-memorable-date[label*="Care end date"]', formDOM);
    expect(startDate).to.exist;
    expect(endDate).to.exist;

    // Check the "No end date" checkbox
    const noEndDateCheckbox = $('va-checkbox[label*="No end date"]', formDOM);
    expect(noEndDateCheckbox).to.exist;

    noEndDateCheckbox.__events.vaChange({
      target: { checked: true },
      detail: { checked: true },
    });

    // After checking, end date should be hidden
    endDate = $$('va-memorable-date[label*="Care end date"]', formDOM);
    expect(endDate[0]).to.not.exist;
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

    expect(text.getItemName(itemWithName, 0)).to.equal('Expense 1: John Doe');
    expect(text.getItemName(itemWithoutName, 1)).to.equal(
      'Expense 2: Care provider',
    );
  });
  it('should show the correct cardDescription output', () => {
    const { text } = options;
    const completeItem = {
      careDateRange: { from: '2020-01-01', to: '2020-01-31' },
      paymentFrequency: 'MONTHLY',
      paymentAmount: 500,
    };
    const partialItem = {
      careDateRange: { from: '2020-01-01' },
      paymentFrequency: 'ANNUALLY',
      paymentAmount: 1200,
    };
    const noDateItem = {
      paymentFrequency: 'MONTHLY',
      paymentAmount: 250,
    };
    const incompleteItem = {};

    const { getByText, queryByText, rerender, container } = render(
      text.cardDescription(completeItem),
    );
    expect(getByText('01/01/2020 - 01/31/2020')).to.exist;
    expect(getByText('Once a month')).to.exist;
    expect(getByText('$500')).to.exist;

    rerender(text.cardDescription(partialItem));
    expect(getByText('01/01/2020')).to.exist;
    expect(queryByText('01/01/2020 - 01/31/2020')).to.not.exist;
    expect(getByText('Once a year')).to.exist;
    expect(getByText('$1,200')).to.exist;

    rerender(text.cardDescription(noDateItem));
    expect(queryByText('01/01/2020')).to.not.exist;
    expect(getByText('Once a month')).to.exist;
    expect(getByText('$250')).to.exist;

    rerender(text.cardDescription(incompleteItem));
    expect(container.textContent.trim()).to.equal('');
  });
});
