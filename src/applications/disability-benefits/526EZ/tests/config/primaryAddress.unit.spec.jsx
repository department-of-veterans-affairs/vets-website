import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester, // selectCheckbox
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import {
  STATE_VALUES,
  MILITARY_STATE_VALUES,
} from '../../../all-claims/constants';

describe('Disability benefits 526EZ primary address', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.primaryAddress;

  it('renders primary address form', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            mailingAddress: {},
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // country
    expect(form.find('select').length).to.equal(1);
    // street 1, 2, 3, city, phone, email, fwding address checkbox
    expect(form.find('input').length).to.equal(7);
  });

  it('shows state and zip when country is USA', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            mailingAddress: {
              country: 'USA',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // country, state
    expect(form.find('select').length).to.equal(2);
    // street 1, 2, 3, city, zip, phone, email, fwding address checkbox
    expect(form.find('input').length).to.equal(8);
  });

  it('hides state and zip when country is not USA', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          mailingAddress: {
            country: 'Afghanistan',
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // country
    expect(form.find('select').length).to.equal(1);
    // street 1, 2, 3, city, phone, email, fwding address checkbox
    expect(form.find('input').length).to.equal(7);
  });

  it('restricts state options to military state codes when city is a military city code', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            mailingAddress: {
              country: 'USA',
              city: 'APO',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const stateDropdownOptions = form.find(
      '#root_veteran_mailingAddress_state > option',
    );
    // The `+1` is for the empty option in the dropdown
    expect(stateDropdownOptions.length).to.equal(
      MILITARY_STATE_VALUES.length + 1,
    );
  });

  it('does not restrict state options  when city is not a military city code', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            mailingAddress: {
              country: 'USA',
              city: 'Detroit',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const stateDropdownOptions = form.find(
      '#root_veteran_mailingAddress_state > option',
    );
    // The `+1` is for the empty option in the dropdown
    expect(stateDropdownOptions.length).to.equal(STATE_VALUES.length + 1);
  });

  it('validates that state is military type if city is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            phoneEmailCard: {
              primaryPhone: '1231231231',
              emailAddress: 'a@b.co',
            },
            mailingAddress: {
              country: 'USA',
              addressLine1: '123 Any Street',
              city: 'APO',
              state: 'TX',
              zipCode: '12345',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('validates that city is military type if state is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            phoneEmailCard: {
              primaryPhone: '1231231231',
              emailAddress: 'a@b.co',
            },
            mailingAddress: {
              country: 'USA',
              addressLine1: '123 Any Street',
              city: 'Anytown',
              state: 'AA',
              zipCode: '12345',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('expands forwarding address fields when forwarding address checked', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            'view:hasForwardingAddress': true,
            mailingAddress: {
              country: '',
              addressLine1: '',
            },
            forwardingAddress: {
              country: '',
              addressLine1: '',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // (2 x country), date month, date day, country
    expect(form.find('select').length).to.equal(4);
    // (2 x (street 1, 2, 3, city)), phone, email, fwding address checkbox, date year
    expect(form.find('input').length).to.equal(12);
  });

  it('validates that forwarding state is military type if forwarding city is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            phoneEmailCard: {
              primaryPhone: '1231231231',
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
              effectiveDate: '2019-01-01',
              country: 'USA',
              addressLine1: '123 Any Street',
              city: 'APO',
              state: 'TX',
              zipCode: '12345',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('validates that forwarding city is military type if forwarding state is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            phoneEmailCard: {
              primaryPhone: '1231231231',
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
              effectiveDate: '2019-01-01',
              country: 'USA',
              addressLine1: '123 Any Street',
              city: 'Anytown',
              state: 'AA',
              zipCode: '12345',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('does not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            phoneEmailCard: {
              primaryPhone: '',
              emailAddress: '',
            },
            mailingAddress: {
              country: '',
              addressLine1: '',
              city: '',
            },
            'view:hasForwardingAddress': true,
            forwardingAddress: {
              effectiveDate: '',
              country: '',
              addressLine1: '',
              city: '',
            },
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(9);
    expect(onSubmit.called).to.be.false;
  });

  it('does submit with required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            phoneEmailCard: {
              primaryPhone: '1231231231',
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
              effectiveDate: '2019-01-01',
              country: 'USA',
              addressLine1: '234 Maple St.',
              city: 'Detroit',
              state: 'MI',
              zipCode: '234563453',
            },
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
