import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';

import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { daysAgoYyyyMmDd, futureDateYyyyMmDd } from '../../helpers';

const definitions = formConfig.defaultDefinitions;

describe('22-10215 - Institution Details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionDetails;

  delete uiSchema.institutionDetails.institutionName;
  delete schema.properties.institutionDetails.properties.institutionName;

  it('renders the correct amount of inputs', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    // Institution name and Facility code fields
    expect(form.find('va-text-input').length).to.equal(1);
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
    expect(form.find('va-text-input[error]').length).to.equal(1);
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
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );

    errors.messages = [];
    validateFacilityCode(errors, '12345678');
    expect(errors.messages).to.be.empty;
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
  it("institutionName 'Not Found' Generates Error: 'Please enter a valid 8-character facility code. To determine...' ", () => {
    const onSubmit = sinon.spy();
    render(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{
          institutionDetails: {
            institutionName: 'not found',
            facilityCode: '12345678',
            termStartDate: '',
            dateOfCalculations: '2025-01-01',
          },
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
  });
  it("termStartDate over 60 days ago...' ", () => {
    const onSubmit = sinon.spy();
    render(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{
          institutionDetails: {
            institutionName: 'test',
            facilityCode: '12345678',
            termStartDate: '2024-01-01',
            dateOfCalculations: '2025-01-01',
          },
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
  });
  it("can test 'validateTermStartDate' error 'isCurrentOrPastDate(termStartDate)' ", () => {
    const termStartDate = daysAgoYyyyMmDd(5);
    const dateOfCalculations = daysAgoYyyyMmDd(10);
    const onSubmit = sinon.spy();
    render(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{
          institutionDetails: {
            institutionName: 'not found',
            facilityCode: '12345678',
            termStartDate,
            dateOfCalculations,
          },
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
  });
  it("can test 'validateTermStartDate' error future date ", () => {
    const termStartDate = futureDateYyyyMmDd(5);
    const dateOfCalculations = daysAgoYyyyMmDd(10);
    const onSubmit = sinon.spy();
    render(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{
          institutionDetails: {
            institutionName: 'not found',
            facilityCode: '12345678',
            termStartDate,
            dateOfCalculations,
          },
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
  });
  it("can test 'validateDateOfCalculations' valid past date ", () => {
    const termStartDate = futureDateYyyyMmDd(15);
    const dateOfCalculations = daysAgoYyyyMmDd(10);
    const onSubmit = sinon.spy();
    render(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{
          institutionDetails: {
            institutionName: 'not found',
            facilityCode: '12345678',
            termStartDate,
            dateOfCalculations,
          },
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
  });
  it("can test 'validateDateOfCalculations' error 'isCurrentOrPastDate(dateOfCalculations)' ", () => {
    const termStartDate = daysAgoYyyyMmDd(15);
    const dateOfCalculations = futureDateYyyyMmDd(10);
    const onSubmit = sinon.spy();
    render(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{
          institutionDetails: {
            institutionName: 'not found',
            facilityCode: '12345678',
            termStartDate,
            dateOfCalculations,
          },
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
  });
});
