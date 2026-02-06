import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/primaryInstitutionType';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 primary institution type page', () => {
  it('renders the correct inputs and labels', () => {
    const { container } = renderPage();
    expect(
      container.querySelector(
        'va-radio[label="Which best describes this institution?"]',
      ),
    ).to.exist;
  });

  it('shows errors when selection is made', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));

    const radioInput = container.querySelector('va-radio');
    expect(radioInput.getAttribute('error')).to.equal(
      'You must make a selection',
    );
  });
});
