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
import informalConferenceTimes from '../../pages/informalConferenceTimes';

const { schema, uiSchema } = informalConferenceTimes;

describe('Higher-Level Review 0996 informal conference times', () => {
  it('should render informal conference times form', () => {
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
    expect($$('select', formDOM).length).to.equal(2);
  });

  /* Successful submit */
  it('successfully submits when one time is selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          informalConferenceTimes: {
            time1: 'time1000to1230',
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('successfully submits when two times are selected', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          informalConferenceTimes: {
            time1: 'time1000to1230',
            time2: 'time1230to1400',
          },
        }}
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
  it('prevents submit when no time is selected', () => {
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
