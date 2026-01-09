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
} from '../../../../config/chapters/06-financial-information/medicalExpenses/medicalExpensesPages';
import { medicalExpenseRecipientLabels } from '../../../../utils/labels';

const arrayPath = 'medicalExpenses';

describe('Medical Expenses Pages', () => {
  it('renders the medical expenses page intro', async () => {
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
  it('renders the medical expenses page summary', async () => {
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
      'Do you have a medical, last, burial, or other expense to add?',
    );
    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
  });
  it('renders the medical expenses recipient page', async () => {
    const { medicalRecipientPage } = medicalExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={medicalRecipientPage.schema}
        uiSchema={medicalRecipientPage.uiSchema}
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
      'va-text-input[label*="Full name of the person who the expense is for"]';
    const vaRecipientOptions = $$('va-radio-option', formDOM);
    expect(form.getByRole('heading')).to.have.text(
      'Expense recipient and provider name',
    );
    expect(vaRecipientOptions.length).to.equal(3);
    Object.keys(medicalExpenseRecipientLabels).forEach((key, index) => {
      expect(vaRecipientOptions[index].getAttribute('label')).to.equal(
        medicalExpenseRecipientLabels[key],
      );
    });

    vaRecipient.__events.vaValueChange({
      detail: { value: 'VETERANS_CHILD' },
    });
    expect($(vaRecipientOtherSelector, formDOM)).to.exist;
    vaRecipient.__events.vaValueChange({
      detail: { value: 'SURVIVING_SPOUSE' },
    });
    expect($(vaRecipientOtherSelector, formDOM)).to.not.exist;
  });
  it('should check isItemIncomplete', () => {
    const { isItemIncomplete } = options;
    const completeItem = {
      recipient: 'VETERANS_CHILD',
      recipientOther: 'John Doe',
      purpose: 'Dr. Smith',
      paymentDate: '2020-01-01',
      paymentAmount: 100,
      paymentFrequency: 'monthly',
    };
    const incompleteItem = {
      recipient: 'VETERANS_CHILD',
      // missing recipientName
      purpose: 'Dr. Smith',
      paymentDate: '2020-01-01',
      paymentAmount: 100,
      paymentFrequency: 'monthly',
    };

    expect(isItemIncomplete(completeItem)).to.be.false;
    expect(isItemIncomplete(incompleteItem)).to.be.true;
  });

  it('should show the correct getItemName output', () => {
    const { text } = options;
    const itemWithName = { paymentRecipient: 'Dr. Smith' };
    const itemWithoutName = {};

    expect(text.getItemName(itemWithName)).to.equal('Dr. Smith');
    expect(text.getItemName(itemWithoutName)).to.equal('Medical expense');
  });
  it('should show the correct cardDescription output', () => {
    const { text } = options;
    const itemWithData = {
      paymentDate: '2020-01-15',
      paymentFrequency: 'MONTHLY',
    };
    const itemWithoutData = {};

    const descriptionWithData = text.cardDescription(itemWithData);
    const descriptionWithoutData = text.cardDescription(itemWithoutData);

    // Check that the description with data contains the correct date and frequency
    expect(descriptionWithData.props.children[0].props.children).to.equal(
      '01/15/2020',
    );
    expect(descriptionWithData.props.children[1].props.children).to.equal(
      'Once a month',
    );

    // Check that the description without data shows the fallback text
    expect(descriptionWithoutData.props.children[0].props.children).to.equal(
      'Date not provided',
    );
    expect(descriptionWithoutData.props.children[1].props.children).to.equal(
      'Frequency not provided',
    );
  });
});
