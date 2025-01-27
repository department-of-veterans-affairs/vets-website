import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
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

  it('should conditionally require SSN or file number', async () => {
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

    await waitFor(() => {
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

    await waitFor(() => {
      const rootVetSSn = form.container.querySelector(
        '.usa-input-error #root_veteranSocialSecurityNumber',
      );
      expect(rootVetSSn).to.be.null;
      const rootVaFileNumber = form.container.querySelector(
        '.usa-input-error #root_vaFileNumber',
      );
      expect(rootVaFileNumber).not.to.be.null;
    });
  });
  it('should submit with no errors when required field is filled', async () => {
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

    const ssnInput = form.container.querySelector(
      '#root_veteranSocialSecurityNumber',
    );
    fireEvent.change(ssnInput, { target: { value: '123456789' } });
    fireEvent(submitButton, mouseClick);

    await waitFor(() => {
      const errors = form.container.querySelectorAll('.usa-input-error');
      expect(Array.from(errors)).to.be.empty;
    });
  });
});
