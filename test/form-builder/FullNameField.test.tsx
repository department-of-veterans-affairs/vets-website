/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import { waitFor } from '@testing-library/react';
import { buildRenderForm, changeValue } from '../utils';
import { FullNameField } from '../../src';

const renderForm = buildRenderForm({});
const testData = {
  fullName: {
    firstName: 'Mark',
    middleName: 'W',
    lastName: 'Webb',
    suffix: 'Sr'
  }
}

const getInputs = (container: HTMLElement) => {
  return ({
    firstNameInput: container.querySelector('#firstName') as HTMLElement,
    middleNameInput: container.querySelector('#middleName') as HTMLElement,
    lastNameInput: container.querySelector('#lastName') as HTMLElement,
    suffixSelect: container.querySelector('#suffix') as HTMLElement
  })
} 

describe('Form Builder - FullNameField', () => {
  test('renders', () => {
    const { container } = renderForm(<FullNameField name={''} label={''} />)
    const { firstNameInput, middleNameInput, lastNameInput, suffixSelect } = getInputs(container);

    expect(firstNameInput.getAttribute('label')).toEqual('Your first Name');
    expect(middleNameInput.getAttribute('label')).toEqual('Your middle Name');
    expect(lastNameInput.getAttribute('label')).toEqual('Your last Name');
    expect(suffixSelect.getAttribute('label')).toEqual('Suffix');
  });

  test('renders initial value', () => {
    const rf = buildRenderForm(testData);
    const { container } = rf(<FullNameField name='' label='' />)
    const { firstNameInput, middleNameInput, lastNameInput, suffixSelect } = getInputs(container);

    expect(firstNameInput.getAttribute('value')).toEqual('Mark')
    expect(middleNameInput.getAttribute('value')).toEqual('W')
    expect(lastNameInput.getAttribute('value')).toEqual('Webb')
    expect(suffixSelect.getAttribute('value')).toEqual('Sr')
  });

  test('renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(<FullNameField name='' label='' />);
    const { firstNameInput, lastNameInput } = getInputs(container);

    await waitFor(() => {
      getFormProps().setFieldTouched('fullName.firstName');
      getFormProps().setFieldTouched('fullName.lastName');
    });

    expect(firstNameInput.getAttribute('error')).toContain('provide a response')
    expect(lastNameInput.getAttribute('error')).toContain('provide a response')
  });

  test('updates the formik state', async () => {
    const veteranTestData = {
      veteranFullName: {
        firstName: 'Mark',
        middleName: 'W',
        lastName: 'Webb',
        suffix: 'Sr'
      }
    }
    const rf = buildRenderForm(veteranTestData);
    const { container, getFormProps } = rf(<FullNameField name='' label='' fieldName='veteranFullName'/>);
    const { firstNameInput, middleNameInput, lastNameInput, suffixSelect } = getInputs(container);

    await changeValue(firstNameInput, 'Tony')
    await changeValue(middleNameInput, 'H')
    await changeValue(lastNameInput, 'Stark')
    await changeValue(suffixSelect, 'Jr', 'vaSelect')

    expect(getFormProps().values).toEqual({
      veteranFullName: {
        firstName: 'Tony',
        middleName: 'H',
        lastName: 'Stark',
        suffix: 'Jr'
      }
    })
  });
});