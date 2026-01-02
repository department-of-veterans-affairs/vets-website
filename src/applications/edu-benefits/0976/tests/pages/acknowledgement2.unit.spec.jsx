import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/acknowledgement2';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

const baseData = {
  authorizingOfficial: {
    fullName: {
      first: 'John',
      last: 'Doe',
    },
  },
};

describe('22-0976 what to expect page', () => {
  it('renders page title', () => {
    const { container } = renderPage(baseData);
    expect(container.textContent).to.contain(
      'Institution Acknowledgements (2 of 5)',
    );
  });

  it('renders the input field', () => {
    const { container } = renderPage(baseData);

    const input = container.querySelector('va-text-input');
    expect(input).to.exist;
  });

  it('shows error when initials are empty on submit', async () => {
    const { container, getByRole } = renderPage(baseData);

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const input = container.querySelector('va-text-input');

      expect(input.getAttribute('error')).to.equal('Enter your initials');
    });
  });

  it('shows error when initials do not match', async () => {
    const { container, getByRole } = renderPage({
      ...baseData,
      acknowledgement8: 'ZZ',
    });

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const input = container.querySelector('va-text-input');

      expect(input.getAttribute('error')).to.equal(
        'Initials must match your name: John Doe',
      );
    });
  });
});
