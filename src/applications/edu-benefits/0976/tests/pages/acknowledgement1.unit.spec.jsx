import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/acknowledgement1';

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
  // it('renders the static content correctly', () => {
  //   const { getByText } = renderPage(baseData);
  //   expect(getByText('What to expect')).to.exist;
  //   expect(getByText(/In order for a program to be approved/)).to.exist;
  // });
  it('renders page title', () => {
    const { container } = renderPage(baseData);
    expect(container.textContent).to.contain(
      'The following are requirements for participation',
    );
  });

  it('renders the input field', () => {
    const { container } = renderPage(baseData);

    const input = container.querySelector(
      'input[name="root_acknowledgement7"][type="text"]',
    );
    expect(input).to.exist;
  });

  it('shows error when initials are empty on submit', async () => {
    const { getByRole } = renderPage(baseData);

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const inputError = getByRole('alert');

      expect(inputError).to.exist;
      expect(inputError.textContent).to.contain('Enter initials');
    });
  });

  it('shows error when initials do not match', async () => {
    const { getByRole } = renderPage({
      ...baseData,
      acknowledgement7: 'ZZ',
    });

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const inputError = getByRole('alert');
      expect(inputError).to.exist;
      expect(inputError.textContent).to.contain(
        'Initials must match your name',
      );
    });
  });
});
