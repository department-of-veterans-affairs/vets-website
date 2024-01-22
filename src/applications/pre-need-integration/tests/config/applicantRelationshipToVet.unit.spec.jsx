import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need applicant relationship to vet', () => {
  const {
    schema,
  } = formConfig.chapters.applicantInformation.pages.applicantRelationshipToVet;

  const uiSchema = formConfig.chapters.applicantInformation.pages.applicantRelationshipToVet.uiSchema();

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(8);
    expect(form.find('va-additional-info').length).to.equal(1);
    expect(form.find('va-additional-info').html()).to.include(
      '<va-additional-info trigger="What if the applicant is not a service member or Veteran?"><ul><li>A <strong>spouse</strong> is a person who is or was legally married to a service member or Veteran. A <strong>surviving spouse</strong> is someone who was legally married to the service member or Veteran at the time of their death and includes a surviving spouse who remarried.</li><li>An <strong>unmarried adult child</strong> is an individual who became physically or mentally disabled permanently and incapable of self-support before the age of 21, or before 23 years of age if pursuing a full-time course of instruction at an approved educational institution.</li><li>For <strong>other</strong> applicants such as the parent of a service member, we’ll ask questions about the service member (the sponsor) to determine eligibility for burial in a VA national cemetery.</li></ul></va-additional-info>',
    );
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

    expect(form.find('.usa-input-error').length).to.equal(1);
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
    selectRadio(form, 'root_application_claimant_relationshipToVet', '1');

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
