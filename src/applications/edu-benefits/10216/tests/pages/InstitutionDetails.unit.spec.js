import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import * as utilities from '../../utilities';

describe('Form Configuration', () => {
  const {
    institutionDetails,
    additionalErrorChapter,
  } = formConfig.chapters.applicantInformationChapter.pages;
  const { schema, uiSchema } = institutionDetails;
  it('should have the correct uiSchema and schema for institutionDetails', () => {
    expect(institutionDetails.uiSchema).to.be.an('object');
    expect(institutionDetails.schema).to.be.an('object');
  });

  it('should navigate to service history if accredited', async () => {
    const goPath = sinon.spy();
    const formData = {
      facilityCode: '45769814',
      institutionName: 'test',
      startDate: '2024-01-01',
    };
    const validateFacilityCodeStub = sinon
      .stub(utilities, 'validateFacilityCode')
      .returns(Promise.resolve(true));

    await institutionDetails.onNavForward({ formData, goPath });

    expect(goPath.calledWith('/service-history')).to.be.true;
    validateFacilityCodeStub.restore();
  });

  it('should navigate to additional form if not accredited', async () => {
    const goPath = sinon.spy();
    const formData = {
      facilityCode: '09101909',
      institutionName: 'test',
      startDate: '2024-01-01',
    };
    const validateFacilityCodeStub = sinon
      .stub(utilities, 'validateFacilityCode')
      .returns(Promise.resolve(false));

    await institutionDetails.onNavForward({ formData, goPath });

    expect(goPath.calledWith('/additional-form')).to.be.true;
    validateFacilityCodeStub.restore();
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={additionalErrorChapter.schema}
        onSubmit={onSubmit}
        data={formData}
        uiSchema={additionalErrorChapter.uiSchema}
        definitions={{}}
      />,
    );
    const formDOM = findDOMNode(form);
    const alertNodes = formDOM.querySelector('#additional-form-needed-alert');
    expect(alertNodes).to.exist;
  });
  it('should validate facility code length', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateFacilityCode =
      formConfig.chapters.applicantInformationChapter.pages.institutionDetails
        .uiSchema.facilityCode['ui:validations'][0];
    validateFacilityCode(errors, '1234567');
    expect(errors.messages).to.include(
      'Facility code must be exactly 8 characters long',
    );

    errors.messages = [];
    validateFacilityCode(errors, '12345678');
    expect(errors.messages).to.be.empty;
  });
  it('should show errors when required field is empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
        definitions={{}}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(
      Array.from(formDOM.querySelectorAll('.usa-input-error')).length,
    ).to.equal(2);

    expect(onSubmit.called).to.be.false;
  });
});
