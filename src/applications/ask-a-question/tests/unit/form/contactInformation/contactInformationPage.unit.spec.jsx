import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import fullName from 'platform/forms-system/src/js/definitions/fullName';
import ContactInformationPage from '../../../../form/contactInformation/contactInformationPage';
import formConfig from '../../../../form/form';

import { uiSchema as addressUI } from '../../../../form/contactInformation/address/address';
import { preferredContactMethodTitle } from '../../../../constants/labels';

const address = addressUI();

describe('Contact Information Page', () => {
  const radioButtonClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

  it('should require full name', () => {
    const { getByText } = render(
      <DefinitionTester
        schema={ContactInformationPage.schema}
        uiSchema={ContactInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    const firstName = getByText(fullName.first['ui:title'], {
      exact: false,
    });
    const lastName = getByText(fullName.last['ui:title'], {
      exact: false,
    });

    expect(firstName).to.contain.text('Required');
    expect(lastName).to.contain.text('Required');
  });

  it('should require preferred contact method', () => {
    const { getByText } = render(
      <DefinitionTester
        schema={ContactInformationPage.schema}
        uiSchema={ContactInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    const preferredContactMethod = getByText(preferredContactMethodTitle, {
      exact: false,
    });

    expect(preferredContactMethod).to.contain.text('Required');
  });

  it('should require country', () => {
    const { getByLabelText } = render(
      <DefinitionTester
        schema={ContactInformationPage.schema}
        uiSchema={ContactInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    const country = getByLabelText(address.country['ui:title'], {
      exact: false,
    });

    expect(country).to.have.property('required', true);
  });

  it('should require email when preferred contact method is email', async () => {
    const { getAllByText, getByText } = render(
      <DefinitionTester
        schema={ContactInformationPage.schema}
        uiSchema={ContactInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    fireEvent.click(getByText('Phone'), radioButtonClick);
    fireEvent.click(getByText('Email'), radioButtonClick);

    const emails = getAllByText('Email address', { exact: false });

    expect(emails[0]).to.contain.text('Required');
  });

  it('should require daytime phone when preferred contact method is phone', async () => {
    const { getByText, getByLabelText } = render(
      <DefinitionTester
        schema={ContactInformationPage.schema}
        uiSchema={ContactInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    fireEvent.click(getByText('Phone'), radioButtonClick);

    const daytimePhone = getByText('Daytime phone', { exact: false });
    const country = getByLabelText(address.country['ui:title'], {
      exact: false,
    });

    expect(country).to.have.property('required', true);
    expect(daytimePhone).to.contain.text('Required');
  });

  it('should require street, city, state, and zipCode when preferred contact method is US mail and United States is selected for country', async () => {
    const { getByText, queryAllByText, getByLabelText } = render(
      <DefinitionTester
        schema={ContactInformationPage.schema}
        uiSchema={ContactInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    fireEvent.click(getByText('US Mail'), radioButtonClick);

    const country = getByLabelText(address.country['ui:title'], {
      exact: false,
    });
    const street = getByText('Street address', { exact: true });
    const city = getByText('City', { exact: false });
    const zipCode = getByText('Zip code', { exact: false });
    const states = queryAllByText('State', { exact: false });

    expect(states[1]).to.contain.text('Required');
    expect(country).to.have.property('required', true);
    expect(street).to.contain.text('Required');
    expect(city).to.contain.text('Required');
    expect(zipCode).to.contain.text('Required');
  });

  it('should not require state if Aruba is selected from country', async () => {
    const { getByText, queryAllByText, getByLabelText } = render(
      <DefinitionTester
        schema={ContactInformationPage.schema}
        uiSchema={ContactInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    fireEvent.click(getByText('US Mail'), radioButtonClick);
    const states = queryAllByText('State', { exact: false });

    const country = getByLabelText(address.country['ui:title'], {
      exact: false,
    });

    fireEvent.change(country, { target: { value: 'Aruba' } });

    expect(country).to.have.property('required', true);
    expect(states[1]).to.not.contain.text('Required');
  });
});
