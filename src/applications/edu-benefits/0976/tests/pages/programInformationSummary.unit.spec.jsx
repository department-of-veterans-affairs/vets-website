import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/programInformationSummary';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

const baseData = {
  programs: [
    {
      programName: 'MBA',
      totalProgramLength: 'Semester',
      weeksPerTerm: '16',
      entryRequirements: 'Bachelors',
      creditHours: '20',
    },
  ],
};

describe('22-0976 program information summary page', () => {
  it('renders the input', () => {
    const { container } = renderPage(baseData);

    expect(
      container.querySelector(
        'va-radio[label="Do you have another program to add?"]',
      ),
    ).to.exist;
  });

  it('shows an error when no option is selected on submit', async () => {
    const { container, getByRole } = renderPage(baseData);
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('error')).to.equal(
      'Select ‘yes’ if you have another program to add',
    );
  });
});
