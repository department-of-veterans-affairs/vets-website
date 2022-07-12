/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import { waitFor } from '@testing-library/react';
import { buildRenderForm, changeValue } from '../utils';
import { AddressField } from '../../src';

const renderForm = buildRenderForm({});
const testData = {
  homeAddress: {
    isMilitaryBaseOutside: false,
    streetAddress: '510 The other st',
    streetAddressLine2: 'In front of bank',
    streetAddressLine3: 'Behind shop',
    city: 'Panama',
    state: 'AL',
    country: 'USA',
    postalCode: '93690',
  }
}

const getInputs = (container: HTMLElement) => {
  return ({
    isMilitaryBaseOutsideInput: container.querySelector('#homeAddressIsMilitaryBaseOutside') as HTMLElement,
    countryInput: container.querySelector('#homeAddressCountry') as HTMLElement,
    streetAddressInput: container.querySelector('#homeAddressStreetAddress') as HTMLElement,
    streetAddressLine2Input: container.querySelector('#homeAddressStreetAddressLine2') as HTMLElement,
    streetAddressLine3Input: container.querySelector('#homeAddressStreetAddressLine3') as HTMLElement,
    cityInput: container.querySelector('#homeAddressCity') as HTMLElement,
    stateInput: container.querySelector('#homeAddressState') as HTMLElement,
    postalCodeInput: container.querySelector('#homeAddressPostalCode') as HTMLElement
  })
}

describe('Form Builder - AddressField', () => {
  test('renders', async () => {
    const { container } = renderForm(<AddressField name='homeAddress' label=''/>)
    const {
      isMilitaryBaseOutsideInput,
      countryInput,
      streetAddressInput,
      streetAddressLine2Input,
      streetAddressLine3Input,
      cityInput,
      stateInput,
      postalCodeInput
    } = getInputs(container);

    await waitFor(() => {
      expect(isMilitaryBaseOutsideInput.getAttribute('label')).toEqual('I live on a United States military base outside of the country.');
      expect(countryInput.getAttribute('label')).toEqual('Country');
      expect(streetAddressInput.getAttribute('label')).toEqual('Street address');
      expect(streetAddressLine2Input.getAttribute('label')).toEqual('Street address line 2');
      expect(streetAddressLine3Input.getAttribute('label')).toEqual('Street address line 3');
      expect(cityInput.getAttribute('label')).toEqual('City');
      expect(stateInput.getAttribute('label')).toEqual('State');
      expect(postalCodeInput.getAttribute('label')).toEqual('Postal code');
    })
  });

  test('renders initial value', async () => {
    const rf = buildRenderForm(testData);
    const { container } = rf(<AddressField name='homeAddress' label='' />)
    const {
      isMilitaryBaseOutsideInput,
      countryInput,
      streetAddressInput,
      streetAddressLine2Input,
      streetAddressLine3Input,
      cityInput,
      stateInput,
      postalCodeInput
    } = getInputs(container);

    await waitFor(() => {
      expect(isMilitaryBaseOutsideInput.getAttribute('value')).toEqual('false');
      expect(countryInput.getAttribute('value')).toEqual('USA');
      expect(streetAddressInput.getAttribute('value')).toEqual('510 The other st');
      expect(streetAddressLine2Input.getAttribute('value')).toEqual('In front of bank');
      expect(streetAddressLine3Input.getAttribute('value')).toEqual('Behind shop');
      expect(cityInput.getAttribute('value')).toEqual('Panama');
      expect(stateInput.getAttribute('value')).toEqual('AL');
      expect(postalCodeInput.getAttribute('value')).toEqual('93690');
    });
  });

  test('renders the default "required" validation error message', async () => {
    const { container, getFormProps } = renderForm(<AddressField name='homeAddress' label='' />)
    const {
      streetAddressInput,
      cityInput,
      postalCodeInput
    } = getInputs(container);

    await waitFor(() => {
      getFormProps().setFieldTouched('homeAddress.streetAddress');
      getFormProps().setFieldTouched('homeAddress.city');
      getFormProps().setFieldTouched('homeAddress.postalCode');
    });

    expect(streetAddressInput.getAttribute('error')).toContain('provide a response');
    expect(cityInput.getAttribute('error')).toContain('provide a response');
    expect(postalCodeInput.getAttribute('error')).toContain('provide a response');
  });

  test('when country is united states and military checkbox is false: updates the formik state for street names, city, state, and postal code', async () => {
    const testData = {
      homeAddress: {
        isMilitaryBaseOutside: false,
        streetAddress: '510 The other st',
        streetAddressLine2: 'In front of bank',
        streetAddressLine3: 'Behind shop',
        city: 'Bloomfield',
        state: 'AL',
        country: 'USA',
        postalCode: '93690',
      }
    }
    const rf = buildRenderForm(testData);
    const { container, getFormProps } = rf(<AddressField name='homeAddress' label='' />)
    const {
      streetAddressInput,
      streetAddressLine2Input,
      streetAddressLine3Input,
      cityInput,
      stateInput,
      postalCodeInput
    } = getInputs(container);

    await changeValue(streetAddressInput, '015 The another st', 'input')
    await changeValue(streetAddressLine2Input, 'Behind bank', 'input')
    await changeValue(streetAddressLine3Input, 'In front of shop', 'input')
    await changeValue(cityInput, 'Panama', 'input')
    await changeValue(stateInput, 'IL', 'vaSelect')
    await changeValue(postalCodeInput, '12345', 'input')

    expect(getFormProps().values).toEqual({
      homeAddress: {
        isMilitaryBaseOutside: false,
        streetAddress: '015 The another st',
        streetAddressLine2: 'Behind bank',
        streetAddressLine3: 'In front of shop',
        city: 'Panama',
        state: 'IL',
        country: 'USA',
        postalCode: '12345',
      }
    })
  });

  test('Country is not united states and military checkbox is false: render State as a text field', async () => {
    const testData = {
      homeAddress: {
        isMilitaryBaseOutside: false,
      }
    }
    const rf = buildRenderForm(testData);
    const { container, getFormProps } = rf(<AddressField name='homeAddress' label='' />)
    const {countryInput} = getInputs(container);

    await changeValue(countryInput, 'Brazil', 'vaSelect');

    const {stateInput} = getInputs(container);

    await changeValue(stateInput, 'Bahai', 'input');

    expect(stateInput.getAttribute('label')).toEqual('State/Province/Region');
    expect(getFormProps().values).toEqual({
      homeAddress: {
        isMilitaryBaseOutside: false,
        state: 'Bahai',
        country: 'Brazil',
      }
    })
  });

  test('Country is not united states and military checkbox is true: render new city and state field', async () => {
    const { container, getFormProps } = renderForm(<AddressField name='homeAddress' label='' />)
    const { isMilitaryBaseOutsideInput } = getInputs(container);

    await changeValue(isMilitaryBaseOutsideInput, true);

    const {
      cityInput,
      stateInput
    } = getInputs(container);

    await changeValue(cityInput, 'APO', 'vaSelect');
    await changeValue(stateInput, 'AA', 'vaSelect');

    expect(cityInput.getAttribute('label')).toEqual('APO/FPO/DPO');
    expect(stateInput.getAttribute('label')).toEqual('State');
    expect(getFormProps().values).toEqual({
      homeAddress: {
        isMilitaryBaseOutside: true,
        country: 'USA',
        city: 'APO',
        state: 'AA',
      }
    })
  });
});