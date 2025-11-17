import React from 'react';
import { expect } from 'chai';

import page from '../../../pages/sectionThree';
import { employedByVAFields } from '../../../definitions/constants';

describe('21-4140 page/sectionThree', () => {
  it('requires employer name, type of work, hours per week, lost time, and highest income', () => {
    const employedByVASchema =
      page.schema.properties[employedByVAFields.parentObject];

    expect(employedByVASchema.required).to.deep.equal([
      [
        'employerName',
        'typeOfWork',
        'hoursPerWeek',
        'lostTime',
        'highestIncome',
      ],
    ]);
  });

  it('defines the employer address schema fields', () => {
    const employedByVASchema =
      page.schema.properties[employedByVAFields.parentObject];
    const addressSchema =
      employedByVASchema.properties[employedByVAFields.employerAddress];

    expect(addressSchema).to.exist;
    expect(addressSchema.properties).to.include.keys([
      'street',
      'city',
      'state',
      'postalCode',
    ]);
  });

  it('provides the Section 2 - Employment Information heading in the UI schema', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];
    const title = employedByVAUiSchema['ui:title'];
    let titleText = '';

    if (typeof title === 'string') {
      titleText = title;
    } else if (React.isValidElement(title)) {
      if (typeof title.props?.title === 'string') {
        titleText = title.props.title;
      } else if (React.isValidElement(title.props?.title)) {
        titleText = React.Children.toArray(title.props.title.props?.children)
          .filter(Boolean)
          .join(' ');
      } else {
        titleText = React.Children.toArray(title.props?.children)
          .filter(Boolean)
          .join(' ');
      }
    }

    expect(titleText).to.contain('Section 2 - Employment Information');
  });

  it('includes employer name field in the schema', () => {
    const employedByVASchema =
      page.schema.properties[employedByVAFields.parentObject];

    expect(employedByVASchema.properties[employedByVAFields.employerName]).to
      .exist;
  });

  it('includes type of work field in the schema', () => {
    const employedByVASchema =
      page.schema.properties[employedByVAFields.parentObject];

    expect(employedByVASchema.properties[employedByVAFields.typeOfWork]).to
      .exist;
  });

  it('includes hours per week field in the schema', () => {
    const employedByVASchema =
      page.schema.properties[employedByVAFields.parentObject];

    expect(employedByVASchema.properties[employedByVAFields.hoursPerWeek]).to
      .exist;
  });

  it('includes lost time field in the schema', () => {
    const employedByVASchema =
      page.schema.properties[employedByVAFields.parentObject];

    expect(employedByVASchema.properties[employedByVAFields.lostTime]).to.exist;
  });

  it('includes highest income field in the schema', () => {
    const employedByVASchema =
      page.schema.properties[employedByVAFields.parentObject];

    expect(employedByVASchema.properties[employedByVAFields.highestIncome]).to
      .exist;
  });

  it('provides a hint for type of work field', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];
    const typeOfWorkUi = employedByVAUiSchema[employedByVAFields.typeOfWork];

    expect(typeOfWorkUi['ui:options']?.hint).to.equal(
      'If self-employed enter "Self"',
    );
  });

  it('provides a hint for lost time field', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];
    const lostTimeUi = employedByVAUiSchema[employedByVAFields.lostTime];

    expect(lostTimeUi['ui:options']?.hint).to.equal(
      'Total hours lost from illness',
    );
  });

  it('includes validation for hours per week', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];
    const hoursPerWeekUi =
      employedByVAUiSchema[employedByVAFields.hoursPerWeek];

    expect(hoursPerWeekUi['ui:validations']).to.exist;
  });

  it('includes validation for highest income', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];
    const highestIncomeUi =
      employedByVAUiSchema[employedByVAFields.highestIncome];

    expect(highestIncomeUi['ui:validations']).to.exist;
  });

  it('provides custom error messages for hours per week', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];
    const hoursPerWeekUi =
      employedByVAUiSchema[employedByVAFields.hoursPerWeek];

    expect(hoursPerWeekUi['ui:errorMessages']?.required).to.equal(
      'Enter the number of hours you worked per week. This field is required.',
    );
    expect(hoursPerWeekUi['ui:errorMessages']?.pattern).to.equal(
      'Enter the hours you worked per week using numbers only.',
    );
  });

  it('provides custom error messages for lost time', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];
    const lostTimeUi = employedByVAUiSchema[employedByVAFields.lostTime];

    expect(lostTimeUi['ui:errorMessages']?.required).to.equal(
      'Enter the total hours you lost from illness. This field is required.',
    );
    expect(lostTimeUi['ui:errorMessages']?.pattern).to.equal(
      'Enter the total hours lost from illness using numbers only.',
    );
  });

  it('provides custom error messages for highest income', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];
    const highestIncomeUi =
      employedByVAUiSchema[employedByVAFields.highestIncome];

    expect(highestIncomeUi['ui:errorMessages']?.required).to.equal(
      'Enter the highest monthly income you earned before taxes. This field is required.',
    );
    expect(highestIncomeUi['ui:errorMessages']?.pattern).to.equal(
      'Enter your highest monthly income using numbers only.',
    );
  });

  it('includes dates of employment field in the UI schema', () => {
    const employedByVAUiSchema = page.uiSchema[employedByVAFields.parentObject];

    expect(employedByVAUiSchema[employedByVAFields.datesOfEmployment]).to.exist;
  });
});
