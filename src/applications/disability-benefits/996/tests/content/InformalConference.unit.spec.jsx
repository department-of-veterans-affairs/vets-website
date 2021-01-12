import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { $$ } from '../../helpers';

import formConfig from '../../config/form';
import informalConference from '../../pages/informalConference';

const { schema, uiSchema } = informalConference;

describe('Higher-Level Review 0996 informal conference', () => {
  it('should render informal conference form', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    expect($$('input[type="radio"]', formDOM).length).to.equal(3);
  });

  /* Successful submits */
  it('successfully submits when no informal conference is selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{ informalConference: 'no' }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  /* Unsuccessful submits */
  it('prevents submit when informal conference is not selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(1);
    expect(onSubmit.called).not.to.be.true;
  });
});
