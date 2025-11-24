import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import marriageToVeteran from '../../../../config/chapters/04-household-information/marriageToVeteran';

describe('Marriage to Veteran Page', () => {
  const { schema, uiSchema } = marriageToVeteran;
  it('renders the marriage to veteran page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text('Marriage to Veteran');
    const vaRadios = $$('va-radio', formDOM);

    const vaMarriedAtDeath = $(
      'va-radio[label="Were you married to the Veteran at the time of their death?"]',
      formDOM,
    );

    expect(vaRadios.length).to.equal(1);

    expect(vaMarriedAtDeath.getAttribute('required')).to.equal('true');
  });
});
