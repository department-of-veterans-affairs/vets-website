import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need applicant veteran applicant details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.veteranApplicantDetails;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(7);
    expect(form.find('select').length).to.equal(3);
    form.unmount();
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

    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'input#root_application_claimant_name_first', 'test');
    fillData(form, 'input#root_application_claimant_name_last', 'test2');
    fillData(form, 'input#root_application_claimant_ssn', '234443344');
    fillData(form, 'select#root_application_claimant_dateOfBirthMonth', '2');
    fillData(form, 'select#root_application_claimant_dateOfBirthDay', '2');
    fillData(form, 'input#root_application_claimant_dateOfBirthYear', '2001');
    fillData(form, 'input#root_application_veteran_placeOfBirth', 'Test Place');

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
