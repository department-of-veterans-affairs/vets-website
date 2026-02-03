import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/Remarks';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 remarks page', () => {
  it('renders the correct input and label', () => {
    const { container } = renderPage();
    expect(
      container.querySelector(
        'va-textarea[label="Use this space to add any information you’d like to include in your request"]',
      ),
    ).to.exist;
  });

  it('shows error when over max character limit', async () => {
    const { container, getByRole } = renderPage({ remarks: 'x'.repeat(501) });
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const nameInput = container.querySelector('va-textarea');
    expect(nameInput.getAttribute('error')).to.equal(
      'You are over the character limit. You must adjust your remarks.',
    );
  });
});
