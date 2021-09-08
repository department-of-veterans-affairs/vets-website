import React from 'react';
import { waitFor } from '@testing-library/react';

import CheckboxField from '../../src/form-builder/CheckboxField';
import { buildRenderForm, changeValue } from '../utils';

const renderForm = buildRenderForm({ thing: false });

const getInput = (container: HTMLElement): HTMLVaCheckboxElement => {
  const input = container.querySelector('va-checkbox') as HTMLVaCheckboxElement;
  if (!input) throw new Error('No va-checkbox found');
  return input;
};

describe('Form Builder - CheckboxField', () => {
  test('renders', () => {
    const { container } = renderForm(
      <CheckboxField name="thing" label="The Thing" />
    );
    const input = getInput(container);
    expect(input.getAttribute('label')).toEqual('The Thing');
    expect(input.getAttribute('name')).toEqual('thing');
  });

  test('renders initial value', () => {
    const rf = buildRenderForm({ thing: true });
    const { container } = rf(<CheckboxField name="thing" label="The Thing" />);
    const input = getInput(container);
    // This expects the string "true" because attributes on HTML elements are
    // always strings
    expect(input.getAttribute('value')).toEqual('true');
  });

  test('renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <CheckboxField name="thing" label="The Thing" required />
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('thing');
    });
    expect(input?.getAttribute('error')).toEqual('Please provide a response');
  });

  test('renders a custom "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <CheckboxField
        name="thing"
        label="The Thing"
        required="You can't proceed without checking this box"
      />
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('thing');
    });
    expect(input?.getAttribute('error')).toEqual(
      "You can't proceed without checking this box"
    );
  });

  test('validates using a function', async () => {
    const spy = jest.fn();
    const { getFormProps } = renderForm(
      <CheckboxField name="thing" label="The Thing" validate={spy} />
    );
    await waitFor(() => {
      getFormProps().validateField('thing');
    });
    expect(spy).toBeCalled();
  });

  test('updates the formik state', async () => {
    const { container, getFormProps } = renderForm(
      <CheckboxField name="thing" label="The Thing" />
    );
    const input = getInput(container);
    await changeValue(input, true);
    expect(getFormProps().values).toEqual({ thing: true });
  });
});
