import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../../feedback-tool/config/form';

describe('feedback tool applicant info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.serviceInformation;

  it('should render', () => {
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

    expect(form.find('input').length).to.equal(2);
    expect(form.find('select').length).to.equal(5);
  });

  it('should submit without any information', () => {
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
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
