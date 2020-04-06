import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../../feedback-tool/config/form';

describe('feedback tool applicant info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.serviceInformation;

  test('should render', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          onBehalfOf: 'Myself',
          serviceAffiliation: 'Veteran',
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).toBe(2);
    expect(form.find('select').length).toBe(5);
    form.unmount();
  });

  test('should submit without any information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          onBehalfOf: 'Myself',
          serviceAffiliation: 'Veteran',
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });
});
