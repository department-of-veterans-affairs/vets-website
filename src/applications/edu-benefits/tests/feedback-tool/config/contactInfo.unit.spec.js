import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../feedback-tool/config/form';

describe('feedback tool applicant info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.contactInformation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(7);
  });

  it('should not submit without required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(6);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_address_street', 'test');
    fillData(form, 'input#root_address_street2', 'test');
    fillData(form, 'input#root_address_city', 'test');
    const state = form.find('select#root_address_state');
    state.simulate('change', {
      target: { value: 'CA' }, // TODO: update with new schema
    });
    const country = form.find('select#root_address_country');
    country.simulate('change', {
      target: { value: 'US' },
    });
    fillData(form, 'input#root_address_postalCode', '12312');
    fillData(form, 'input#root_applicantEmail', 'test@test.com');
    fillData(
      form,
      'input[name="root_view:applicantEmailConfirmation"]',
      'test@test.com',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
