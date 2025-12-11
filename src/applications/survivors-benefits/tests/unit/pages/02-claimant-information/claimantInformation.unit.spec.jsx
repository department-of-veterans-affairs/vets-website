import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import claimantInformation from '../../../../config/chapters/02-claimant-information/claimantInformation';

describe('Claimant Information Page', () => {
  const { schema, uiSchema } = claimantInformation;
  it('renders the claimant information fields', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'Claimant’s name and date of birth',
    );
    const vaTextInput = $$('va-text-input', formDOM);
    const vaMemorableDates = $$('va-memorable-date', formDOM);

    const vaFirstNameInput = $(
      'va-text-input[label="First or given name"]',
      formDOM,
    );
    const vaMiddleNameInput = $('va-text-input[label="Middle name"]', formDOM);
    const vaLastNameInput = $(
      'va-text-input[label="Last or family name"]',
      formDOM,
    );
    const vaSuffixSelect = $('va-select[label="Suffix"]', formDOM);

    const vaDateOfBirthInput = $(
      'va-memorable-date[label="Date of birth"]',
      formDOM,
    );

    expect(vaTextInput.length).to.equal(3);
    expect(vaMemorableDates.length).to.equal(1);

    expect(vaFirstNameInput.getAttribute('required')).to.equal('true');
    expect(vaMiddleNameInput.getAttribute('required')).to.equal('false');
    expect(vaLastNameInput.getAttribute('required')).to.equal('true');
    expect(vaSuffixSelect.getAttribute('required')).to.equal('false');
    expect(vaDateOfBirthInput.getAttribute('required')).to.equal('true');
  });
});
