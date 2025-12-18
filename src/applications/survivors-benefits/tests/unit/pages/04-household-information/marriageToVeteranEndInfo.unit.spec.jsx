import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import marriageToVeteranEndInfo from '../../../../config/chapters/04-household-information/marriageToVeteranEndInfo';

describe('Marriage to Veteran End Info Page', () => {
  const { schema, uiSchema } = marriageToVeteranEndInfo;
  it('renders the marriage to veteran end info page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'When and where did your marriage end?',
    );
    const vaDateField = $$('va-memorable-date', formDOM);

    const vaMarriedAtDeathEndInfo = $(
      'va-memorable-date[label="Date marriage ended"]',
      formDOM,
    );

    expect(vaDateField.length).to.equal(1);

    expect(vaMarriedAtDeathEndInfo.getAttribute('required')).to.equal('true');
  });
});
