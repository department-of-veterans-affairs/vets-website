import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/vre/chapter31/config/form.js';

describe('VRE chapter 31 military history', () => {
  const { schema, uiSchema } = formConfig.chapters.educationAndVREInformation.pages.educationAndVREInformation;
  it('renders education info', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(4);
  });

  it('submits with required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    fillData(form, 'input#root_yearsOfEducation', 5);
    fillData(form, 'input#root_previousPrograms_0_program', 'high school');
    fillData(form, 'input#root_previousPrograms_0_yearStarted', '1955');
    fillData(form, 'input#root_previousPrograms_0_yearLeft', '1957');

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('submits without info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);

    expect(onSubmit.called).to.be.true;
  });
});
