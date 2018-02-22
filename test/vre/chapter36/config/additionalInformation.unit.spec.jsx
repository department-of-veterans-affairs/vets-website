import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, selectCheckbox } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/vre/chapter36/config/form.js';

describe('VRE chapter 36 applicant additional information', () => {
  const { schema: veteranSchema, uiSchema: veteranUiSchema } = formConfig.chapters.additionalInformation.pages.additionalInformation;
  it('renders previous benefits applications question', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={veteranSchema}
        data={{}}
        formData={{}}
        uiSchema={veteranUiSchema}/>
    );

    expect(form.find('input').length).to.equal(4);
  });

  const { schema: spouseSchema, uiSchema: spouseUiSchema } = formConfig.chapters.additionalInformation.pages.additionalInformation;
  it('renders previous benefits veteran fields if has applied', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={spouseSchema}
        data={{}}
        formData={{}}
        uiSchema={spouseUiSchema}/>
    );

    selectCheckbox(form, 'root_previousBenefitApplications_dic', true);

    expect(form.find('input').length).to.equal(10);
    expect(form.find('select').length).to.equal(1);
  });

  it('does not submit if "None" and other benefits selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={spouseSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={spouseUiSchema}/>
    );

    selectCheckbox(form, 'root_previousBenefitApplications_dic', true);
    selectCheckbox(form, 'root_previousBenefitApplications_none', true);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);

    expect(onSubmit.called).to.be.false;
  });

  it('submits without info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={spouseSchema}
        data={{
          'view:isVeteran': false
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={spouseUiSchema}/>
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
