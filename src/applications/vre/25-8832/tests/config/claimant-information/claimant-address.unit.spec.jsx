import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils';
import { changeDropdown } from 'platform/testing/unit/helpers';
import formConfig from '../../../config/form';

describe('Chapter 36 Claimant Address', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInformation.pages.claimantAddress;

  const formData = {
    status: 'isSpouse',
    claimantAddress: {
      country: 'USA',
    },
  };
  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(container.querySelectorAll('input').length).to.equal(9);
  });

  it('should not submit without required fields', async () => {
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(7);
    });

    expect(onSubmit.called).to.be.false;
  });

  it('should require a confirmation of the email address', async () => {
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    // Fill form fields using RTL queries and user events
    const countrySelect = container.querySelector(
      'select#root_claimantAddress_country',
    );
    fireEvent.change(countrySelect, { target: { value: 'USA' } });

    const streetInput = container.querySelector(
      'input#root_claimantAddress_street',
    );
    fireEvent.change(streetInput, { target: { value: 'Sunny Road' } });

    const cityInput = container.querySelector(
      'input#root_claimantAddress_city',
    );
    fireEvent.change(cityInput, { target: { value: 'Someplace' } });

    const stateSelect = container.querySelector(
      'select#root_claimantAddress_state',
    );
    fireEvent.change(stateSelect, { target: { value: 'DC' } });

    const postalCodeInput = container.querySelector(
      'input#root_claimantAddress_postalCode',
    );
    fireEvent.change(postalCodeInput, { target: { value: '12345' } });

    const phoneInput = container.querySelector(
      'input#root_claimantPhoneNumber',
    );
    fireEvent.change(phoneInput, { target: { value: '1234561234' } });

    const emailInput = container.querySelector(
      'input#root_claimantEmailAddress',
    );
    fireEvent.change(emailInput, { target: { value: 'someEmail@email.com' } });

    // Incorrect confirmation email address should fail
    const confirmEmailInput = container.querySelector(
      'input#root_claimantConfirmEmailAddress',
    );
    fireEvent.change(confirmEmailInput, {
      target: { value: 'derp@email.com' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    // Wait for validation to complete
    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    changeDropdown(form, 'select#root_claimantAddress_country', 'USA');
    fillData(form, 'input#root_claimantAddress_street', 'Sunny Road');
    fillData(form, 'input#root_claimantAddress_city', 'Someplace');
    changeDropdown(form, 'select#root_claimantAddress_state', 'DC');
    fillData(form, 'input#root_claimantAddress_postalCode', '12345');
    fillData(form, 'input#root_claimantPhoneNumber', '1234561234');
    fillData(form, 'input#root_claimantEmailAddress', 'someEmail@email.com');
    fillData(
      form,
      'input#root_claimantConfirmEmailAddress',
      'someEmail@email.com',
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
