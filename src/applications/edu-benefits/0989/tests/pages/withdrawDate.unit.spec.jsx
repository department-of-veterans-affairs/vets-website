import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/withdrawDate';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 withdraw date page', () => {
  it('renders the correct input and label', () => {
    const { container } = renderPage();
    expect(
      container.querySelector(
        'va-memorable-date[label="Your school withdrawal date"]',
      ),
    ).to.exist;
  });

  it('shows errors when no input is given', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const dateInput = container.querySelector(
      'va-memorable-date[label="Your school withdrawal date"]',
    );
    expect(dateInput.getAttribute('error')).to.equal('You must enter a date');
  });
});
