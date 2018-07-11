import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData, selectRadio } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../0993/config/form';

describe('0993 applicant information', () => {
  const { schema, uiSchema } = formConfig.chapters.applicantInformation.pages.applicantInformation;

  it('should render unverified view', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );
    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(1);
  });

  it('should render verified view', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{ verified: true }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );
    expect(form.find('input').length).to.equal(0);
    expect(form.find('select').length).to.equal(0);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with no errors with all required fields filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          veteranFullName: {
            first: 'test',
            last: 'test'
          },
          veteranSocialSecurityNumber: '987987987'
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should expand VA file number question if no SSN is available', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        uiSchema={uiSchema}/>
    );
    selectRadio(form, 'root_view:relationshipToVet', '2');

    expect(form.find('.schemaform-radio-indent').length).to.equal(1);
  });

  // it('should expand child description if relationship is child', () => {
  //   const form = mount(
  //     <DefinitionTester
  //       schema={schema}
  //       definitions={formConfig.defaultDefinitions}
  //       data={{}}
  //       uiSchema={uiSchema}/>
  //   );
  //   selectRadio(form, 'root_view:relationshipToVet', '3');

  //   expect(form.find('.schemaform-radio-indent').length).to.equal(1);
  // });

  // it('should expand other description if relationship is other', () => {
  //   const form = mount(
  //     <DefinitionTester
  //       schema={schema}
  //       definitions={formConfig.defaultDefinitions}
  //       data={{}}
  //       uiSchema={uiSchema}/>
  //   );
  //   selectRadio(form, 'root_view:relationshipToVet', '4');

  //   expect(form.find('.schemaform-radio-indent').length).to.equal(1);
  // });
});
