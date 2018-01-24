import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, selectRadio, fillData } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/vre/chapter36/config/form.js';

describe('VRE chapter 36 applicant information', () => {
  const { schema, uiSchema } = formConfig.chapters.applicantInformation.pages.applicantInformation;
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(9);
  });

  it('should render applicant fields', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    fillData(form, 'input#root_socialSecurityNumber', '424242424');
    selectRadio(form, 'root_gender', 'M');

    selectRadio(form, 'root_seekingRestorativeTraining', 'Y');
    selectRadio(form, 'root_seekingVocationalTraining', 'Y');
    selectRadio(form, 'root_receivedPamphlet', 'N');

    expect(form.find('input#root_socialSecurityNumber').first().prop('value')).to.equal('424242424');
    expect(form.find('#root_seekingRestorativeTrainingYes').first().prop('checked')).to.equal(true);
    expect(form.find('#root_seekingVocationalTrainingYes').first().prop('checked')).to.equal(true);
    expect(form.find('#root_receivedPamphletNo').first().prop('checked')).to.equal(true);
  });

  /* it('should not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
  */

  it.only('should not submit without required applicant info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    // selectRadio(form, 'root_view:isVeteran', 'N');
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with required info filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    selectRadio(form, 'root_view:isVeteran', 'N');
    fillData(form, 'input#root_applicantFullName_first', 'test');
    fillData(form, 'input#root_applicantFullName_last', 'test2');
    selectRadio(form, 'root_applicantRelationshipToVeteran', 'Spouse');
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
