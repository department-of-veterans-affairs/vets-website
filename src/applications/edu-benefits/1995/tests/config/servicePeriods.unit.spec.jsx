import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Edu 1995 servicePeriods', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.servicePeriods;
  const definitions = formConfig.defaultDefinitions;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')).to
      .not.be.empty;
  });

  it('should render service fields', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    const formDOM = findDOMNode(form);
    const newServiceInput = formDOM.querySelector('input[type=radio]');

    // just yes/no
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input').length,
    ).to.equal(2);
    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'select')).to
      .be.empty;

    ReactTestUtils.Simulate.change(newServiceInput, {
      target: {
        value: 'Y',
      },
    });

    // yes/no and service period fields (text box and two dates)
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input').length,
    ).to.equal(6);
  });

  it('should have no required inputs', async () => {
    const onSubmit = sandbox.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);

    await waitFor(() => {
      expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.not.be
        .empty;
    });
    // expect(onSubmit.called).to.be.false;
  });
});
