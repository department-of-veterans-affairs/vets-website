import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  // getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
// import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  careExpensesPages,
  options,
} from '../../../../config/chapters/06-financial-information/careFacilityExpenses/careExpensesPages';
// import { medicalExpenseRecipientLabels } from '../../../../utils/labels';

// const arrayPath = 'careExpenses';

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
  //   it('renders the medical expenses page summary', async () => {
  //     const { medicalExpensesSummary } = medicalExpensesPages;
  //     const form = render(
  //       <DefinitionTester
  //         schema={medicalExpensesSummary.schema}
  //         uiSchema={medicalExpensesSummary.uiSchema}
  //         data={{}}
  //       />,
  //     );
  //     const formDOM = getFormDOM(form);
  //     const vaRadio = $('va-radio', formDOM);
  //     const vaRadioOptions = $$('va-radio-option', formDOM);

  //     expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
  //     expect(vaRadio.getAttribute('label')).to.equal(
  //       'Do you have a medical or other expense to add?',
  //     );
  //     expect(vaRadioOptions.length).to.equal(2);
  //     expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
  //     expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
  //   });
  //   it('renders the medical expenses recipient page', async () => {
  //     const { medicalRecipientPage } = medicalExpensesPages;
  //     const formData = {};
  //     const form = render(
  //       <DefinitionTester
  //         arrayPath={arrayPath}
  //         schema={medicalRecipientPage.schema}
  //         uiSchema={medicalRecipientPage.uiSchema}
  //         pagePerItemIndex={0}
  //         data={{ [arrayPath]: [formData] }}
  //       />,
  //     );
  //     const formDOM = getFormDOM(form);
  //     const vaRecipient = $(
  //       'va-radio[label*="Who is the expense for?"]',
  //       formDOM,
  //     );
  //     expect(vaRecipient.getAttribute('required')).to.equal('true');
  //     const vaRecipientOtherSelector =
  //       'va-text-input[label*="Full name of the person who the expense is for"]';
  //     const vaRecipientOptions = $$('va-radio-option', formDOM);
  //     expect(form.getByRole('heading')).to.have.text(
  //       'Medical recipient and provider name',
  //     );
  //     expect(vaRecipientOptions.length).to.equal(3);
  //     Object.keys(medicalExpenseRecipientLabels).forEach((key, index) => {
  //       expect(vaRecipientOptions[index].getAttribute('label')).to.equal(
  //         medicalExpenseRecipientLabels[key],
  //       );
  //     });

  //     vaRecipient.__events.vaValueChange({
  //       detail: { value: 'VETERANS_CHILD' },
  //     });
  //     expect($(vaRecipientOtherSelector, formDOM)).to.exist;
  //     vaRecipient.__events.vaValueChange({
  //       detail: { value: 'SURVIVING_SPOUSE' },
  //     });
  //     expect($(vaRecipientOtherSelector, formDOM)).to.not.exist;
  //   });
  //   it('should check isItemIncomplete', () => {
  //     const { isItemIncomplete } = options;
  //     const completeItem = {
  //       recipient: 'VETERANS_CHILD',
  //       recipientName: 'John Doe',
  //       purpose: 'Dr. Smith',
  //       paymentDate: '2020-01-01',
  //       amount: 100,
  //       frequency: 'monthly',
  //     };
  //     const incompleteItem = {
  //       recipient: 'VETERANS_CHILD',
  //       // missing recipientName
  //       purpose: 'Dr. Smith',
  //       paymentDate: '2020-01-01',
  //       amount: 100,
  //       frequency: 'monthly',
  //     };

  //     expect(isItemIncomplete(completeItem)).to.be.false;
  //     expect(isItemIncomplete(incompleteItem)).to.be.true;
  //   });
  it('should check if isItemIncomplete', () => {
    const { isItemIncomplete } = options;
    const completeItem = {
      careDate: { from: '2020-01-01', to: '2020-01-31' },
      provider: 'John Doe',
      typeOfCare: 'NURSING_HOME',
      paymentAmount: 100,
      recipient: 'SURVIVING_SPOUSE',
    };
    const incompleteItem = {
      careDate: { to: '2020-01-01' },
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
      careDate: { from: '2020-01-01', to: '2020-01-31' },
    };
    const partialItem = {
      careDate: { from: '2020-01-01' },
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
