import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  grossMonthlyIncomePages,
  options,
} from '../../../../config/chapters/06-financial-information/incomeAndAssets/grossMonthlyIncomePages';
import {
  incomeRecipientTypeLabels,
  typeOfIncomeLabels,
} from '../../../../utils/labels';

const arrayPath = 'incomeEntries';

describe('Gross Monthly Income Pages', () => {
  it('renders the gross monthly income page intro', async () => {
    const { grossMonthlyIncome } = grossMonthlyIncomePages;

    const form = render(
      <DefinitionTester
        schema={grossMonthlyIncome.schema}
        uiSchema={grossMonthlyIncome.uiSchema}
        data={{}}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(grossMonthlyIncome.title);
  });
  it('should only show otherTypeExplanation if Other is selected', () => {
    const { monthlyIncomeDetails } = grossMonthlyIncomePages;

    const form = render(
      <DefinitionTester
        schema={monthlyIncomeDetails.schema}
        uiSchema={monthlyIncomeDetails.uiSchema}
        data={{ [arrayPath]: [{}] }}
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    const formDOM = getFormDOM(form.container);
    expect(form.getByRole('heading')).to.have.text(
      'Gross monthly income details',
    );
    const vaRecipient = $('va-radio[label*="What type of income?"]', formDOM);
    expect(vaRecipient.getAttribute('required')).to.equal('true');
    const vaOptions = $$('va-radio-option', formDOM);
    const vaOtherTypeExplanationText =
      'va-text-input[label*="Tell us the type of income"]';
    expect($(vaOtherTypeExplanationText, formDOM)).to.not.exist;
    expect(vaOptions.length).to.equal(7);
    Object.keys({
      ...incomeRecipientTypeLabels,
      ...typeOfIncomeLabels,
    }).forEach((key, index) => {
      if (index < Object.keys(incomeRecipientTypeLabels).length) {
        expect(vaOptions[index].getAttribute('label')).to.equal(
          incomeRecipientTypeLabels[key],
        );
      } else {
        expect(vaOptions[index].getAttribute('label')).to.equal(
          typeOfIncomeLabels[key],
        );
      }
    });
    vaRecipient.__events.vaValueChange({
      detail: { value: 'OTHER' },
    });
    expect($(vaOtherTypeExplanationText, formDOM)).to.exist;
    expect(
      $(vaOtherTypeExplanationText, formDOM).getAttribute('required'),
    ).to.equal('true');
  });
  it('should show pages if claimed survivor pension', () => {
    const {
      monthlyIncomeDetails,
      addIncomeSource,
      grossMonthlyIncome,
    } = grossMonthlyIncomePages;
    const formDataWithPension = { claims: { survivorsPension: true } };
    const formDataWithoutPension = {
      claims: { survivorsPension: false },
    };

    expect(monthlyIncomeDetails.depends(formDataWithPension)).to.be.true;
    expect(monthlyIncomeDetails.depends(formDataWithoutPension)).to.be.false;
    expect(addIncomeSource.depends(formDataWithPension)).to.be.true;
    expect(addIncomeSource.depends(formDataWithoutPension)).to.be.false;
    expect(grossMonthlyIncome.depends(formDataWithPension)).to.be.true;
    expect(grossMonthlyIncome.depends(formDataWithoutPension)).to.be.false;
  });

  it('should show the correct getItemName output', () => {
    const { text } = options;
    const item = { incomeType: 'SOCIAL_SECURITY' };
    const itemWithIncorrectIncome = { incomeType: 'MAGIC' };
    const itemWithoutIncome = {};

    expect(text.getItemName(item)).to.equal('Social Security');
    expect(text.getItemName(itemWithIncorrectIncome)).to.equal('Income source');
    expect(text.getItemName(itemWithoutIncome)).to.equal('Income source');
  });

  it('should show the correct cardDescription output', () => {
    const { text } = options;
    const itemWithAmount = { monthlyIncome: 1500 };
    const itemWithoutAmount = {};

    expect(text.cardDescription(itemWithAmount)).to.equal('$1500');
    expect(text.cardDescription(itemWithoutAmount)).to.equal('Monthly amount');
  });

  it('should show alertMaxItems alert with correct content and link when maxItems is reached', () => {
    const { text, maxItems } = options;
    expect(maxItems).to.equal(4);

    const formDataWithMaxItems = {
      incomeSources: [
        { incomeType: 'SOCIAL_SECURITY', monthlyIncome: 1000 },
        { incomeType: 'PENSION', monthlyIncome: 500 },
        { incomeType: 'EMPLOYMENT', monthlyIncome: 2000 },
        { incomeType: 'INVESTMENTS', monthlyIncome: 300 },
      ],
    };
    expect(formDataWithMaxItems.incomeSources.length).to.equal(maxItems);

    // Render the max limit reached alert directly
    const maxLimitAlert = text.alertMaxItems;
    expect(maxLimitAlert, 'alertMaxItems alert').to.exist;
    const { container } = render(maxLimitAlert);
    const alertText = container.textContent;
    expect(alertText).to.include(
      'You have added the maximum number of allowed monthly income sources for this application. Additional income sources can be added using VA 21P-0969 and uploaded at the end of this application.',
    );
    expect(alertText).to.include(
      'Additional income sources can be added using VA 21P-0969',
    );
    const link = container.querySelector('va-link');
    expect(link, 'alert link').to.exist;
    expect(link.getAttribute('href')).to.equal(
      'https://www.va.gov/find-forms/about-form-21p-0969',
    );
    expect(link.getAttribute('text')).to.equal(
      'Get VA Form 21P-0969 to download',
    );
  });
});
