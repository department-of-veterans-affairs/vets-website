import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/submissionReasonUpdateInformationText';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 submission reason update information text page', () => {
  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain('Application information');
  });

  it('renders the text input', () => {
    const { container } = renderPage();
    const vaText = container.querySelector('va-textarea');
    expect(vaText).to.exist;
  });

  it('shows an error when no option is selected on submit', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const vaText = container.querySelector('va-textarea');
    expect(vaText).to.exist;
    expect(vaText.getAttribute('error')).to.equal(
      'You must provide a response',
    );
  });
});
