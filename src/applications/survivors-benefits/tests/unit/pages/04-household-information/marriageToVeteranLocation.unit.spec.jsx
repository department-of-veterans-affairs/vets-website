import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import marriageToVeteranLocation from '../../../../config/chapters/04-household-information/marriageToVeteranLocation';

describe('Marriage to Veteran Location Page', () => {
  const { schema, uiSchema } = marriageToVeteranLocation;
  it('renders the marriage to veteran location page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'When and where did you get married?',
    );
    const vaDateField = $$('va-memorable-date', formDOM);

    const vaMarriedAtDeathEndInfo = $(
      'va-memorable-date[label="Date of marriage"]',
      formDOM,
    );

    const vaMarriedOutsideUSCheckbox = $(
      'va-checkbox[label="I got married outside the U.S."]',
      formDOM,
    );

    expect(vaDateField.length).to.equal(1);
    expect(vaMarriedOutsideUSCheckbox.getAttribute('required')).to.equal(
      'false',
    );
    expect(vaMarriedAtDeathEndInfo.getAttribute('required')).to.equal('true');
  });
});
