import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, render } from '@testing-library/react';

import {
  DefinitionTester,
  getFormDOM,
} from '~/platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranInformation.pages.veteranInformation;

describe('Chapter 31 veteran information', () => {
  afterEach(cleanup);

  it('should render', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.container.querySelectorAll('input').length).to.equal(4);
  });

  it('should submit with the required fields', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(form.getByLabelText(/your first name/i), {
      target: { value: 'John' },
    });

    fireEvent.change(form.getByLabelText(/your last name/i), {
      target: { value: 'Doe' },
    });

    fireEvent.change(form.getByLabelText(/month/i), {
      target: { value: '1' },
    });

    fireEvent.change(form.getByLabelText(/day/i), {
      target: { value: '1' },
    });

    fireEvent.change(form.getByLabelText(/year/i), {
      target: { value: '1991' },
    });

    expect(form.container.querySelectorAll('.usa-input-error').length).to.equal(
      0,
    );

    fireEvent.submit(form.container.querySelector('form'));

    expect(onSubmit.called).to.be.true;
  });

  it('should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    const formDom = getFormDOM(form);
    formDom.submitForm();
    expect(form.container.querySelectorAll('.usa-input-error').length).to.equal(
      3,
    );

    expect(onSubmit.called).to.be.false;
  });
});
