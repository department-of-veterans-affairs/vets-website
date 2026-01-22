import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/medical32MonthProgram';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 medical 32 month program page', () => {
  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain('Medical School Information');
  });

  it('renders the radio group with the correct label', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Your institution provides, and requires students to complete, a program of clinical and classroom instruction that is at least 32 months in length.',
    );
  });

  it('accepts any valid option without error', () => {
    const { container, unmount } = renderPage({
      programAtLeast32Months: true,
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();
    const utils2 = renderPage({
      programAtLeast32Months: false,
    });
    expect(utils2.container.querySelectorAll('[error]')).to.have.length(0);
    utils2.unmount();
  });

  it('shows an error when no option is selected on submit', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('error')).to.equal(
      'Select one of the options below.',
    );
  });
});
