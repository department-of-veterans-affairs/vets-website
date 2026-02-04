import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/SelectVABenefit';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 select benefit page', () => {
  it('renders the radio group with the correct label', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Which VA education benefit program are you using to request reimbursement for this test fee?',
    );
  });

  it('accepts any valid option without error', () => {
    const { container, unmount } = renderPage({
      agreementType: 'chapter30',
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();

    const utils2 = renderPage({
      agreementType: 'chapter33',
    });
    expect(utils2.container.querySelectorAll('[error]')).to.have.length(0);
    utils2.unmount();
  });

  it('shows an error when no option is selected on submit', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await new Promise(resolve => setTimeout(resolve, 0));

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('error')).to.equal(
      'You must provide a response',
    );
  });
});
