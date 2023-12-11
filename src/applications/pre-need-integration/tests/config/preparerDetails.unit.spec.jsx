import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need preparer Details info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.preparerInformation.pages.preparerDetails;

  it('should render name input field', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    uiSchema.application.applicant.name.first['ui:required'] = () => true;
    uiSchema.application.applicant.name.last['ui:required'] = () => true;

    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with required fields filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    uiSchema.application.applicant.name.first['ui:required'] = () => true;
    uiSchema.application.applicant.name.last['ui:required'] = () => true;

    fillData(
      form,
      'input[name="root_application_applicant_name_first"]',
      'Jane',
    );
    fillData(
      form,
      'input[name="root_application_applicant_name_last"]',
      'Smith',
    );
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
