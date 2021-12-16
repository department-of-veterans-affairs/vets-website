import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { changeDropdown } from 'platform/testing/unit/helpers';

import formConfig from '../../../config/form';

describe('Chapter 36 Claimant Information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInformation.pages.claimantInformation;

  const formData = {
    status: 'isSpouse',
  };
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('should not submit without required fields', () => {
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
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
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

    fillData(form, 'input#root_fullName_first', 'Johnny');
    fillData(form, 'input#root_fullName_last', 'Appleseed');
    fillData(form, 'input#root_ssn', '370947141');
    changeDropdown(form, '#root_dateOfBirthMonth', 1);
    changeDropdown(form, '#root_dateOfBirthDay', 1);
    fillData(form, 'input#root_dateOfBirthYear', '1981');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
