import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

describe('Claimant Information Page', () => {
  const {
    schema,
    uiSchema,
    title,
  } = formConfig.chapters.applicantInformation.pages.claimantInformation;
  it('renders the claimant relationship options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(title);
    const vaTextInput = $$('va-text-input', formDOM);
    const vaSelects = $$('va-select', formDOM);

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

    expect(vaTextInput.length).to.equal(3);
    expect(vaSelects.length).to.equal(1);

    expect(vaFirstNameInput.getAttribute('required')).to.equal('true');
    expect(vaMiddleNameInput.getAttribute('required')).to.equal('false');
    expect(vaLastNameInput.getAttribute('required')).to.equal('true');
    expect(vaSuffixSelect.getAttribute('required')).to.equal('false');
  });
});
