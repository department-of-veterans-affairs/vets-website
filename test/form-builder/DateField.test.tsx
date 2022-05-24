/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import { waitFor } from '@testing-library/react';

import { buildRenderForm, changeValue } from '../utils';
import { DateField } from '../../src';

const renderForm = buildRenderForm({});

const getInput = (container: HTMLElement): HTMLVaTextInputElement => {
  const input = container.querySelector(
    'va-date'
  ) as HTMLVaTextInputElement;
  if (!input) throw new Error('No va-date found');
  return input;
};

describe('Form Builder - DateField', () => {
  test('renders', () => {
    const { container } = renderForm(
      <DateField name="dateOfBirth" label="Date of Birth" />
    );
    const input = getInput(container);
    expect(input.getAttribute('label')).toEqual('Date of Birth');
    expect(input.getAttribute('name')).toEqual('dateOfBirth');
  });

  test('renders initial value', () => {
    const rf = buildRenderForm({ dateOfBirth: '2022-05-20' });
    const { container } = rf(<DateField name="dateOfBirth" label="Date of Birth" />);
    const input = getInput(container);
    expect(input.getAttribute('value')).toEqual('2022-05-20');
  });

  test('renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <DateField name="dateOfBirth" label="Date of Birth" required />
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('dateOfBirth');
    });
    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test.skip('updates the formik state', async () => {
    const rf = buildRenderForm({ dateOfBirth: '2022-05-20' });
    const { container, getFormProps } = rf(
      <DateField name="dateOfBirth" label="Date of Birth" />
    );
    const input = getInput(container);
    await changeValue(input, '2021-08-28');
    expect(getFormProps().values).toEqual({ dateOfBirth: '2021-08-28' });
  });
});
