import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectCheckbox,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../feedback-tool/config/form';

describe('feedback tool benefits info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.benefitsInformation.pages.benefitsInformation;

  test('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).toBe(11);
    form.unmount();
  });

  test('should not submit without required information', () => {
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
    expect(form.find('.usa-input-error').length).toBe(1);
    expect(onSubmit.called).toBe(false);
    form.unmount();
  });

  test('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    selectCheckbox(form, 'root_educationDetails_programs_chapter33', true);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });
});
