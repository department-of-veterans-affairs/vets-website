import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { DefinitionTester } from '../../../testing/unit/schemaform-utils.jsx';
import * as personId from '../../definitions/personId';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

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

    const submitButton = form.getByRole('button', { name: 'Submit' });
    fireEvent(submitButton, mouseClick);

    waitFor(() => {
      // VA file number input is not visible; error is shown for empty SSN input
      const ssnError = form.container.querySelector(
        '.usa-input-error #root_veteranSocialSecurityNumber',
      );
      expect(ssnError).not.to.be.null;
      const vaFileNumber = form.container.querySelector('#root_vaFileNumber');
      expect(vaFileNumber).to.be.null;
    });

    // Check no-SSN box
    const checkbox = form.getByLabelText(
      /I don’t have a Social Security number/,
    );

    fireEvent.change(checkbox, { target: { checked: true } });

    waitFor(() => {
      const rootVetSSn = form.container.querySelector(
        '#.usa-input-error #root_veteranSocialSecurityNumber',
      );
      expect(rootVetSSn).to.be.null;
      const rootVaFileNumber = form.container.querySelector(
        '.usa-input-error #root_vaFileNumber',
      );
      expect(rootVaFileNumber).not.to.be.null;
    });
  });

  it('should submit with no errors when required field is filled', () => {
    const onSubmit = sinon.spy();
    const form = render(
      <DefinitionTester
        formData={{}}
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
      />,
    );

    const submitButton = form.getByRole('button', { name: 'Submit' });
    fireEvent(submitButton, mouseClick);

    waitFor(() => {
      const errors = form.container.querySelectorAll('.usa-input-error');
      expect(Array.from(errors)).not.to.be.empty;
    });

    const ssnInput = form.container.querySelector(
      '#root_veteranSocialSecurityNumber',
    );
    fireEvent.change(ssnInput, { target: { value: '123456789' } });

    waitFor(() => {
      const errors = form.container.querySelectorAll('.usa-input-error');
      expect(Array.from(errors)).to.be.empty;
    });
  });
});
