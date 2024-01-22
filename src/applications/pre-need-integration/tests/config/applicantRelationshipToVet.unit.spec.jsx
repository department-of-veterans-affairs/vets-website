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

  const {
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantRelationshipToVet.uiSchema();

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
      '<va-additional-info trigger="Who we consider an adult dependent child"><p>We consider someone an adult dependent child if either of these descriptions is true:</p><ul><><li>They became permanently physically or mentally disabled and unable to support themselves before the age of 21, <strong>or</strong></li><li>They became permanently physically or mentally disabled and unable to support themselves before the age of 23, if they were enrolled full time in a school or training program at the time their disability started<br /></li></></ul><p><strong>Note:</strong> Adult dependent children must be unmarried to be eligible for burial in a VA national cemetery.</p></va-additional-info>',
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
