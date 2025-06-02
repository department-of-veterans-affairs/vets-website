import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 veteran former partner names', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistory;

  const formData = {
    'view:selectable686Options': {
      addSpouse: true,
    },
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should submit when a veteran has not been married before', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    selectRadio(form, 'root_veteranWasMarriedBefore', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not submit without required fields when a veteran has been married before', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    selectRadio(form, 'root_veteranWasMarriedBefore', 'Y');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with all required fields when a veteran has been married before', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    selectRadio(form, 'root_veteranWasMarriedBefore', 'Y');
    fillData(
      form,
      'input#root_veteranMarriageHistory_0_fullName_first',
      'jane',
    );
    fillData(form, 'input#root_veteranMarriageHistory_0_fullName_last', 'doe');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
