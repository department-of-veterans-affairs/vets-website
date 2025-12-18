import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import * as page from '../../pages/PhoneAndEmail';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 Phone and email address page', () => {
  afterEach(cleanup);

  it('renders input for mobile number', () => {
    const { container } = renderPage();

    expect(
      container.querySelector(
        'va-telephone-input[label="Mobile phone number"]',
      ),
    ).to.exist;
  });

  it('renders input for home number', () => {
    const { container } = renderPage();

    expect(
      container.querySelector('va-telephone-input[label="Home phone number"]'),
    ).to.exist;
  });

  it('renders input for email address', () => {
    const { container } = renderPage();

    expect(container.querySelector('va-text-input[label="Email"]')).to.exist;
  });
});
