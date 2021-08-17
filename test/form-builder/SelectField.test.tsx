import React from 'react';
import { waitFor } from '@testing-library/react';

import SelectField from '../../src/form-builder/SelectField';
import { buildRenderForm, changeValue } from '../utils';

const renderForm = buildRenderForm({});

const getInput = (container: HTMLElement): HTMLVaSelectElement => {
  const input = container.querySelector('va-select') as HTMLVaSelectElement;
  if (!input) throw new Error('No va-select found');
  return input;
};

const componentUnderTest = (
  <SelectField name="thing" label="The Thing">
    <option value="first">Item one</option>
    <option value="second">Item two</option>
  </SelectField>
);

describe('Form Builder - SelectField', () => {
  test('renders', () => {
    const { container } = renderForm(componentUnderTest);
    const input = getInput(container);
    expect(input.getAttribute('label')).toEqual('The Thing');
    expect(input.getAttribute('name')).toEqual('thing');
  });

  test('renders initial value', () => {
    const rf = buildRenderForm({ thing: 'second' });
    const { container } = rf(componentUnderTest);
    const input = getInput(container);
    expect(input.getAttribute('value')).toEqual('second');
  });

  test('renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <SelectField name="thing" label="The Thing" required />
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('thing');
    });
    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test('renders a custom "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <SelectField
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
      <SelectField name="thing" label="The Thing" validate={spy} />
    );
    await waitFor(() => {
      getFormProps().validateField('thing');
    });
    expect(spy).toBeCalled();
  });

  test('updates the formik state', async () => {
    const { container, getFormProps } = renderForm(componentUnderTest);
    const input = getInput(container);
    await changeValue(input, 'second', 'vaSelect');
    expect(getFormProps().values).toEqual({ thing: 'second' });
  });
});
