import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/programInformationIntro';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 program information intro page', () => {
  it('renders the correct text', () => {
    const { getByText } = renderPage();
    expect(getByText('What you’ll need to have prepared for your program')).to
      .exist;
    expect(getByText('The name of the degree program')).to.exist;
    expect(getByText('Number of credit hours')).to.exist;
    expect(getByText('Important information about your application')).to.exist;
  });
});
