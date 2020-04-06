import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 veteran information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranInformation;

  test('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).toBe(5);
    form.unmount();
  });

  test('should expand VA file number if noSSN is checked', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(form, 'root_view:noSSN', true);
    expect(form.find('input').length).toBe(6);
    form.unmount();
  });

  test('should not submit empty form', () => {
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
    expect(form.find('.usa-input-error').length).toBe(3);
    expect(onSubmit.called).toBe(false);
    form.unmount();
  });

  test('should submit completed form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_veteranFullName_first', 'test');
    fillData(form, 'input#root_veteranFullName_last', 'test');
    fillData(form, 'input#root_veteranSocialSecurityNumber', '222-23-2424');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });
});
