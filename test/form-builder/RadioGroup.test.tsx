import React from 'react';
import { fireEvent, getByTestId, waitFor } from '@testing-library/react';
import { RadioGroup } from '../../src/form-builder/RadioGroup';
import { buildRenderForm, changeValue } from '../utils';

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
      label="Radio Group"
      options={
        [
          {label: "Yes", name: "yes", value: "yes", key: 1, checked: true}, 
          {label: "No", name: "no", value: "no", key: 2, checked: false}
        ]
      }
      required
    />
  )

  const testComponentErrorMessage = (
    <RadioGroup 
      name="radio-test"
      label="Radio Group"
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
    expect(input.getAttribute('label')).toEqual('Radio Group');
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

  //This test renders a checked value and checks that value, but we cannot test on the click event. 
  //Due to web component's use of the shadow DOM, React Testing Library cannot find the select event on the VaSelect component
  //Recommend to update this test at a later date when these issues are resolved
  //https://github.com/testing-library/dom-testing-library/issues/413
  //https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/671
  test('checks for available options and checks intitial selected option', async () => {
    const renderForm = buildRenderForm({ "radio-test": false }); 
    const {container} = renderForm(testComponent);
    await waitFor(() => {
      const el = getByTestId(container, 'radio-test-0');
      el.focus();
      fireEvent.click(el);
      expect(el.getAttribute('checked')).toBeTruthy();
    });
  })

  test.skip('checks radio button options of type boolean', async () => {
    const renderForm = buildRenderForm({ "veteranServedUnderAnotherName": false }); 
    const {container, getFormProps} = renderForm(
      <RadioGroup
            name="veteranServedUnderAnotherName"
            label="Did the Veteran serve under another name?"
            required
            options={
              [
                {label: "Yes", value: true, key: 1},
                {label: "No", value: false, key: 2},
              ]
            }
          />
    );
    const el = getByTestId(container, 'veteranServedUnderAnotherName-0');
    await changeValue(el, true);
    expect(getFormProps().values).toEqual({ veteranServedUnderAnotherName: true });
  })
});