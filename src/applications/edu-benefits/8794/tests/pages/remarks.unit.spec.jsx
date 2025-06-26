import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { uiSchema, schema } from '../../pages/remarks';

describe('8794 – Remarks page', () => {
  const longText = 'x'.repeat(501);

  const renderPage = () =>
    render(
      <DefinitionTester
        uiSchema={uiSchema}
        schema={schema}
        formData={{}}
        definitions={formConfig.defaultDefinitions}
      />,
    );

  it('renders one <va-textarea>', () => {
    const { container } = renderPage();
    expect(container.querySelectorAll('va-textarea').length).to.equal(1);
  });
  it('shows a max-length validation error when remarks exceed 500 chars', async () => {
    const { container, getByRole } = renderPage();

    const textarea = container.querySelector('va-textarea');
    Object.defineProperty(textarea, 'value', {
      value: longText,
      writable: true,
    });

    fireEvent(
      textarea,
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
      }),
    );
    fireEvent.click(
      getByRole('button', {
        name: /submit|continue/i,
      }),
    );
    await waitFor(() =>
      expect(container.querySelectorAll('va-textarea[error]').length).to.equal(
        1,
      ),
    );

    expect(container.innerHTML).to.contain(
      'You are over the character limit. Please adjust your remarks.',
    );
  });
});
