import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import claimantHistory from '../../../../config/chapters/02-claimant-information/claimantHistory';

describe('Claimant History Page', () => {
  const { schema, uiSchema } = claimantHistory;
  it('renders the claimant relationship options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'Claimant’s service history',
    );
    const vaRadios = $$('va-radio', formDOM);
    const vaIsVeteranOptions = $$(
      'va-radio-option[name="root_claimantIsVeteran"]',
      formDOM,
    );

    expect(vaIsVeteranOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaIsVeteranOptions[1].getAttribute('label')).to.equal('No');

    const vaIsVeteran = $(
      'va-radio[label="Is the claimant a Veteran?"]',
      formDOM,
    );
    expect(vaRadios.length).to.equal(1);
    expect(vaIsVeteranOptions.length).to.equal(2);
    expect(vaIsVeteran.getAttribute('required')).to.equal('true');
  });
});
