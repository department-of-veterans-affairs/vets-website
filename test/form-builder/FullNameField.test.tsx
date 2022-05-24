/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import { waitFor } from '@testing-library/react';
import { buildRenderForm, changeValue } from '../utils';
import { FullNameField } from '../../src';

const renderForm = buildRenderForm({});
const veteranTestData = {
  veteranFullName: {
    first: 'Mark',
    middle: 'W',
    last: 'Webb',
    suffix: 'Sr',
  },
};

const getInputs = (container: HTMLElement) => {
  return {
    firstNameInput: container.querySelector(
      '#veteranFullNameFirstName'
    ) as HTMLElement,
    middleNameInput: container.querySelector(
      '#veteranFullNameMiddleName'
    ) as HTMLElement,
    lastNameInput: container.querySelector(
      '#veteranFullNameLastName'
    ) as HTMLElement,
    suffixSelect: container.querySelector(
      '#veteranFullNameSuffix'
    ) as HTMLElement,
  };
};

describe('Form Builder - FullNameField', () => {
  test('renders', () => {
    const { container } = renderForm(
      <FullNameField name="veteranFullName" label="" />
    );
    const { firstNameInput, middleNameInput, lastNameInput, suffixSelect } =
      getInputs(container);

    expect(firstNameInput.getAttribute('label')).toEqual('Your first name');
    expect(middleNameInput.getAttribute('label')).toEqual('Your middle name');
    expect(lastNameInput.getAttribute('label')).toEqual('Your last name');
    expect(suffixSelect.getAttribute('label')).toEqual('Suffix');
  });

  test('renders initial value', () => {
    const rf = buildRenderForm(veteranTestData);
    const { container } = rf(<FullNameField name="veteranFullName" label="" />);
    const { firstNameInput, middleNameInput, lastNameInput, suffixSelect } =
      getInputs(container);

    expect(firstNameInput.getAttribute('value')).toEqual('Mark');
    expect(middleNameInput.getAttribute('value')).toEqual('W');
    expect(lastNameInput.getAttribute('value')).toEqual('Webb');
    expect(suffixSelect.getAttribute('value')).toEqual('Sr');
  });

  test('renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(
      <FullNameField name="veteranFullName" label="" />
    );
    const { firstNameInput, lastNameInput } = getInputs(container);

    await waitFor(() => {
      getFormProps().setFieldTouched('veteranFullName.first');
      getFormProps().setFieldTouched('veteranFullName.last');
    });

    expect(firstNameInput.getAttribute('error')).toContain(
      'provide a response'
    );
    expect(lastNameInput.getAttribute('error')).toContain('provide a response');
  });

  test.skip('updates the formik state', async () => {
    const rf = buildRenderForm(veteranTestData);
    const { container, getFormProps } = rf(
      <FullNameField name="veteranFullName" label="" />
    );
    const { firstNameInput, middleNameInput, lastNameInput, suffixSelect } =
      getInputs(container);

    await changeValue(firstNameInput, 'Tony');
    await changeValue(middleNameInput, 'H');
    await changeValue(lastNameInput, 'Stark');
    await changeValue(suffixSelect, 'Jr', 'vaSelect');

    expect(getFormProps().values).toEqual({
      veteranFullName: {
        first: 'Tony',
        middle: 'H',
        last: 'Stark',
        suffix: 'Jr',
      },
    });
  });
});
