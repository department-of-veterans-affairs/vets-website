import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import incomeAndAssets from '../../../../config/chapters/06-financial-information/incomeAndAssets/incomeAndAssets';

describe('Income and assets page', () => {
  const { schema, uiSchema } = incomeAndAssets;
  it('renders the income and assets page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    const formDOM = getFormDOM(form);
    const vaRadios = $$('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);
    const vaAccordions = $$('va-accordion', formDOM);
    const vaAssetsThresholdRadio = $(
      'va-radio[label*="Do you and your dependents have over $25,000 in assets?"]',
      formDOM,
    );

    expect(form.getByRole('heading')).to.have.text('Income and assets');

    expect(vaRadios.length).to.equal(1);
    expect(vaAssetsThresholdRadio.getAttribute('required')).to.equal('true');

    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');

    expect(vaAccordions.length).to.equal(1);
  });

  it('displays income and assets vaAccordion items and content', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    const formDOM = getFormDOM(form);

    const contentAccordion = formDOM.innerHTML;
    const vaAccordionItems = $$('va-accordion-item', formDOM);

    expect(vaAccordionItems.length).to.equal(3);
    // First accordion item
    expect(vaAccordionItems[0].getAttribute('header')).to.equal(
      'What we consider an asset',
    );
    expect(contentAccordion).to.contain(
      `Assets include the fair market value of all the real and personal property that you own, minus the amount of any mortgages you have. “Real property” is the land and buildings you own. And “personal property” is items like these:`,
    );
    expect(contentAccordion).to.contain(
      `<li>Investments, like stocks and bonds</li>`,
    );
    expect(contentAccordion).to.contain(`<li>Antique furniture</li>`);
    expect(contentAccordion).to.contain(`<li>Boats</li>`);
    expect(contentAccordion).to.contain(
      `We don’t include items like these in your assets:`,
    );
    expect(contentAccordion).to.contain(
      `Your primary residence (the home where you live most or all of your time)`,
    );
    expect(contentAccordion).to.contain(`Your car`);
    expect(contentAccordion).to.contain(
      `Basic home items, like appliances that you wouldn’t take with you if you moved to a new house`,
    );
    // Second accordion item
    expect(vaAccordionItems[1].getAttribute('header')).to.equal(
      'Who we consider a dependent',
    );
    expect(contentAccordion).to.contain(`A dependent is:`);
    expect(contentAccordion).to.contain(
      `<li>A spouse (<strong>Note:</strong> We recognize same-sex and common law marriages)</li>`,
    );
    expect(contentAccordion).to.contain(
      `<li>An unmarried child (including an adopted child or stepchild) who meets 1 of the eligibility requirements listed here</li>`,
    );
    expect(contentAccordion).to.contain(
      `To be considered a dependent, one of these must be true of an unmarried child:`,
    );
    expect(contentAccordion).to.contain(
      `<li>They’re under 18 years old, <strong>or</strong></li>`,
    );
    expect(contentAccordion).to.contain(
      `<li>They’re between the ages of 18 and 23 years old and enrolled in school full time, <strong>or</strong></li>`,
    );
    expect(contentAccordion).to.contain(
      `<li>They became permanently disabled before they turned 18</li>`,
    );
    // Third accordion item
    expect(vaAccordionItems[2].getAttribute('header')).to.equal(
      'Whose assets you need to report',
    );
    expect(contentAccordion).to.contain(
      `If you’re a surviving spouse claimant:`,
    );
    expect(contentAccordion).to.contain(
      `You must report income and assets for yourself and for any child of the veteran who lives with you or for whom you are responsible, unless a court has decided you do not have custody of the child.`,
    );
    expect(contentAccordion).to.contain(
      `If you’re a surviving child claimant:`,
    );
    expect(contentAccordion).to.contain(
      `This means that the child isn’t in the custody of a surviving spouse. You must report income and assets for yourself, your custodian, and your custodian’s spouse. If your custodian is an agency or facility, you do not need to report their income.`,
    );
  });
});
