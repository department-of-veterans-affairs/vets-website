import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/primaryInstitutionWebsite';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 website page', () => {
  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain(
      'What is your institution’s web address?',
    );
  });

  it('renders the text input with the correct label', () => {
    const { container } = renderPage();
    const vaText = container.querySelector('va-text-input');
    expect(vaText).to.exist;
    expect(vaText.getAttribute('label')).to.equal(
      'Your institution’s website address',
    );
  });
});
