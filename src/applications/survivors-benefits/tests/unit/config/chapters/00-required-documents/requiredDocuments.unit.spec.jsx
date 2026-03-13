import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import requiredDocuments from '../../../../../config/chapters/00-required-documents/requiredDocuments';

describe('00-required-documents / requiredDocuments page', () => {
  const { schema, uiSchema } = requiredDocuments;

  it('renders the page heading', () => {
    const screen = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: "Veteran's DD214 and death certificate",
      }),
    ).to.exist;
  });

  it('renders the intro description', () => {
    const { container } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    expect(container.textContent).to.include("Next we'll ask you to submit");
  });

  it('renders the required documents va-accordion', () => {
    const { container } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    expect(container.querySelector('va-accordion')).to.exist;
  });

  it('renders two va-accordion-items (death certificate and DD-214)', () => {
    const { container } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    expect(container.querySelectorAll('va-accordion-item').length).to.equal(2);
  });

  it('first accordion item is for death certificate', () => {
    const { container } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const items = container.querySelectorAll('va-accordion-item');
    expect(items[0].getAttribute('header')).to.include('death certificate');
  });

  it('second accordion item is for DD-214', () => {
    const { container } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const items = container.querySelectorAll('va-accordion-item');
    expect(items[1].getAttribute('header')).to.include('DD214');
  });

  it('schema has no form fields', () => {
    expect(schema.type).to.equal('object');
    expect(schema.properties).to.deep.equal({});
  });
});
