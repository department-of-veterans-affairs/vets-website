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
} from '../../../../config/chapters/02-expenses/careExpensesPages';
import { recipientTypeLabels } from '../../../../utils/labels';

const arrayPath = 'careExpenses';

describe('Care Expenses Pages', () => {
  it('renders the care expenses intro', async () => {
    const { careExpensesIntro } = careExpensesPages;

    const form = render(
      <DefinitionTester
        schema={careExpensesIntro.schema}
        uiSchema={careExpensesIntro.uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaLinks = $$('va-link', formDOM);
    expect(form.getByRole('heading')).to.have.text(careExpensesIntro.title);
    expect(vaLinks.length).to.equal(4);
  });
  it('renders the care expenses summary', async () => {
    const { careExpensesSummary } = careExpensesPages;

    const form = render(
      <DefinitionTester
        schema={careExpensesSummary.schema}
        uiSchema={careExpensesSummary.uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);

    expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Do you have a care expense to add?',
    );
    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
  });
  it('renders the care expenses type of care page', async () => {
    const { careExpensesTypePage } = careExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careExpensesTypePage.schema}
        uiSchema={careExpensesTypePage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);

    expect(form.getByRole('heading')).to.have.text('Type of care');

    expect(vaRadio.getAttribute('label')).to.equal('Select the type of care.');
    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal(
      'Residential care facility',
    );
    expect(vaRadioOptions[1].getAttribute('label')).to.equal(
      'In-home care attendant',
    );
  });
  it('renders the care expenses recipient page', async () => {
    const { careExpensesRecipientPage } = careExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careExpensesRecipientPage.schema}
        uiSchema={careExpensesRecipientPage.uiSchema}
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
    expect(form.getByRole('heading')).to.have.text('Care recipient');
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
  it('renders the care expenses provider and care dates', async () => {
    const { careExpensesDatesPage } = careExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careExpensesDatesPage.schema}
        uiSchema={careExpensesDatesPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      'Care provider’s name and dates of care',
    );
    const vaTextInputs = $$('va-text-input', formDOM);
    expect(vaTextInputs.length).to.equal(1);
    const vaProviderInput = $(
      'va-text-input[label*="What’s the name of the care provider?"]',
      formDOM,
    );
    expect(vaProviderInput.getAttribute('required')).to.equal('true');

    const vaMemorableDates = $$('va-memorable-date', formDOM);
    expect(vaMemorableDates.length).to.equal(2);
    const vaMemorableDateStart = $(
      'va-memorable-date[label*="Care start date"]',
      formDOM,
    );
    expect(vaMemorableDateStart.getAttribute('required')).to.equal('true');
    expect(vaMemorableDateStart.getAttribute('hint')).to.equal(
      'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
    );
    const vaMemorableDateEnd = $(
      'va-memorable-date[label*="Care end date"]',
      formDOM,
    );
    expect(vaMemorableDateEnd.getAttribute('required')).to.equal('false');
    expect(vaMemorableDateEnd.getAttribute('hint')).to.equal(
      'Leave blank if care is ongoing.',
    );
  });
  it('renders the cost of care page with no provider', async () => {
    const { careExpensesCostPage } = careExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careExpensesCostPage.schema}
        uiSchema={careExpensesCostPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text('Cost of care');
  });
  it('renders the cost of care page for in-home care', async () => {
    const { careExpensesCostPage } = careExpensesPages;
    const formData = {
      provider: 'Test Provider',
      typeOfCare: 'IN_HOME_CARE_ATTENDANT',
    };
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careExpensesCostPage.schema}
        uiSchema={careExpensesCostPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      'Cost of care for Test Provider',
    );
    const vaTextInputs = $$('va-text-input', formDOM);
    expect(vaTextInputs.length).to.equal(3);
    const vaMonthlyInput = $(
      'va-text-input[label*="What’s the monthly cost of this care?"]',
      formDOM,
    );
    expect(vaMonthlyInput.getAttribute('required')).to.equal('true');
    const vaHourlyInput = $(
      'va-text-input[label*="What is the care provider’s hourly rate?"]',
      formDOM,
    );
    expect(vaHourlyInput.getAttribute('required')).to.equal('true');
    const vaHoursPerWeekInput = $(
      'va-text-input[label*="How many hours per week does the care provider work?"]',
      formDOM,
    );
    expect(vaHoursPerWeekInput.getAttribute('required')).to.equal('true');
  });
  it('renders the cost of care page for residential care', async () => {
    const { careExpensesCostPage } = careExpensesPages;
    const formData = {
      provider: 'New Provider',
      typeOfCare: 'RESIDENTIAL',
    };
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={careExpensesCostPage.schema}
        uiSchema={careExpensesCostPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      'Cost of care for New Provider',
    );
    const vaTextInputs = $$('va-text-input', formDOM);
    expect(vaTextInputs.length).to.equal(1);
    const vaMonthlyInput = $(
      'va-text-input[label*="What’s the monthly cost of this care?"]',
      formDOM,
    );
    expect(vaMonthlyInput.getAttribute('required')).to.equal('true');
    const vaHourlyInput = $(
      'va-text-input[label*="What is the care provider’s hourly rate?"]',
      formDOM,
    );
    expect(vaHourlyInput).to.not.exist;
    const vaHoursPerWeekInput = $(
      'va-text-input[label*="How many hours per week does the care provider work?"]',
      formDOM,
    );
    expect(vaHoursPerWeekInput).to.not.exist;
  });
  it('should return the correct card description when only from date is provided', () => {
    const item = {
      provider: 'John Doe Provider',
      careDate: {
        from: '2004-04-04',
      },
      typeOfCare: 'RESIDENTIAL',
    };
    const { getByText: nameText } = render(options.text.getItemName(item));
    const { getByText: descriptionText } = render(
      options.text.cardDescription(item),
    );
    expect(nameText('John Doe Provider')).to.exist;
    expect(descriptionText('04/04/2004')).to.exist;
  });
  it('should return the correct card description when from and to date is provided', () => {
    const item = {
      provider: 'John Doe Provider',
      careDate: {
        from: '2004-04-04',
        to: '2005-05-05',
      },
      typeOfCare: 'RESIDENTIAL',
    };
    const { getByText: nameText } = render(options.text.getItemName(item));
    const { getByText: descriptionText } = render(
      options.text.cardDescription(item),
    );
    expect(nameText('John Doe Provider')).to.exist;
    expect(descriptionText('04/04/2004 - 05/05/2005')).to.exist;
  });
  it('should return default card description', () => {
    const item = {
      typeOfCare: 'BLAH',
    };
    const { getByText: nameText } = render(options.text.getItemName(item));
    expect(nameText('Provider')).to.exist;
  });
  it('should check if the item is incomplete', () => {
    const completeItem = {
      typeOfCare: 'RESIDENTIAL',
      recipient: 'SPOUSE',
      provider: 'Provider Name',
      careDate: { from: '2004-04-04' },
      monthlyAmount: 1200,
    };
    const incompleteNoHourlyItem = {
      typeOfCare: 'IN_HOME_CARE_ATTENDANT',
      recipient: 'CHILD',
      fullNameRecipient: 'John Doe',
      provider: 'Provider Name',
      careDate: { from: '2004-04-04' },
      monthlyAmount: 800,
      weeklyHours: 20,
    };
    const incompleteNoWeeklyItem = {
      typeOfCare: 'IN_HOME_CARE_ATTENDANT',
      recipient: 'CHILD',
      fullNameRecipient: 'John Doe',
      provider: 'Provider Name',
      careDate: { from: '2004-04-04' },
      monthlyAmount: 800,
      hourlyRate: 20,
    };
    expect(options.isItemIncomplete(completeItem)).to.be.false;
    expect(options.isItemIncomplete(incompleteNoHourlyItem)).to.be.true;
    expect(options.isItemIncomplete(incompleteNoWeeklyItem)).to.be.true;
  });
});
