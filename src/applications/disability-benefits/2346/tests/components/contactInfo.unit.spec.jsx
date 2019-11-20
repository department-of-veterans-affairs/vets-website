import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import contactInfo from '../../pages/contactInformation';

import {
  STATE_VALUES,
  MILITARY_STATE_VALUES,
} from '../../../all-claims/constants';

const NEXT_YEAR = moment()
  .add(1, 'year')
  .format('YYYY-MM-DD');

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
    // street 1, 2, 3, city, phone, email, fwding address checkbox
    expect(form.find('input').length).to.equal(7);
    form.unmount();
  });

  it('shows state and zip when country is USA', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          mailingAddress: {
            country: 'USA',
          },
          phoneEmailCard: {},
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );
    // country, state
    expect(form.find('select').length).to.equal(2);
    // street 1, 2, 3, city, zip, phone, email, fwding address checkbox
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('hides state and zip when country is not USA', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          mailingAddress: {
            country: 'Afghanistan',
          },
          phoneEmailCard: {},
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );

    // country
    expect(form.find('select').length).to.equal(1);
    // street 1, 2, 3, city, phone, email, fwding address checkbox
    expect(form.find('input').length).to.equal(7);
    form.unmount();
  });

  it('restricts state options to military state codes when city is a military city code', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          mailingAddress: {
            country: 'USA',
            city: 'APO',
          },
          phoneEmailCard: {},
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );

    const stateDropdownOptions = form.find(
      '#root_mailingAddress_state > option',
    );
    // The `+1` is for the empty option in the dropdown
    expect(stateDropdownOptions.length).to.equal(
      MILITARY_STATE_VALUES.length + 1,
    );
    form.unmount();
  });

  it('does not restrict state options  when city is not a military city code', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          mailingAddress: {
            country: 'USA',
            city: 'Detroit',
          },
          phoneEmailCard: {},
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );

    const stateDropdownOptions = form.find(
      '#root_mailingAddress_state > option',
    );
    // The `+1` is for the empty option in the dropdown
    expect(stateDropdownOptions.length).to.equal(STATE_VALUES.length + 1);
    form.unmount();
  });

  it('validates that state is military type if city is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          phoneEmailCard: {
            phone: '1231231231', // primaryPhone
            emailAddress: 'a@b.co',
          },
          mailingAddress: {
            country: 'USA',
            addressLine1: '123 Any Street',
            city: 'APO',
            state: 'TX',
            zipCode: '12345',
          },
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('validates that city is military type if state is military type', () => {
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
            addressLine1: '123 Any Street',
            city: 'Anytown',
            state: 'AA',
            zipCode: '12345',
          },
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('expands forwarding address fields when forwarding address checked', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={contactInfo.schema}
        data={{
          'view:hasForwardingAddress': true,
          mailingAddress: {
            country: '',
            addressLine1: '',
          },
          forwardingAddress: {
            country: '',
            addressLine1: '',
          },
          phoneEmailCard: {},
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );

    // (2 x country), 2x date month, 2x date day, country
    expect(form.find('select').length).to.equal(6);
    // (2 x (street 1, 2, 3, city)), phone, email, fwding address checkbox, 2x date year
    expect(form.find('input').length).to.equal(13);
    form.unmount();
  });

  it('validates that forwarding state is military type if forwarding city is military type', () => {
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
            addressLine1: '123 Any Street',
            city: 'Anytown',
            state: 'MI',
            zipCode: '12345',
          },
          'view:hasForwardingAddress': true,
          forwardingAddress: {
            effectiveDates: {
              from: NEXT_YEAR,
            },
            country: 'USA',
            addressLine1: '123 Any Street',
            city: 'APO',
            state: 'TX',
            zipCode: '12345',
          },
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('validates that forwarding city is military type if forwarding state is military type', () => {
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
            addressLine1: '123 Any Street',
            city: 'Anytown',
            state: 'MI',
            zipCode: '12345',
          },
          'view:hasForwardingAddress': true,
          forwardingAddress: {
            effectiveDates: {
              from: NEXT_YEAR,
            },
            country: 'USA',
            addressLine1: '123 Any Street',
            city: 'Anytown',
            state: 'AA',
            zipCode: '12345',
          },
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('validates that effective date is in the future', () => {
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
            addressLine1: '123 Any Street',
            city: 'Anytown',
            state: 'MI',
            zipCode: '12345',
          },
          'view:hasForwardingAddress': true,
          forwardingAddress: {
            effectiveDates: {
              from: '2018-10-12',
            },
            country: 'USA',
            addressLine1: '123 Any Street',
            city: 'Detroit',
            state: 'MI',
            zipCode: '12345',
          },
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('validates that effective end date is after start date', () => {
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
            addressLine1: '123 Any Street',
            city: 'Anytown',
            state: 'MI',
            zipCode: '12345',
          },
          'view:hasForwardingAddress': true,
          forwardingAddress: {
            effectiveDates: {
              from: '2099-10-12',
              to: '2099-10-12',
            },
            country: 'USA',
            addressLine1: '123 Any Street',
            city: 'Detroit',
            state: 'MI',
            zipCode: '12345',
          },
        }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
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
            addressLine1: '',
            city: '',
          },
          'view:hasForwardingAddress': true,
          forwardingAddress: {
            effectiveDates: {
              from: '',
            },
            country: '',
            addressLine1: '',
            city: '',
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={contactInfo.uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(9);
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
            addressLine1: '123 Any Street',
            city: 'Anytown',
            state: 'MI',
            zipCode: '12345',
          },
          'view:hasForwardingAddress': true,
          forwardingAddress: {
            effectiveDates: {
              from: NEXT_YEAR,
            },
            country: 'USA',
            addressLine1: '234 Maple St.',
            city: 'Detroit',
            state: 'MI',
            zipCode: '234563453',
          },
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
