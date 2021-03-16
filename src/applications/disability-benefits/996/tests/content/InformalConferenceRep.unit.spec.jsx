import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { $, $$ } from '../../helpers';

import formConfig from '../../config/form';
import informalConferenceRep from '../../pages/informalConferenceRep';

const { schema, uiSchema } = informalConferenceRep;

describe('Higher-Level Review 0996 informal conference representative', () => {
  const data = {
    informalConference: 'rep',
    informalConferenceRep: {
      name: 'John Doe',
      phone: '8005551212',
    },
  };

  it('should render informal conference representative form', () => {
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
    expect($$('input[type="text"]', formDOM).length).to.equal(1);
    expect($$('input[type="tel"]', formDOM).length).to.equal(1);
  });

  it('should show the call representative name & phone info', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          informalConference: 'rep',
          informalConferenceRep: {
            name: 'John Doe',
            phone: '800-555-1212',
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    expect($('input[type="text"]', formDOM).value).to.equal('John Doe');
    expect($('input[type="tel"]', formDOM).value).to.equal('800-555-1212');
  });

  it('prevents submit when informal conference is not selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          // needed to set name/phone as required
          informalConference: 'rep',
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(2);
    expect(onSubmit.called).not.to.be.true;
  });

  it('successfully submits when a rep info is entered', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={data}
        formData={data}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
