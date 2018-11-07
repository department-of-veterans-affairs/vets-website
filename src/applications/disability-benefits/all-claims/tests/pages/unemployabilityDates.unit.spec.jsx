import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Unemployability affective Dates', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.unemployabilityDates;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployabilityStatus': true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(3);
  });

  it('should fail to submit when no beginning date is filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployabilityStatus': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit when beginning date is filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemploymentStatus': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fillData(form, '#root_disabilityAffectedEmploymentFullTimeDateMonth', '3');
    fillData(
      form,
      '#root_disabilityAffectedEmploymentFullTimeDateYear',
      '2017',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
