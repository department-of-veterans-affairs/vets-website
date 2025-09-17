import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/agreementType';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('22-0839 agreementType page', () => {
  it('renders the radio group with the correct label', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'What would you like to do with your Yellow Ribbon agreement?',
    );
  });

  it('accepts any valid option without error', () => {
    const { container, unmount } = renderPage({
      agreementType: 'startNewOpenEndedAgreement',
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();

    const utils2 = renderPage({
      agreementType: 'modifyExistingAgreement',
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
    expect(vaRadio.getAttribute('error')).to.equal('Please make a selection');
  });
});
