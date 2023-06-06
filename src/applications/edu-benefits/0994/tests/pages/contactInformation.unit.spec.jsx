import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

import { ERR_MSG_CSS_CLASS } from '../../constants';

const initialData = {
  'view:phoneAndEmail': {
    homePhone: '1234567890',
    mobilePhone: '1234567890',
    emailAddress: 'test@test.com',
  },
  mailingAddress: {
    street: '123 Main St',
    street2: 'Apt 321',
    city: 'Abcd',
    country: 'USA',
    state: 'SC',
    postalCode: '12345',
  },
};

describe('Contact Information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.contactInformation;

  it('renders the contact information with prefill data', () => {
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
    const { homePhone, mobilePhone, emailAddress } = initialData[
      'view:phoneAndEmail'
    ];
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

    fillData(
      form,
      'input[name*="root_view:phoneAndEmail_homePhone"]',
      homePhone,
    );
    fillData(
      form,
      'input[name*="root_view:phoneAndEmail_mobilePhone"]',
      mobilePhone,
    );
    fillData(
      form,
      'input[name*="root_view:phoneAndEmail_emailAddress"]',
      emailAddress,
    );

    fillData(form, 'select#root_mailingAddress_country', country);
    fillData(form, 'input#root_mailingAddress_street', street);
    fillData(form, 'input#root_mailingAddress_street2', street2);
    fillData(form, 'input#root_mailingAddress_city', city);
    fillData(form, 'select#root_mailingAddress_state', state);
    fillData(form, 'input#root_mailingAddress_postalCode', postalCode);

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not allow submission without required fields', () => {
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
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
