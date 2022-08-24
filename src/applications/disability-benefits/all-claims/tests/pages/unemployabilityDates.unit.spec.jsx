import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillDate,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

import { ERR_MSG_CSS_CLASS } from '../../constants';

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
    expect(form.find('select').length).to.equal(6);
    form.unmount();
  });

  it('should fail to submit when no beginning date is filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployabilityUploadChoice': 'answerQuestions',
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit when beginning date is filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployabilityUploadChoice': 'answerQuestions',
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fillDate(
      form,
      'root_unemployability_disabilityAffectedEmploymentFullTimeDate',
      '2017-03-04',
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
