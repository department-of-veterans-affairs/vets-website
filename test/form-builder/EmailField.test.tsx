/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
import { waitFor } from '@testing-library/react';

import { buildRenderForm } from '../utils';
import EmailField from '../../src/form-builder/EmailField';

const renderForm = buildRenderForm({});

const getInput = (container: HTMLElement): JSX.Element => {
  console.log(container);
  const input = container.querySelector('va-text-input') as JSX.Element;
  if (!input) throw new Error('No va-email-input found');
  return input;
};

describe('Form Builder - EmailField', () => {
  test('it renders with the correct attributes', () => {
    const { container } = renderForm(<EmailField name="email" label="Email" />);
    const input = getInput(container);

    expect(input.getAttribute('label')).toEqual('Email');
    expect(input.getAttribute('name')).toEqual('email');
  });

  test('it renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <EmailField name="email" label="Email" required />
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('email');
    });

    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test('it renders a custom "required" validation error message', async () => {
    const expectedErrorMessage = 'You need to fill this in, bub';
    const { container, getFormProps } = renderForm(
      <EmailField name="email" label="Email" required={expectedErrorMessage} />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('email'));

    expect(input.getAttribute('error')).toEqual(expectedErrorMessage);
  });

  test('it shows the correct error message for an invalid email format', async () => {
    const rf = buildRenderForm({ email: 'foo' });
    const { container, getFormProps } = rf(
      <EmailField name="email" label="Email" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('email'));

    expect(input?.getAttribute('error')).toEqual(
      'Please enter an email address using this format: X@X.com'
    );
  });

  test('it shows no error message for a valid email', async () => {
    const rf = buildRenderForm({ email: 'foo@foo.com' });
    const { container, getFormProps } = rf(
      <EmailField name="email" label="Email" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('email'));

    expect(input?.getAttribute('error')).toBeNull();
  });

  test('it shows no error message for an empty email if field is not required', async () => {
    const rf = buildRenderForm({ email: '' });
    const { container, getFormProps } = rf(
      <EmailField name="email" label="Email" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('email'));

    expect(input?.getAttribute('error')).toBeNull();
  });

  test('it shows an error message for an empty email if field is required', async () => {
    const rf = buildRenderForm({ email: '' });
    const { container, getFormProps } = rf(
      <EmailField name="email" label="Email" required />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('email'));

    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test('it sets the field as touched on blur', async () => {
    const rf = buildRenderForm({ email: '' });
    const { container, getFormProps } = rf(
      <EmailField name="email" label="Email" required />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('email'));

    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });
});
