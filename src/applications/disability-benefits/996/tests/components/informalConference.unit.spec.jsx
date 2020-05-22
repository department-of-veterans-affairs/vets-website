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

  it('should show the call representative name & phone inputs and time checkboxes', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{ informalConference: 'rep' }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    // 3 Radio: Informal conference
    // 2 inputs (text + tel): rep name & phone
    // 4 checkboxes - time period
    expect($$('input', formDOM).length).to.equal(9);
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
            phone: '800 555-1212',
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    expect($('input[type="text"]', formDOM).value).to.equal('John Doe');
    expect($('input[type="tel"]', formDOM).value).to.equal('800 555-1212');
  });

  it('should show the time checkboxes', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{ informalConference: 'me' }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    expect($$('input', formDOM).length).to.equal(7);
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

  it('successfully submits when a conference & time is selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          informalConference: 'me',
          informalConferenceTimes: {
            time1000to1200: true,
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect($$('.usa-alert-info', formDOM).length).to.equal(1);
    expect(onSubmit.called).to.be.true;
  });

  it('successfully submits when a conference w/rep & time is selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          informalConference: 'rep',
          informalConferenceRep: {
            name: 'John Doe',
            phone: '8005551212',
          },
          informalConferenceTimes: {
            time1000to1200: true,
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect($$('.usa-alert-info', formDOM).length).to.equal(1);
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

  it('prevents submit when no time is selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          informalConference: 'me',
          informalConferenceTimes: {},
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(1);
    expect($$('.usa-alert-info', formDOM).length).to.equal(0);
    expect(onSubmit.called).not.to.be.true;
  });

  it('prevents submit when excessive times are selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          informalConference: 'me',
          informalConferenceTimes: {
            time0800to1000: true,
            time1000to1200: true,
            time1230to1400: true,
            time1400to1630: true,
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(1);
    expect($$('.usa-alert-info', formDOM).length).to.equal(0);
    expect(onSubmit.called).not.to.be.true;
  });
});
