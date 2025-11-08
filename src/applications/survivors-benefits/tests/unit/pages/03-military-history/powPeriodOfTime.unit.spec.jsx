import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import powPeriodOfTime from '../../../../config/chapters/03-military-history/powPeriodOfTime';

describe('POW period of time page', () => {
  const { schema, uiSchema } = powPeriodOfTime;
  it('renders the POW period of time page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      'Period of time held as a POW',
    );

    const vaMemorableDates = $$('va-memorable-date', formDOM);
    expect(vaMemorableDates.length).to.equal(2);
    const vaStartDate = $('va-memorable-date[label="Start date"]', formDOM);
    expect(vaStartDate.getAttribute('required')).to.equal('true');
    const vaEndDate = $('va-memorable-date[label="End date"]', formDOM);
    expect(vaEndDate.getAttribute('required')).to.equal('true');
  });
});
