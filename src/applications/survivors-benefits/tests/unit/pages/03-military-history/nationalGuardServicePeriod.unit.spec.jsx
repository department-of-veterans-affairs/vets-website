import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import nationalGuardServicePeriod from '../../../../config/chapters/03-military-history/nationalGuardServicePeriod';

describe('National Guard Service Period Page', () => {
  const { schema, uiSchema } = nationalGuardServicePeriod;
  it('renders the national guard service period page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      'National Guard service period',
    );

    const vaMemorableDates = $$('va-memorable-date', formDOM);
    const vaTextInputs = $$('va-text-input', formDOM);

    expect(vaMemorableDates.length).to.equal(1);
    expect(vaTextInputs.length).to.equal(2);

    const vaTelephoneInput = $(
      'va-text-input[label="Reserve or National Guard Unit primary phone number"]',
      formDOM,
    );
    const vaDateOfActivation = $(
      'va-memorable-date[label="Date of activation"]',
      formDOM,
    );
    const vaUnitName = $(
      'va-text-input[label="Reserve or National Guard Unit name"]',
      formDOM,
    );

    expect(vaMemorableDates.length).to.equal(1);
    expect(vaDateOfActivation.getAttribute('required')).to.equal('true');
    expect(vaTelephoneInput.getAttribute('required')).to.equal('true');
    expect(vaUnitName.getAttribute('required')).to.equal('true');
  });
});
