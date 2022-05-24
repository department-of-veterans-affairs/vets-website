/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import { waitFor } from '@testing-library/react';

import TextField from '../../src/form-builder/TextField';
import { buildRenderForm, changeValue } from '../utils';

const renderForm = buildRenderForm({});

const getInput = (container: HTMLElement): HTMLVaTextInputElement => {
  const input = container.querySelector(
    'va-text-input'
  ) as HTMLVaTextInputElement;
  if (!input) throw new Error('No va-text-input found');
  return input;
};

describe('Form Builder - TextField', () => {
  test('renders', () => {
    const { container } = renderForm(
      <TextField name="thing" label="The Thing" />
    );
    const input = getInput(container);
    expect(input.getAttribute('label')).toEqual('The Thing');
    expect(input.getAttribute('name')).toEqual('thing');
  });

  test('renders initial value', () => {
    const rf = buildRenderForm({ thing: 'asdf' });
    const { container } = rf(<TextField name="thing" label="The Thing" />);
    const input = getInput(container);
    expect(input.getAttribute('value')).toEqual('asdf');
  });

  test('renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <TextField name="thing" label="The Thing" required />
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('thing');
    });
    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test('renders a custom "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <TextField
        name="thing"
        label="The Thing"
        required="You need to fill this in, bub"
      />
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('thing');
    });
    expect(input?.getAttribute('error')).toEqual(
      'You need to fill this in, bub'
    );
  });

  test('validates using a function', async () => {
    const spy = jest.fn();
    const { getFormProps } = renderForm(
      <TextField name="thing" label="The Thing" validate={spy} />
    );
    await waitFor(() => {
      getFormProps().validateField('thing');
    });
    expect(spy).toBeCalled();
  });

  test.skip('updates the formik state', async () => {
    const rf = buildRenderForm({ thing: 'foo' });
    const { container, getFormProps } = rf(
      <TextField name="thing" label="The Thing" />
    );
    const input = getInput(container);
    await changeValue(input, 'asdf');
    expect(getFormProps().values).toEqual({ thing: 'asdf' });
  });
});
