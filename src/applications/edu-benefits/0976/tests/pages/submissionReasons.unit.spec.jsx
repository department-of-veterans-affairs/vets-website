import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/submissionReasons';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 submission reasons page', () => {
  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain('Application information');
  });

  it('renders the checkbox group with the correct label', () => {
    const { container } = renderPage();
    const vaCheckboxGroup = container.querySelector('va-checkbox-group');
    expect(vaCheckboxGroup).to.exist;
    expect(vaCheckboxGroup.getAttribute('label')).to.equal(
      'Why are you submitting this application?',
    );
  });

  it('shows an error when no option is selected on submit', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const vaCheckboxGroup = container.querySelector('va-checkbox-group');
    expect(vaCheckboxGroup).to.exist;
    expect(vaCheckboxGroup.getAttribute('error')).to.equal(
      'Please select at least one option',
    );
  });
});
