import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  medicalExpensesPages,
  options,
} from '../../../../config/chapters/02-expenses/medicalExpensesPage';
import {
  recipientTypeLabels,
  careFrequencyLabels,
} from '../../../../utils/labels';

const arrayPath = 'medicalExpenses';

describe('Medical Expenses Pages', () => {
  it('renders the medical expenses intro', async () => {
    const { medicalExpensesIntro } = medicalExpensesPages;

    const form = render(
      <DefinitionTester
        schema={medicalExpensesIntro.schema}
        uiSchema={medicalExpensesIntro.uiSchema}
        data={{}}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(medicalExpensesIntro.title);
  });

  it('renders the medical expenses summary', async () => {
    const { medicalExpensesSummary } = medicalExpensesPages;

    const form = render(
      <DefinitionTester
        schema={medicalExpensesSummary.schema}
        uiSchema={medicalExpensesSummary.uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);

    expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Do you have a medical expense to add?',
    );
    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
  });

  it('renders the medical expenses recipient page', async () => {
    const { medicalExpensesRecipientPage } = medicalExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={medicalExpensesRecipientPage.schema}
        uiSchema={medicalExpensesRecipientPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRecipient = $('va-radio[label*="Who’s the expense for?"]', formDOM);
    expect(vaRecipient.getAttribute('required')).to.equal('true');
    const vaRecipientOtherSelector =
      'va-text-input[label*="Full name of the person who received care"]';
    const vaRecipientOptions = $$('va-radio-option', formDOM);
    expect(vaRecipientOptions.length).to.equal(4);
    Object.keys(recipientTypeLabels).forEach((key, index) => {
      expect(vaRecipientOptions[index].getAttribute('label')).to.equal(
        recipientTypeLabels[key],
      );
    });

    vaRecipient.__events.vaValueChange({
      detail: { value: 'OTHER' },
    });
    expect($(vaRecipientOtherSelector, formDOM)).to.exist;
    vaRecipient.__events.vaValueChange({
      detail: { value: 'CHILD' },
    });
    expect($(vaRecipientOtherSelector, formDOM)).to.exist;
    vaRecipient.__events.vaValueChange({
      detail: { value: 'SPOUSE' },
    });
    expect($(vaRecipientOtherSelector, formDOM)).to.not.exist;
  });

  it('renders the medical expenses recipient and purpose page', async () => {
    const { medicalExpensesPurposePage } = medicalExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={medicalExpensesPurposePage.schema}
        uiSchema={medicalExpensesPurposePage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaTextInputs = $$('va-text-input', formDOM);
    expect(vaTextInputs.length).to.equal(2);
    const vaRecipientInput = $(
      'va-text-input[label*="Who receives the payment?"]',
      formDOM,
    );
    const vaPurposeInput = $(
      'va-text-input[label*="What is the payment for?"]',
      formDOM,
    );
    expect(vaRecipientInput.getAttribute('required')).to.equal('true');
    expect(vaPurposeInput.getAttribute('required')).to.equal('true');
  });

  it('renders the medical expenses frequency and cost of care page', async () => {
    const { medicalExpensesFrequencyPage } = medicalExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={medicalExpensesFrequencyPage.schema}
        uiSchema={medicalExpensesFrequencyPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaMemorableDates = $$('va-memorable-date', formDOM);
    const vaRadios = $$('va-radio', formDOM);
    const vaTextInputs = $$('va-text-input', formDOM);
    expect(vaTextInputs.length).to.equal(1);
    expect(vaRadios.length).to.equal(1);
    expect(vaMemorableDates.length).to.equal(1);
    const vaStartDate = $(
      'va-memorable-date[label*="When did you start making this payment?"]',
      formDOM,
    );
    const vaCostInput = $(
      'va-text-input[label*="How much is each payment?"]',
      formDOM,
    );
    const vaFrequency = $(
      'va-radio[label*="How often do you make this payment?"]',
      formDOM,
    );
    expect(vaFrequency.getAttribute('required')).to.equal('true');
    expect(vaCostInput.getAttribute('required')).to.equal('true');
    expect(vaStartDate.getAttribute('required')).to.equal('true');

    const vaFrequencyOptions = $$('va-radio-option', formDOM);
    expect(vaFrequencyOptions.length).to.equal(3);
    Object.keys(careFrequencyLabels).forEach((key, index) => {
      expect(vaFrequencyOptions[index].getAttribute('label')).to.equal(
        careFrequencyLabels[key],
      );
    });
  });

  it('should return the correct card title with provider', () => {
    const item = {
      provider: 'Provider name is here',
    };
    const { getByText } = render(options.text.getItemName(item));
    expect(getByText('Provider name is here')).to.exist;
  });

  it('should return the default title when provider is not present', () => {
    const item = {
      provider: '',
    };
    const { getByText } = render(options.text.getItemName(item));
    expect(getByText('Provider')).to.exist;
  });

  it('should return the correct card description with paymentDate', () => {
    const item = {
      paymentDate: '2004-04-04',
      paymentFrequency: 'ONCE_MONTH',
    };
    const { getByText } = render(options.text.cardDescription(item));
    expect(getByText('04/04/2004')).to.exist;
    expect(getByText('Once a month')).to.exist;
  });
  it('should return the null description when no paymentDate or paymentFrequency is present', () => {
    const item = {
      paymentDate: '',
      paymentFrequency: '',
    };
    const { queryByText } = render(options.text.cardDescription(item));
    expect(queryByText('04/04/2004')).to.not.exist;
    expect(queryByText('Once a month')).to.not.exist;
  });
  it('should check if the item is incomplete', () => {
    const completeItem = {
      recipient: 'SPOUSE',
      paymentDate: '2004-04-04',
      purpose: 'Medical supplies',
      paymentFrequency: 'ONCE_MONTH',
      paymentAmount: 200,
    };
    const incompleteItem = {
      recipient: 'CHILD',
      paymentDate: '2004-04-04',
      purpose: 'Medical supplies',
      paymentFrequency: 'ONCE_MONTH',
      paymentAmount: 200,
    };
    expect(options.isItemIncomplete(completeItem)).to.be.false;
    expect(options.isItemIncomplete(incompleteItem)).to.be.true;
  });
});
