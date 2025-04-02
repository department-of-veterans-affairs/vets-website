import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';
import * as utilities from '../../utilities';

const definitions = formConfig.defaultDefinitions;

describe('Form Configuration', () => {
  const {
    institutionDetails,
  } = formConfig.chapters.institutionDetailsChapter.pages;
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

    expect(goPath.calledWith('/student-ratio-calculation')).to.be.true;
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
  });
  it('should validate facility code length', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateFacilityCode =
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .uiSchema.institutionDetails.facilityCode['ui:validations'][0];
    validateFacilityCode(errors, '1234567');
    expect(errors.messages).to.include(
      'Please enter a valid 8-digit facility code',
    );

    errors.messages = [];
    validateFacilityCode(errors, '12345678');
    expect(errors.messages).to.be.empty;
  });
  it('should validate term start date within the last 30 days or today', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateTermStartDate =
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .uiSchema.institutionDetails.termStartDate['ui:validations'][0];
    validateTermStartDate(errors, '2023-09-01');
    expect(errors.messages).to.include(
      'Please provide a term start date within the last 30 days or today',
    );
  });
  it('should validate current or past date', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateTermStartDate =
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .uiSchema.institutionDetails.termStartDate['ui:validations'][0];
    const today = new Date();
    const futureDate = today.getDate() + 1;
    const day = String(futureDate).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    validateTermStartDate(errors, `${year}-${month}-${day}`);
    expect(errors.messages).to.include(
      'Please provide a valid current or past date',
    );
  });
  it('should show errors when required field is empty', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('va-text-input[error]').length).to.equal(2);
    expect(form.find('va-memorable-date[error]').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
