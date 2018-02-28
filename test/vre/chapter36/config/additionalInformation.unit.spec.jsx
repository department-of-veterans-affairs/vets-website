import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, selectCheckbox } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/vre/chapter36/config/form.js';

describe('VRE chapter 36 applicant additional information', () => {
  const { schema, uiSchema } = formConfig.chapters.additionalInformation.pages.additionalInformation;
  it('renders previous benefits applications question', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:isVeteran': true
        }}
        formData={{}}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(3);
  });

  it('renders previous benefits veteran fields if has applied', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:isVeteran': false
        }}
        formData={{}}
        uiSchema={uiSchema}/>
    );

    selectCheckbox(form, 'root_previousBenefitApplications_dic', true);

    expect(form.find('input').length).to.equal(7);
    expect(form.find('select').length).to.equal(1);
  });
  // it render veteran view
  // it renders spouse view
  // it renders surviving spouse view
  it('submits without info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:isVeteran': true
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
