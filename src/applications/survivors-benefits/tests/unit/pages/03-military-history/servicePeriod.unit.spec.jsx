import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import servicePeriod from '../../../../config/chapters/03-military-history/servicePeriod';

describe('Service period page', () => {
  const { schema, uiSchema } = servicePeriod;
  it('renders the service period page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text('Service period');

    const vaSelect = $$('va-select', formDOM);
    expect(vaSelect.length).to.equal(1);
    const vaMemorableDates = $$('va-memorable-date', formDOM);
    expect(vaMemorableDates.length).to.equal(2);
    const textInputs = $$('va-text-input[type="text"]', formDOM);
    expect(textInputs.length).to.equal(1);

    const vaBranchOfService = $(
      'va-select[label="Branch of service"]',
      formDOM,
    );
    expect(vaBranchOfService.getAttribute('required')).to.equal('true');
    const vaInitialEntryDate = $(
      'va-memorable-date[label="Date initially entered active duty"]',
      formDOM,
    );
    expect(vaInitialEntryDate.getAttribute('required')).to.equal('true');
    const vaFinalReleaseDate = $(
      'va-memorable-date[label="Final release date from active duty"]',
      formDOM,
    );
    expect(vaFinalReleaseDate.getAttribute('required')).to.equal('true');
    const vaLastSeparationPlace = $(
      'va-text-input[label="Place of Veteran’s last separation"]',
      formDOM,
    );
    expect(vaLastSeparationPlace.getAttribute('required')).to.equal('true');
    expect(vaLastSeparationPlace.getAttribute('hint')).to.equal(
      'City, state, or foreign country',
    );
  });
});
