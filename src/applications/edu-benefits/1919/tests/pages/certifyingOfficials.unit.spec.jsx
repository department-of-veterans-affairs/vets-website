import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import sinon from 'sinon';
import formConfig from '../../config/form';

describe('22-1919 Certifying Officials page', () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.certifyingOfficial;

  it('renders the correct amount of inputs', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(container.querySelectorAll('va-text-input').length).to.equal(2);
  });

  it('calls onChange with the correct value when "other" role input changes', () => {
    const formData = {
      certifyingOfficial: {
        role: {
          level: 'other',
        },
      },
    };
    const onChange = sinon.spy();
    const { getByPlaceholderText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onChange={onChange}
      />,
    );
    const input = getByPlaceholderText(
      'Example: Registrar, Bursar, Campus director',
    );
    fireEvent.change(input, { target: { value: 'Registrar' } });
    expect(onChange.called).to.be.false;
  });
});
