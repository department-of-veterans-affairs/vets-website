import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

describe('First time reporting page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
    title,
  } = formConfig.chapters.expenses.pages.reportingPeriod;
  it('renders the reporting period page', async () => {
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(title);
    const vaMemorableDates = $$('va-memorable-date', formDOM);
    expect(vaMemorableDates.length).to.equal(2);

    const vaStartDate = $('va-memorable-date[label="Start date"]', formDOM);
    expect(vaStartDate.getAttribute('required')).to.equal('true');

    const vaEndDate = $('va-memorable-date[label="End date"]', formDOM);
    expect(vaEndDate.getAttribute('required')).to.equal('true');
  });
});
