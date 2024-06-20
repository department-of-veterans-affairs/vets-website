import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 add child - child information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildInformation;

  const formData = {
    'view:selectable686Options': {
      addChild: true,
    },
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
    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should not progress without the required fields', () => {
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

  it('should progress with the required fields filled', () => {
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
    fillData(form, 'input#root_childrenToAdd_0_fullName_first', 'Bill');
    fillData(form, 'input#root_childrenToAdd_0_fullName_last', 'Bob');
    fillData(form, 'input#root_childrenToAdd_0_ssn', '555555551');
    changeDropdown(form, 'select#root_childrenToAdd_0_birthDateMonth', 1);
    changeDropdown(form, 'select#root_childrenToAdd_0_birthDateDay', 1);
    fillData(form, 'input#root_childrenToAdd_0_birthDateYear', '2002');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
