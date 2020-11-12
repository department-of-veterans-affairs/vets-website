import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { changeDropdown } from '../helpers';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranInformation.pages.veteranInformation;

describe('Chapter 31 veteran information', () => {
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('should submit with the required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    fillData(form, 'input#root_veteranInformation_fullName_first', 'John');
    fillData(form, 'input#root_veteranInformation_fullName_last', 'Doe');
    fillData(form, 'input#root_veteranInformation_ssn', '123121234');
    changeDropdown(form, '#root_veteranInformation_dobMonth', 1);
    changeDropdown(form, '#root_veteranInformation_dobDay', 1);
    fillData(form, 'input#root_veteranInformation_dobYear', 1991);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
