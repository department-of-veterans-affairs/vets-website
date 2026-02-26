import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/remarks';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0989 remarks page', () => {
  it('renders the correct input and label', () => {
    const { container } = renderPage();
    expect(
      container.querySelector(
        'va-textarea[label="Additional information to support your request of entitlement restoration"]',
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
