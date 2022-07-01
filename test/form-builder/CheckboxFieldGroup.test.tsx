import React from 'react';
import { waitFor } from '@testing-library/react';

import CheckboxFieldGroup from '../../src/form-builder/CheckboxFieldGroup';
import { buildRenderForm } from '../utils';

const renderForm = buildRenderForm({ thing: false, breakfast: [] });

const getCheckboxGroupContainer = (container: HTMLElement): HTMLElement => {
  const checkboxGroupContainer = container.querySelector(
    'va-checkbox-group'
  ) as HTMLElement;
  if (!checkboxGroupContainer) throw new Error('No va-checkbox found');
  return checkboxGroupContainer;
};

const testData = {
  label: 'What breakfast?',
  name: 'breakfast',
  id: '12',
  /**
   * If `required` is true, the default message will be used. If `required` is a
   * string, it will be used as the error message.
   */
  required: true,
  options: [
    {
      name: 'eggs',
      label: 'Eggs',
      content: '🐥🐣',
      required: false,
    },
    {
      name: 'protein',
      label: 'Protein Shake',
      content: '🏋️',
      required: true,
    },
    {
      name: 'toast',
      label: 'Toast',
      content: '🍞',
      required: false,
    },
    {
      name: 'fruit',
      label: 'Fruit',
      content: '🍐',
      required: false,
    },
  ],
};

describe('Form Builder - CheckboxFieldGroup', () => {
  test('renders', () => {
    const { container } = renderForm(<CheckboxFieldGroup {...testData} />);
    const checkboxGroup = getCheckboxGroupContainer(container);
    const firstCheckbox = checkboxGroup.querySelector('va-checkbox');
    expect(firstCheckbox?.label).toEqual('Eggs');
  });

  test('renders the default "required" validation error message', async() => {
    const rf = buildRenderForm({
                                 breakfast: {
                                   eggs: false,
                                   protein: false,
                                   toast: false,
                                   fruit: false,
                                 },
                               });
    const { container, getFormProps } = rf(
      <CheckboxFieldGroup {...testData} />
    );
    const input = getCheckboxGroupContainer(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('breakfast');
    });

    expect(input.getAttribute('error')).toContain('Please provide a response');
  });

  test('does not render the default "required" validation error message when required is not set', async() => {
    const rf = buildRenderForm({
                                 breakfast: {
                                   eggs: false,
                                   protein: false,
                                   toast: false,
                                   fruit: false,
                                 },
                               });
    const { container, getFormProps } = rf(
      <CheckboxFieldGroup {...testData} required={false}/>
    );
    const input = getCheckboxGroupContainer(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('breakfast');
      expect(input.getAttribute('error')).toBeFalsy();
    });
  });

  test('renders initial value', () => {
    const rf = buildRenderForm({
        eggs: true,
        protein: false,
        toast: false,
        fruit: false,
    });
    const { container } = rf(<CheckboxFieldGroup {...testData} />);
    const input = getCheckboxGroupContainer(container);
    const firstCheckbox = input.querySelector('va-checkbox');
    // This expects the string "true" because attributes on HTML elements are
    // always strings

    expect(firstCheckbox?.getAttribute('checked')).toBeTruthy();
  });

  test('renders initial value for nested objects', () => {
    const nestedTestData = {
      label: 'What meal?',
      name: 'meal',
      id: '12',
      required: true,
      values: {},
      options: [
        {
          name: 'breakfast.eggs',
          label: 'Eggs',
          content: '🐥🐣',
          required: false,
        },
        {
          name: 'breakfast.protein',
          label: 'Protein Shake',
          content: '🏋️',
          required: true,
        },
        {
          name: 'breakfast.toast',
          label: 'Toast',
          content: '🍞',
          required: false,
        },
        {
          name: 'breakfast.fruit',
          label: 'Fruit',
          content: '🍐',
          required: false,
        },
      ],
    };
    const rf = buildRenderForm({
                                   breakfast: {
                                     eggs: true,
                                     protein: false,
                                     toast: false,
                                     fruit: false,
                                   },
                               });
    const { container } = rf(<CheckboxFieldGroup {...nestedTestData} />);
    const input = getCheckboxGroupContainer(container);
    const firstCheckbox = input.querySelector('va-checkbox');
    // This expects the string "true" because attributes on HTML elements are
    // always strings
    expect(firstCheckbox?.getAttribute('checked')).toBeTruthy();
  });
});
