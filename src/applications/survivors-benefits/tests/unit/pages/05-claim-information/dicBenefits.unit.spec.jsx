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
  });
});
