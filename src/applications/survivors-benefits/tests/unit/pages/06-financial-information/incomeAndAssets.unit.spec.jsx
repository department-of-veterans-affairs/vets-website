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
      'va-radio[label*="Do you and your dependents have over $75,000 in assets?"]',
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
});
