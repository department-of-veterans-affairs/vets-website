import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  mileageExpensesPages,
  options,
} from '../../../../config/chapters/02-expenses/mileageExpensesPage';
import {
  recipientTypeLabels,
  travelLocationLabels,
} from '../../../../utils/labels';

const arrayPath = 'mileageExpenses';

describe('Mileage Expense Pages', () => {
  it('renders the mileage expenses intro', async () => {
    const { mileageExpensesIntro } = mileageExpensesPages;

    const form = render(
      <DefinitionTester
        schema={mileageExpensesIntro.schema}
        uiSchema={mileageExpensesIntro.uiSchema}
        data={{}}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(mileageExpensesIntro.title);
  });
  it('renders the mileage expenses summary', async () => {
    const { mileageExpensesSummary } = mileageExpensesPages;

    const form = render(
      <DefinitionTester
        schema={mileageExpensesSummary.schema}
        uiSchema={mileageExpensesSummary.uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);

    expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Do you have a mileage expense to add?',
    );
    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
  });
  it('renders the mileage page destination', async () => {
    const { mileageExpensesTravelerPage } = mileageExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={mileageExpensesTravelerPage.schema}
        uiSchema={mileageExpensesTravelerPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaTraveler = $('va-radio[label*="Who needed to travel?"]', formDOM);
    expect(vaTraveler.getAttribute('required')).to.equal('true');
    const vaTravelerOtherSelector =
      'va-text-input[label*="Full name of the person who traveled"]';
    const vaTravelerOptions = $$('va-radio-option', formDOM);
    expect(vaTravelerOptions.length).to.equal(4);
    Object.keys(recipientTypeLabels).forEach((key, index) => {
      expect(vaTravelerOptions[index].getAttribute('label')).to.equal(
        recipientTypeLabels[key],
      );
    });

    vaTraveler.__events.vaValueChange({
      detail: { value: 'OTHER' },
    });
    expect($(vaTravelerOtherSelector, formDOM)).to.exist;
    vaTraveler.__events.vaValueChange({
      detail: { value: 'CHILD' },
    });
    expect($(vaTravelerOtherSelector, formDOM)).to.exist;
    vaTraveler.__events.vaValueChange({
      detail: { value: 'SPOUSE' },
    });
    expect($(vaTravelerOtherSelector, formDOM)).to.not.exist;
  });
  it('renders the mileage page destination', async () => {
    const { mileageExpensesDestinationPage } = mileageExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={mileageExpensesDestinationPage.schema}
        uiSchema={mileageExpensesDestinationPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaDestination = $(
      'va-radio[label*="What was the destination?"]',
      formDOM,
    );
    expect(vaDestination.getAttribute('required')).to.equal('true');
    const vaDestinationOtherSelector =
      'va-text-input[label*="Describe the destination"]';
    const vaDestinationOptions = $$('va-radio-option', formDOM);
    expect(vaDestinationOptions.length).to.equal(4);
    Object.keys(travelLocationLabels).forEach((key, index) => {
      expect(vaDestinationOptions[index].getAttribute('label')).to.equal(
        travelLocationLabels[key],
      );
      if (key === 'CLINIC') {
        expect(
          vaDestinationOptions[index].getAttribute('description'),
        ).to.equal(
          'This would be a doctor’s office, dentist, or other outpatient medical provider.',
        );
      }
    });

    vaDestination.__events.vaValueChange({
      detail: { value: 'OTHER' },
    });
    expect($(vaDestinationOtherSelector, formDOM)).to.exist;
    expect(
      $(vaDestinationOtherSelector, formDOM).getAttribute('required'),
    ).to.equal('true');
    vaDestination.__events.vaValueChange({
      detail: { value: 'HOSPITAL' },
    });
    expect($(vaDestinationOtherSelector, formDOM)).to.not.exist;
    const vaMilesTravelled = $(
      'va-text-input[label*="How many miles were traveled?"]',
      formDOM,
    );
    expect(vaMilesTravelled.getAttribute('required')).to.equal('true');
    const vaTravelDate = $(
      'va-memorable-date[label*="What was the date of travel?"]',
      formDOM,
    );
    expect(vaTravelDate.getAttribute('required')).to.equal('true');
  });
  it('renders the mileage page reimbursement', async () => {
    const { mileageExpensesReimbursementPage } = mileageExpensesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={mileageExpensesReimbursementPage.schema}
        uiSchema={mileageExpensesReimbursementPage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaMileageReimbursedRadio = $(
      'va-radio[label*="Has this mileage been reimbursed by any other source?"]',
      formDOM,
    );
    expect(vaMileageReimbursedRadio.getAttribute('required')).to.equal('true');
    vaMileageReimbursedRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    const vaMileageReimbursedInput = $(
      'va-text-input[label*="How much money was reimbursed?"]',
      formDOM,
    );
    expect(vaMileageReimbursedInput.getAttribute('required')).to.equal('true');
  });
  it('should return the correct card title with travelLocation', () => {
    const item = {
      travelLocation: 'PHARMACY',
    };
    const { getByText } = render(options.text.getItemName(item));
    expect(getByText('Pharmacy')).to.exist;
  });
  it('should return the correct card description with travelDate', () => {
    const item = {
      travelDate: '2004-04-04',
    };
    const { getByText } = render(options.text.cardDescription(item));
    expect(getByText('04/04/2004')).to.exist;
  });
  it('should check if the item is incomplete', () => {
    const completeItem = {
      traveler: 'CHILD',
      fullNameTraveler: 'John Doe',
      travelLocation: 'OTHER',
      otherTravelLocation: 'Some other place',
      travelDate: '2004-04-04',
      travelMilesTraveled: 100,
      travelReimbursed: true,
      travelReimbursementAmount: 50,
    };
    const completeItem2 = {
      traveler: 'OTHER',
      fullNameTraveler: 'John Doe',
      travelLocation: 'OTHER',
      otherTravelLocation: 'Some other place',
      travelDate: '2004-04-04',
      travelMilesTraveled: 100,
      travelReimbursed: false,
    };
    const incompleteNoTravelLocation = {
      traveler: 'CHILD',
      fullNameTraveler: 'John Doe',
      travelLocation: 'OTHER',
      travelDate: '2004-04-04',
      travelMilesTraveled: 100,
      travelReimbursed: true,
    };
    const incompleteNofullNameTraveler = {
      traveler: 'CHILD',
      travelLocation: 'PHARMACY',
      travelDate: '2004-04-04',
      travelMilesTraveled: 100,
      travelReimbursed: false,
    };
    expect(options.isItemIncomplete(completeItem)).to.be.false;
    expect(options.isItemIncomplete(completeItem2)).to.be.false;
    expect(options.isItemIncomplete(incompleteNoTravelLocation)).to.be.true;
    expect(options.isItemIncomplete(incompleteNofullNameTraveler)).to.be.true;
  });
});
