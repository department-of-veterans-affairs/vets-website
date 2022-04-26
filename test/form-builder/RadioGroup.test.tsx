import React from 'react';
import { waitFor } from '@testing-library/react';

import { RadioGroup } from '../../src/form-builder/RadioGroup';
import { buildRenderForm } from '../utils';

const renderForm = buildRenderForm({ "radio-test": false });

const getInput = (container: HTMLElement) => {
  const input = container.querySelector('va-radio');
  if (!input) throw new Error('No va-radiogroup found');
  return input;
}

  const testComponent = (
    <RadioGroup 
      name="radio-test"
      class="radio-test-class"
      label="Radio Button"
      options={
        [
          {label: "Yes", name: "yes", value: "yes", key: 1}, 
          {label: "No", name: "no", value: "no", key: 2}
        ]
      }
      required
    />
  )

  const testComponentErrorMessage = (
    <RadioGroup 
      name="radio-test"
      label="Radio Button"
      options={
        [
          {label: "Yes", name: "yes", value: "yes", key: 1}, 
          {label: "No", name: "no", value: "no", key: 2}
        ]
      }
      required="You can't proceed without checking this box"
    />
  )

describe('Form Builder - RadioGroup', () => {
  test('renders', () => {
    const { container } = renderForm(testComponent);
    const input = getInput(container);
    expect(input.getAttribute('label')).toEqual('Radio Button');
    expect(input.getAttribute('name')).toEqual('radio-test');
  });

  test('renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(testComponent);
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('radio-test');
    });
    expect(input?.getAttribute('error')).toEqual('Please provide a response');
  });

  test('renders a custom "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(testComponentErrorMessage);
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('radio-test');
    });
    expect(input?.getAttribute('error')).toEqual(
      "You can't proceed without checking this box"
    );
  });

  test('renders initial value', () => {
    const { container } = renderForm(testComponent);
    const vaRadioGroup = container.querySelector('va-radio') as HTMLElement;
    expect(vaRadioGroup?.getAttribute('value')).toBe("false");
  });
});
