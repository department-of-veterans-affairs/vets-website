import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import claimantInformation from '../../../../config/chapters/02-claimant-information/claimantInformation';
import { claimantRelationshipOptions } from '../../../../utils/labels';

describe('Claimant Information Page', () => {
  const { schema, uiSchema } = claimantInformation;
  it('renders the claimant relationship options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'Claimant’s relationship to the Veteran',
    );
    const vaTextInput = $$('va-text-input', formDOM);
    const vaRadios = $$('va-radio', formDOM);
    const vaAdditionalInfos = $$('va-additional-info', formDOM);
    const vaMemorableDates = $$('va-memorable-date', formDOM);

    expect(vaAdditionalInfos[0].getAttribute('trigger')).to.equal(
      'What we consider a seriously disabled adult child',
    );
    const vaRelationshipRadio = $(
      'va-radio[label="What is the claimant’s relationship to the Veteran?"]',
      formDOM,
    );

    const vaRelationshipOptions = $$(
      'va-radio-option[name="root_claimantRelationship"]',
      formDOM,
    );
    const vaIsVeteranOptions = $$(
      'va-radio-option[name="root_claimantIsVeteran"]',
      formDOM,
    );
    vaRelationshipOptions.forEach(option => {
      const key = option.getAttribute('value');
      const label = option.getAttribute('label');
      expect(label).to.equal(claimantRelationshipOptions[key]);
    });

    expect(vaIsVeteranOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaIsVeteranOptions[1].getAttribute('label')).to.equal('No');

    const vaFirstNameInput = $('va-text-input[label="First name"]', formDOM);
    const vaMiddleNameInput = $('va-text-input[label="Middle name"]', formDOM);
    const vaLastNameInput = $('va-text-input[label="Last name"]', formDOM);
    const vaSuffixSelect = $('va-select[label="Suffix"]', formDOM);
    const vaIsVeteran = $(
      'va-radio[label="Is the claimant a Veteran?"]',
      formDOM,
    );

    const vaDateOfBirthInput = $(
      'va-memorable-date[label="Date of birth"]',
      formDOM,
    );

    expect(vaAdditionalInfos.length).to.equal(1);
    expect(vaTextInput.length).to.equal(4);
    expect(vaRadios.length).to.equal(2);
    expect(vaMemorableDates.length).to.equal(1);
    expect(vaRelationshipOptions.length).to.equal(4);
    expect(vaIsVeteranOptions.length).to.equal(2);

    expect(vaRelationshipRadio.getAttribute('required')).to.equal('true');
    expect(vaFirstNameInput.getAttribute('required')).to.equal('true');
    expect(vaMiddleNameInput.getAttribute('required')).to.equal('false');
    expect(vaLastNameInput.getAttribute('required')).to.equal('true');
    expect(vaSuffixSelect.getAttribute('required')).to.equal('false');
    expect(vaDateOfBirthInput.getAttribute('required')).to.equal('true');
    expect(vaIsVeteran.getAttribute('required')).to.equal('true');
  });
});
