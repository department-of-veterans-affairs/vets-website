import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils.jsx';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import * as personId from '../../../src/js/definitions/personId';

describe('Edu personId', () => {
  const uiSchema = personId.uiSchema('veteran', 'view:noSSN');
  const schema = personId.schema({ definitions: commonDefinitions });
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );
    const formDOM = findDOMNode(form);
    const inputs = Array.from(formDOM.querySelectorAll('input, select'));

    expect(inputs.length).to.equal(2);
  });

  it('should conditionally require SSN or file number', () => {
    const form = render(
      <DefinitionTester
        formData={{}}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
      />,
    );

    // VA file number input is not visible; error is shown for empty SSN input
    waitFor(() => {
      const ssnError = form.container.querySelector(
        '.usa-input-error #root_veteranSocialSecurityNumber',
      );
      expect(ssnError).not.to.be.null;
      const vaFileNumber = form.container.querySelector('#root_vaFileNumber');
      expect(vaFileNumber).to.be.null;
    });
    const checkbox = form.getByLabelText(
      /I don’t have a Social Security number/,
    );

    fireEvent.change(checkbox, { target: { checked: true } });

    waitFor(() => {
      expect(
        form.container.querySelector(
          '.usa-input-error #root_veteranSocialSecurityNumber',
        ),
      ).to.be.null;
      expect(form.container.querySelector('#root_vaFileNumber')).not.to.be.null;
    });
  });
  it('should submit with no errors when required field is filled', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        formData={{}}
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    submitForm(form);
    expect(onSubmit.called).to.be.false;
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be
      .empty;

    ReactTestUtils.Simulate.change(find('#root_veteranSocialSecurityNumber'), {
      target: {
        value: '123456788',
      },
    });

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be
      .empty;
    submitForm(form);
    expect(onSubmit.called).to.be.true;
  });
});
