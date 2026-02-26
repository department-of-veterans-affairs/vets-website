import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/didCompleteProgramOfStudy';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0989 school was closed', () => {
  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain('Program information');
  });

  it('renders the radio group with the correct label', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Did you complete a program of study at the closed, or disapproved school?',
    );
  });

  it('accepts any valid option without error', () => {
    const { container, unmount } = renderPage({
      didCompleteProgramOfStudy: true,
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();
    const utils2 = renderPage({
      didCompleteProgramOfStudy: false,
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
      'Select ‘yes’ if you completed a program of study at the closed or disapproved school',
    );
  });
});
