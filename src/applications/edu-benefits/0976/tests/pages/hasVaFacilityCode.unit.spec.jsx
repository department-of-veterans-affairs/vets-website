import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/hasVaFacilityCode';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 has VA facility code page', () => {
  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain('Institution VA Facility Code');
  });

  it('renders the radio group with the correct label', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Does your institution have a VA Facility Code?',
    );
  });

  it('accepts any valid option without error', () => {
    const { container, unmount } = renderPage({
      hasVaFacilityCode: true,
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();
    const utils2 = renderPage({
      hasVaFacilityCode: false,
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
      'Select ‘yes’ if your institution has a VA Facility Code',
    );
  });
});
