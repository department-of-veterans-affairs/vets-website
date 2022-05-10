import React from 'react';
import { waitFor } from '@testing-library/react';

import { buildRenderForm } from '../utils';
import SSNField from '../../src/form-builder/SSNField';

const renderForm = buildRenderForm({});

const getInput = (container: HTMLElement): JSX.Element => {
  const input = container.querySelector('va-text-input') as JSX.Element;
  if (!input) throw new Error('No va-ssn-input found');
  return input;
};

describe('Form Builder - SSNField', () => {
  test('it renders with the correct attributes', () => {
    const { container } = renderForm(<SSNField name="ssn" label="ssn" />);
    const input = getInput(container);

    expect(input.getAttribute('label')).toEqual('ssn');
    expect(input.getAttribute('name')).toEqual('ssn');
  });

  test('it renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <SSNField name="ssn" label="ssn" required />
    );
    const input = getInput(container);
    await waitFor(() => {
      getFormProps().setFieldTouched('ssn');
    });

    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test('it renders a custom "required" validation error message', async () => {
    const expectedErrorMessage = 'Unexpected Error Message';
    const { container, getFormProps } = renderForm(
      <SSNField name="ssn" label="ssn" required={expectedErrorMessage} />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input.getAttribute('error')).toEqual(expectedErrorMessage);
  });

  test('it shows the correct error message for consecutive numbers', async () => {
    const rf = buildRenderForm({ ssn: '123456789' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not be consecutive numbers.'
    );
  });

  test('it shows the correct error message for consecutive numbers with hyphens', async () => {
    const rf = buildRenderForm({ ssn: '123-45-6789' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not be consecutive numbers.'
    );
  });

  test('it shows the correct error message for ssn starting with 000', async () => {
    const rf = buildRenderForm({ ssn: '000547762' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not contain all zeros in any section.'
    );
  });

  test('it shows the correct error message for ssn starting with 000 with hypens', async () => {
    const rf = buildRenderForm({ ssn: '000-54-7762' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not contain all zeros in any section.'
    );
  });

  test('it shows the correct error message for ssn with middle 00', async () => {
    const rf = buildRenderForm({ ssn: '321006789' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not contain all zeros in any section.'
    );
  });

  test('it shows the correct error message for ssn with middle 00 with hyphens', async () => {
    const rf = buildRenderForm({ ssn: '321-00-6789' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not contain all zeros in any section.'
    );
  });

  test('it shows the correct error message for ssn ending in 0000', async () => {
    const rf = buildRenderForm({ ssn: '321770000' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not contain all zeros in any section.'
    );
  });

  test('it shows the correct error message for ssn ending in 0000 with hyphens', async () => {
    const rf = buildRenderForm({ ssn: '321-77-0000' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not contain all zeros in any section.'
    );
  });

  test('it shows the correct error message for ssn containing all the same number', async () => {
    const rf = buildRenderForm({ ssn: '111111111' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not contain all the same digits.'
    );
  });

  test('it shows the correct error message for ssn containing all the same number', async () => {
    const rf = buildRenderForm({ ssn: '111-11-1111' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Error: Social Security number can not contain all the same digits.'
    );
  });

  test('it shows the correct error message for an invalid ssn format', async () => {
    const rf = buildRenderForm({ ssn: 'foo' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toEqual(
      'Please enter a valid 9 digit Social Security number (dashes allowed)'
    );
  });

  test('it shows no error message for a valid ssn with hypens', async () => {
    const rf = buildRenderForm({ ssn: '989-55-7788' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toBeNull();
  });

  test('it shows no error message for a valid ssn without hypens', async () => {
    const rf = buildRenderForm({ ssn: '989557788' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toBeNull();
  });

  test('it shows no error message for an empty ssn if field is not required', async () => {
    const rf = buildRenderForm({ ssn: '' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="Social Security Number" />
    );

    const input = getInput(container);

    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input?.getAttribute('error')).toBeNull();
  });

  test('it shows an error message for an empty ssn if field is required', async () => {
    const rf = buildRenderForm({ ssn: '' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" required />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });

  test('it sets the field as touched on blur', async () => {
    const rf = buildRenderForm({ ssn: '' });
    const { container, getFormProps } = rf(
      <SSNField name="ssn" label="ssn" required />
    );
    const input = getInput(container);
    await waitFor(() => getFormProps().setFieldTouched('ssn'));

    expect(input.getAttribute('error')).toEqual('Please provide a response');
  });
});