import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/institutionContactsInstructions';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 contacts instructions page', () => {
  it('renders the static content correctly', () => {
    const { getByText } = renderPage();
    expect(getByText('Provide Contacts for Your Institution')).to.exist;
    expect(getByText(/You will be asked to provide the contact information/)).to
      .exist;
  });
});
