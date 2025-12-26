import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/whatToExpect';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 what to expect page', () => {
  it('renders the static content correctly', () => {
    const { getByText } = renderPage();
    expect(getByText('What to expect')).to.exist;
    expect(getByText(/In order for a program to be approved/)).to.exist;
  });
});
