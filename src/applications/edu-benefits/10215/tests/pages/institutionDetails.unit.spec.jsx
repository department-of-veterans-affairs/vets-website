import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;

describe('22-10215 - Institution Details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionDetails;

  it('renders the correct amount of inputs', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    // Institution name and Facility code fields
    expect(form.find('va-text-input').length).to.equal(2);
    // Term start date and Date of calculation fields
    expect(form.find('va-memorable-date').length).to.equal(2);

    form.unmount();
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
    // Institution name and Facility code errors
    expect(form.find('va-text-input[error]').length).to.equal(2);
    // Term start date and Date of calculation errors
    expect(form.find('va-memorable-date[error]').length).to.equal(2);
    expect(onSubmit.called).to.be.false;

    form.unmount();
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
  it('should show date of calculations error if date of calculations is before term start date', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{
          institutionDetails: {
            institutionName: 'test',
            facilityCode: '12345678',
            termStartDate: '2025-02-01',
            dateOfCalculations: '2025-01-01',
          },
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    form.find('form').simulate('submit');

    expect(form.find('va-memorable-date[error]').length).to.equal(1);
    form.unmount();
  });
  it('should not show date of calculations error if term start date is empty', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{
          institutionDetails: {
            institutionName: 'test',
            facilityCode: '12345678',
            termStartDate: '',
            dateOfCalculations: '2025-01-01',
          },
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    form.find('form').simulate('submit');

    expect(form.find('va-memorable-date[error]').length).to.equal(1);
    form.unmount();
  });
});
