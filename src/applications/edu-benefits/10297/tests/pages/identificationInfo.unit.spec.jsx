import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import identificationInformation from '../../pages/identificationInformation';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={identificationInformation.schema}
      uiSchema={identificationInformation.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('Identification information page', () => {
  it('renders the title, description, and both number fields', () => {
    const { getByText, container } = renderPage();

    expect(getByText('Identification information')).to.exist;
    expect(
      getByText(
        'You must enter either a Social Security number or a VA File number.',
        { exact: false },
      ),
    ).to.exist;

    const inputs = container.querySelectorAll(
      'va-text-input, va-ssn-input, va-ssn',
    );
    expect(inputs.length).to.equal(2);
  });
  it('shows a validation error when neither number is supplied', () => {
    const { getByRole, container } = renderPage();

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    const errNode = container.querySelector('[error]');
    expect(errNode).to.exist;
    expect(errNode.getAttribute('error')).to.contain(
      'Please enter a Social Security number',
    );
  });

  it('accepts an SSN or a VA file number (mutually exclusive validation)', () => {
    let utils = renderPage({ idNumber: { ssn: '123456789' } });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
    utils.unmount();

    utils = renderPage({ idNumber: { vaFileNumber: '87654321' } });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
  });
});
