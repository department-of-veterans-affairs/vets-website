import { expect } from 'chai';
import { validations } from '../../config/validations';

describe('Custom form validations', () => {
  let errorMessage = [];
  const errors = {
    addError: msg => errorMessage.push(msg),
  };
  const formData = {
    marriageToVeteranStartDate: '2021-01-01',
    separationStartDate: '2000-03-05',
    dateOfMarriage: '1990-02-02',
  };
  beforeEach(() => {
    errorMessage = [];
  });
  it('should validate that the marriage end date is after the marriage start date', () => {
    validations.isAfterMarriageStartDate(errors, '2020-01-01', formData);
    expect(errorMessage).to.include(
      'End date must be after the start date. Enter a date later than [01/01/2021].',
    );
  });
  it('should validate that the separation end date is after the separation start date', () => {
    validations.isAfterSeparationStartDate(errors, '1999-01-01', formData);
    expect(errorMessage).to.include(
      'End date must be after the start date. Enter a date later than [03/05/2000].',
    );
  });
  it('should validate that the previous marriage end date is after the previous marriage start date', () => {
    validations.isAfterPreviousMarriageStartDate(
      errors,
      '1985-01-01',
      formData,
    );
    expect(errorMessage).to.include(
      'End date must be after the start date. Enter a date later than [02/02/1990].',
    );
  });
  it('should not return an error if the marriage end date is after the marriage start date', () => {
    validations.isAfterMarriageStartDate(errors, '2022-01-01', formData);
    expect(errorMessage).to.be.empty;
  });
  it('should not return an error if the marriage end date is the same as the marriage start date', () => {
    validations.isAfterMarriageStartDate(errors, '2021-01-01', formData);
    expect(errorMessage).to.be.empty;
  });
  it('should return an error if value does not exist', () => {
    validations.isAfterMarriageStartDate(errors, '2021-01-01', {});
    expect(errorMessage).to.be.empty;
    validations.isAfterSeparationStartDate(errors, '2021-01-01', {});
    expect(errorMessage).to.be.empty;
    validations.isAfterPreviousMarriageStartDate(errors, '2021-01-01', {});
    expect(errorMessage).to.be.empty;
  });
});
