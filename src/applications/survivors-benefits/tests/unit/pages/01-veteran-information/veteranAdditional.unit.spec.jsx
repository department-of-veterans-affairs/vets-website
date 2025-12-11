import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import veteranAdditional from '../../../../config/chapters/01-veteran-information/veteranAdditional';

describe('Claimant Information Page', () => {
  const { schema, uiSchema } = veteranAdditional;
  it('renders the veteran identification page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'Additional Veteran information',
    );
    const vaRadios = $$('va-radio', formDOM);
    const vaMemorableDates = $$('va-memorable-date', formDOM);

    const vaEverClaim = $(
      'va-radio[label="Has the Veteran, surviving spouse, child, or parent ever filed a claim with the VA?"]',
      formDOM,
    );
    const vaActiveDuty = $(
      'va-radio[label="Did the Veteran die while on active duty?"]',
      formDOM,
    );
    const vaDateOfDeath = $(
      'va-memorable-date[label="Date of death"]',
      formDOM,
    );

    expect(vaRadios.length).to.equal(2);
    expect(vaMemorableDates.length).to.equal(1);

    expect(vaEverClaim.getAttribute('required')).to.equal('true');
    expect(vaActiveDuty.getAttribute('required')).to.equal('true');
    expect(vaDateOfDeath.getAttribute('required')).to.equal('true');
  });
});
