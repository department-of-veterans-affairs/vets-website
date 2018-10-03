import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectRadio,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 applicant information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(7);
    expect(form.find('select').length).to.equal(1);
  });

  it('should not submit empty form', () => {
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
    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit form if applicant is veteran', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_claimantFullName_first', 'test');
    fillData(form, 'input#root_claimantFullName_last', 'test');
    selectRadio(form, 'root_view:relationshipToVet', '1');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should expand spouse description if relationship is spouse', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_view:relationshipToVet', '2');

    expect(form.find('.schemaform-radio-indent').length).to.equal(1);
  });

  it('should expand child description if relationship is child', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_view:relationshipToVet', '3');

    expect(form.find('.schemaform-radio-indent').length).to.equal(1);
  });

  it('should expand other description if relationship is other', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_view:relationshipToVet', '4');

    expect(form.find('.schemaform-radio-indent').length).to.equal(1);
  });
});
