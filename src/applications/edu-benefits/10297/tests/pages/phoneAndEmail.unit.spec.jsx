import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('22-10297 Phone and email address page', () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.identificationChapter.pages.phoneAndEmail;

  it('renders input for mobile number', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect(
      container.querySelector(
        'va-telephone-input[label="Mobile phone number"]',
      ),
    ).to.exist;
  });

  it('renders input for home number', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect(
      container.querySelector('va-telephone-input[label="Home phone number"]'),
    ).to.exist;
  });

  it('renders input for email address', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect(container.querySelector('va-text-input[label="Email"]')).to.exist;
  });
});
