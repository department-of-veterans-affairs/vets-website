import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;

describe('Form Configuration', () => {
  let sandbox;
  const {
    institutionDetails,
  } = formConfig.chapters.institutionDetailsChapter.pages;
  const { schema, uiSchema } = institutionDetails;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    window.localStorage.clear();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should have the correct uiSchema and schema for institutionDetails', () => {
    expect(institutionDetails.uiSchema).to.be.an('object');
    expect(institutionDetails.schema).to.be.an('object');
  });

  it('should navigate to service history if accredited', async () => {
    const goPath = sandbox.spy();
    const formData = {
      facilityCode: '45769814',
      institutionName: 'test',
      startDate: '2024-01-01',
    };
    localStorage.setItem('isAccredited', 'true');

    institutionDetails.onNavForward({ formData, goPath });

    expect(goPath.calledWith('/student-ratio-calculation')).to.be.true;
  });

  it('should navigate to additional form if not accredited', async () => {
    const goPath = sandbox.spy();
    const formData = {
      facilityCode: '09101909',
      institutionName: 'test',
      startDate: '2024-01-01',
    };
    localStorage.setItem('isAccredited', 'false');

    institutionDetails.onNavForward({ formData, goPath });

    expect(goPath.calledWith('/additional-form')).to.be.true;
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
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
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

  it('should show errors when required field is empty', async () => {
    const onSubmit = sandbox.spy();
    delete uiSchema.institutionDetails.institutionName;
    delete schema.properties.institutionDetails.properties.institutionName;
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

    await waitFor(() => {
      form.update();
      expect(form.find('va-text-input[error]').length).to.equal(1);
      expect(form.find('va-memorable-date[error]').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });
});
