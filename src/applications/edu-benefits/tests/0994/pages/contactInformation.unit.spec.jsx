import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../0994/config/form.js';

import { ERR_MSG_CSS_CLASS } from '../../../0994/constants';

const initialData = {
  phoneAndEmail: {
    dayTimePhone: '1234567890',
    nightTimePhone: '1234567890',
    emailAddress: 'test@test.com',
  },
  mailingAddress: {
    street: '123 Main St',
    street2: 'Apt 321',
    city: 'Abcd',
    country: 'USA',
    state: 'South Carolina',
    postalCode: '12345',
  },
};

describe('Contact Information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.contactInformation;

  it('renders the contact information', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(0);

    form.unmount();
  });

  it('successfully submits ', () => {
    const {
      dayTimePhone,
      nightTimePhone,
      emailAddress,
    } = initialData.phoneAndEmail;
    const {
      street,
      street2,
      city,
      country,
      state,
      postalCode,
    } = initialData.mailingAddress;

    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_phoneAndEmail_dayTimePhone', dayTimePhone);
    fillData(form, 'input#root_phoneAndEmail_nightTimePhone', nightTimePhone);
    fillData(form, 'input#root_phoneAndEmail_emailAddress', emailAddress);

    fillData(form, 'select#root_mailingAddress_country', country);
    fillData(form, 'input#root_mailingAddress_street', street);
    fillData(form, 'input#root_mailingAddress_street2', street2);
    fillData(form, 'input#root_mailingAddress_city', city);
    fillData(form, 'input#root_mailingAddress_state', state);
    fillData(form, 'input#root_mailingAddress_postalCode', postalCode);

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not allow submission without bank info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(6);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
