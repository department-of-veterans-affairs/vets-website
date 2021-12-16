import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';
import { $$ } from '../../utils/ui';

describe('HLR informal conference rep v1 page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.informalConference.pages.representativeInfo;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{ informalConference: 'rep' }}
      />,
    );
    const formDOM = getFormDOM(form);

    expect($$('input', formDOM).length).to.equal(2);
  });
  it('should allow submit', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{ informalConference: 'rep' }}
      />,
    );
    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_informalConferenceRep_name', 'James Sullivan');
    formDOM.fillData('#root_informalConferenceRep_phone', '8005551212');

    formDOM.submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
  it('should prevent continuing when data is missing', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{ informalConference: 'rep' }}
      />,
    );
    const formDOM = getFormDOM(form);

    formDOM.submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });
  it('should prevent continuing when phone is missing', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{ informalConference: 'rep' }}
      />,
    );
    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_informalConferenceRep_name', 'James Sullivan');
    formDOM.submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
