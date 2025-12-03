import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/PayeeNumber';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 payee number page', () => {
  it('renders the input with the correct label', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-text-input');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal('Payee number');
  });

  it('accepts a valid code without error', () => {
    const { container, unmount } = renderPage({
      payeeNumber: 'AB',
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();

    const utils2 = renderPage({
      payeeNumber: '',
    });
    expect(utils2.container.querySelectorAll('[error]')).to.have.length(0);
    utils2.unmount();
  });

  it('shows an error when a badf input is given', async () => {
    const { container, getByRole } = renderPage({ payeeNumber: '$$' });
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const vaRadio = container.querySelector('va-text-input');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('error')).to.equal(
      'Enter your response in a valid format',
    );
  });
});
