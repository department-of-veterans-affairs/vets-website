import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 applicant information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.claimantInformation;
  const notVeteranCondition = () => ({
    'view:relationshipToVet': '2',
  });
  it('should render if relationshipToVet is not veteran', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={notVeteranCondition()}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(2);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={notVeteranCondition()}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit form with all fields filled out properly', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={notVeteranCondition()}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_claimantSocialSecurityNumber', '222-23-2424');
    fillData(form, 'input#root_claimantAddress_street', 'test st');
    fillData(form, 'input#root_claimantAddress_city', 'test city');
    fillData(form, 'select#root_claimantAddress_state', 'AL');
    fillData(form, 'input#root_claimantAddress_postalCode', '91333');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
