import { expect } from 'chai';
import { employersPages } from '../../pages/employers';

describe('21-4140 employers pages', () => {
  it('should export pages object with all required pages', () => {
    expect(employersPages).to.be.an('object');
    expect(employersPages).to.have.property('employersSummary');
    expect(employersPages).to.have.property('employerNameAndAddress');
    expect(employersPages).to.have.property('employmentDates');
    expect(employersPages).to.have.property('employmentDetails');
  });

  it('should have correct path for summary page', () => {
    expect(employersPages.employersSummary).to.have.property(
      'path',
      'employers-summary',
    );
  });

  it('should have correct paths for item pages', () => {
    expect(employersPages.employerNameAndAddress).to.have.property(
      'path',
      'employers/:index/name-and-address',
    );
    expect(employersPages.employmentDates).to.have.property(
      'path',
      'employers/:index/employment-dates',
    );
    expect(employersPages.employmentDetails).to.have.property(
      'path',
      'employers/:index/employment-details',
    );
  });

  it('should have correct titles for all pages', () => {
    expect(employersPages.employersSummary).to.have.property(
      'title',
      'Were you employed or self-employed at any time in the past 12 months?',
    );
    expect(employersPages.employerNameAndAddress).to.have.property(
      'title',
      'Employer name and address',
    );
    expect(employersPages.employmentDates).to.have.property(
      'title',
      'Employment dates',
    );
    expect(employersPages.employmentDetails).to.have.property(
      'title',
      'Employment details',
    );
  });

  it('should have uiSchema and schema for all pages', () => {
    Object.values(employersPages).forEach(page => {
      expect(page).to.have.property('uiSchema');
      expect(page).to.have.property('schema');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
    });
  });

  it('should have required fields in employerNameAndAddress schema', () => {
    const { schema } = employersPages.employerNameAndAddress;
    expect(schema.required).to.include('employerName');
    expect(schema.required).to.include('employerAddress');
  });

  it('should have required fields in employmentDates schema', () => {
    const { schema } = employersPages.employmentDates;
    expect(schema.required).to.include('employmentStartDate');
    expect(schema.required).to.include('employmentEndDate');
  });

  it('should have required fields in employmentDetails schema', () => {
    const { schema } = employersPages.employmentDetails;
    expect(schema.required).to.include('typeOfWork');
    expect(schema.required).to.include('hoursPerWeek');
    expect(schema.required).to.include('lostTimeFromIllness');
    expect(schema.required).to.include('highestGrossIncomePerMonth');
  });
});
