/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
import { waitFor } from '@testing-library/react';

import { buildRenderForm } from '../utils';
import PhoneField from '../../src/form-builder/PhoneField';

const renderForm = buildRenderForm({});

const getInput = (container: HTMLElement): JSX.Element => {
  const input = container.querySelector('va-text-input') as JSX.Element;
  if (!input) throw new Error('No va-phone-input found');
  return input;
};

describe('Form Builder - PhoneField', () => {
  test('it renders with the correct attributes', () => {
    const { container } = renderForm(<PhoneField name="phone" label="Phone" />);
    const input = getInput(container);

    expect(input.getAttribute('label')).toEqual('Phone');
    expect(input.getAttribute('name')).toEqual('phone');
  });
  test('it renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <PhoneField name="phone" label="Phone" required/>
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('phone');
    });
    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test('it renders a custom "required" validation error message', async () => {
    const customValidationMsg = 'Please enter a 10-digit phone number (with or without dashes)';
    const { container, getFormProps } = renderForm(
      <PhoneField name="phone" label="Phone" required={customValidationMsg}/>
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('phone'));

    expect(input.getAttribute('error')).toEqual(customValidationMsg);
  });

  test('it shows the correct error message for an invalid phone format', async () => {
    const rf = buildRenderForm({ phone: '(972)837' });
    const { container, getFormProps } = rf(
      <PhoneField name="phone" label="Phone" required/>
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('phone'));

    expect(input?.getAttribute('error')).toEqual(
      'Please enter a 10-digit phone number (with or without dashes)'
    );
  });

  test('it shows no error message for a valid phone', async () => {
    const rf = buildRenderForm({ phone: '(972)837-2964' });
    const { container, getFormProps } = rf(
      <PhoneField name="phone" label="Phone" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('phone'));

    expect(input?.getAttribute('error')).toBeNull();
  });

  test('it shows no error message for an empty phone if field is not required', async () => {
    const rf = buildRenderForm({ phone: '' });
    const { container, getFormProps } = rf(
      <PhoneField name="phone" label="Phone" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('phone'));

    expect(input?.getAttribute('error')).toBeNull();
  });

  test('it shows an error message for an empty phone if field is required', async () => {
    const rf = buildRenderForm({ phone: '' });
    const { container, getFormProps } = rf(
      <PhoneField name="phone" label="Phone" required/>
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('phone'));

    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test('it sets the field as touched on blur', async () => {
    const rf = buildRenderForm({ phone: '' });
    const { container, getFormProps } = rf(
      <PhoneField name="phone" label="Phone" required/>
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('phone'));

    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });
});
