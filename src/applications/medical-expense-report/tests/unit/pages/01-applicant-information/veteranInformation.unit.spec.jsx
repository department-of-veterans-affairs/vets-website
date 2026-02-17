import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../../config/form';

describe('Veteran Information Page', () => {
  const { title, schema, uiSchema } =
    formConfig.chapters.applicantInformation.pages.veteranInformation;
  it('renders the veteran information fields as veteran', async () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          claimantNotVeteran: false,
        }}
      />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      title({ claimantNotVeteran: false }),
    );

    const vaTextInputs = $$('va-text-input', formDOM);
    const vaMemorableDates = $$('va-memorable-date', formDOM);
    const ssnInput = $(
      'va-text-input[label="Social Security number"]',
      formDOM,
    );
    const vaFileNumberInput = $(
      'va-text-input[label="VA file number"]',
      formDOM,
    );
    const vaMemorableDate = $(
      'va-memorable-date[label="Date of birth"]',
      formDOM,
    );

    expect(vaTextInputs.length).to.equal(2);
    expect(vaMemorableDates.length).to.equal(1);

    expect(ssnInput.getAttribute('required')).to.equal('true');
    expect(vaFileNumberInput.getAttribute('required')).to.equal('false');
    expect(vaMemorableDate.getAttribute('required')).to.equal('true');
  });

  it('renders the veteran information fields as not a veteran', async () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          claimantNotVeteran: true,
        }}
      />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      title({ claimantNotVeteran: true }),
    );

    const vaTextInputs = $$('va-text-input', formDOM);
    const vaMemorableDates = $$('va-memorable-date', formDOM);
    const vaSelects = $$('va-select', formDOM);

    const firstNameInput = $(
      'va-text-input[label="First or given name"]',
      formDOM,
    );
    const lastNameInput = $(
      'va-text-input[label="Last or family name"]',
      formDOM,
    );
    const middleNameInput = $('va-text-input[label="Middle name"]', formDOM);
    const suffixInput = $('va-select[label="Suffix"]', formDOM);

    const ssnInput = $(
      'va-text-input[label="Social Security number"]',
      formDOM,
    );
    const vaFileNumberInput = $(
      'va-text-input[label="VA file number"]',
      formDOM,
    );
    const vaMemorableDate = $(
      'va-memorable-date[label="Date of birth"]',
      formDOM,
    );

    expect(vaTextInputs.length).to.equal(5);
    expect(vaMemorableDates.length).to.equal(1);
    expect(vaSelects.length).to.equal(1);

    expect(firstNameInput.getAttribute('required')).to.equal('true');
    expect(lastNameInput.getAttribute('required')).to.equal('true');
    expect(middleNameInput.getAttribute('required')).to.equal('false');
    expect(suffixInput.getAttribute('required')).to.equal('false');
    expect(ssnInput.getAttribute('required')).to.equal('true');
    expect(vaFileNumberInput.getAttribute('required')).to.equal('false');
    expect(vaMemorableDate.getAttribute('required')).to.equal('true');
  });
});
