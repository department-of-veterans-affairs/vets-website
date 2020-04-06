import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectCheckbox,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../feedback-tool/config/form';

describe('feedback tool issue info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.issueInformation.pages.issueInformation;

  test('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).toBe(12);
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
    expect(form.find('.usa-input-error').length).toBe(3);
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

    selectCheckbox(form, 'root_issue_accreditation', true);
    fillData(form, 'textarea#root_issueDescription', 'test');
    fillData(form, 'textarea#root_issueResolution', 'test');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });
});
