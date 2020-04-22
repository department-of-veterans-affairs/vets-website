import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import contactInfo from '../../pages/contactInformation';

describe('Higher-Level Review 0996 contact information', () => {
  it('should render contact information form', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          mailingAddress: {},
          phoneEmailCard: {},
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );

    // country
    expect(form.find('select').length).to.equal(1);
    // phone, email, street, street2, street3, city, state, postalCode
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('does not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          phoneEmailCard: {
            phone: '',
            emailAddress: '',
          },
          mailingAddress: {
            country: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
          },
          // 'view:hasForwardingAddress': true,
          // forwardingAddress: {
          //   effectiveDates: {
          //     from: '',
          //   },
          //   country: '',
          //   street: '',
          //   city: '',
          // },
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={contactInfo.uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    // phone, email, street, country, city
    // state & postalCode are required if once the country is set
    expect(form.find('.usa-input-error-message').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('does submit with required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          phoneEmailCard: {
            phone: '1231231231',
            emailAddress: 'a@b.co',
          },
          mailingAddress: {
            country: 'USA',
            street: '123 Any Street',
            city: 'Anytown',
            state: 'MI',
            postalCode: '12345',
          },
          // 'view:hasForwardingAddress': true,
          // forwardingAddress: {
          //   effectiveDates: {
          //     from: NEXT_YEAR,
          //   },
          //   country: 'USA',
          //   street: '234 Maple St.',
          //   city: 'Detroit',
          //   state: 'MI',
          //   postalCode: '234563453',
          // },
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={contactInfo.uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
