import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('HLR informal conference rep v2 page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.informalConference.pages.representativeInfoV2;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);

    expect($$('input', formDOM).length).to.equal(5);
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

    formDOM.fillData('#root_informalConferenceRep_firstName', 'James');
    formDOM.fillData('#root_informalConferenceRep_lastName', 'Sullivan');
    formDOM.fillData('#root_informalConferenceRep_phone', '8005551212');
    formDOM.fillData('#root_informalConferenceRep_extension', '1234');
    formDOM.fillData('#root_informalConferenceRep_email', 'x@x.com');

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

    formDOM.submitForm();
    expect($$('.usa-input-error', formDOM).length).to.equal(3);
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

    formDOM.fillData('#root_informalConferenceRep_firstName', 'James');
    formDOM.fillData('#root_informalConferenceRep_lastName', 'Sullivan');
    formDOM.submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
