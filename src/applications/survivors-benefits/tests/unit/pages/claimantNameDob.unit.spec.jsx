import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import claimantNameDob from '../../../pages/claimantNameDob';

describe('Claimant name and date of birth page', () => {
  const { schema, uiSchema } = claimantNameDob;
  it('renders the correct fields', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

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
  it('should show the correct title for surviving spouse', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'SURVIVING_SPOUSE' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your name and date of birth',
    );
  });
  it('should show the correct title for custodian', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'CUSTODIAN_FILING_FOR_CHILD_UNDER_18' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Child’s name and date of birth',
    );
  });
  it('should show the correct title for adult child', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'CHILD_18-23_IN_SCHOOL' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your name and date of birth',
    );
  });
  it('should show the correct title for helpless adult child', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'HELPLESS_ADULT_CHILD' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your name and date of birth',
    );
  });
});
