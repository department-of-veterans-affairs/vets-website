import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import dicBenefits from '../../../../config/chapters/05-claim-information/dicBenefits';
import { dicOptions } from '../../../../utils/labels';

describe('DIC Benefits Page', () => {
  const { schema, uiSchema } = dicBenefits;

  it('renders the DIC benefits options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const options = $$('va-radio-option', formDOM);
    const optionKeys = Object.keys(dicOptions);
    const vaAccordions = $$('va-accordion', formDOM);
    const vaAccordionItems = $$('va-accordion-item', formDOM);
    const vaLinks = $$('va-link', formDOM);

    expect(form.getByRole('heading')).to.have.text('DIC benefits');
    expect(vaRadio.getAttribute('label')).to.equal(
      'What DIC benefit are you claiming?',
    );
    expect(vaRadio.getAttribute('required')).to.equal('true');

    expect(options.length).to.equal(optionKeys.length);
    optionKeys.forEach((key, index) => {
      expect(options[index].getAttribute('label')).to.equal(dicOptions[key]);
    });

    expect(vaAccordions.length).to.equal(1);
    expect(vaAccordionItems.length).to.equal(3);
    expect(vaAccordionItems[0].getAttribute('header')).to.equal(
      'When to claim DIC',
    );
    expect(vaAccordionItems[1].getAttribute('header')).to.equal(
      'When to claim DIC under Title 38 U.S.C. 1151',
    );
    expect(vaAccordionItems[2].getAttribute('header')).to.equal(
      'When to claim DIC re-evaluation based on the PACT Act',
    );

    expect(vaLinks.length).to.equal(2);
    expect(vaLinks[0].getAttribute('href')).to.equal(
      'https://www.va.gov/disability/eligibility/special-claims/1151-claims-title-38/',
    );
    expect(vaLinks[0].getAttribute('text')).to.equal(
      'Learn more about Title 38 U.S.C. 1151 claims',
    );
    expect(vaLinks[1].getAttribute('href')).to.equal(
      'https://www.va.gov/resources/the-pact-act-and-your-va-benefits/',
    );
    expect(vaLinks[1].getAttribute('text')).to.equal(
      'Learn more about the PACT Act and your VA benefits',
    );
  });
});
