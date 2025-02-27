import { expect } from 'chai';

import {
  facilityTypeChoices,
  facilityTypeError,
} from '../../content/facilityTypes';

import { validateFacilityTypes } from '../../validations/facilityTypes';

describe('validateFacilityTypes', () => {
  let errorList = [];
  const errors = {
    errorList,
    addError: message => errorList.push(message),
  };
  const keys = Object.keys(facilityTypeChoices);

  beforeEach(() => {
    errorList = [];
  });

  it('should not have an error if checkbox is set', () => {
    validateFacilityTypes(errors, { [keys[0]]: true });
    expect(errorList.length).to.eq(0);
  });

  it('should not have an error if "other" input has a value', () => {
    validateFacilityTypes(errors, { other: 'test' });
    expect(errorList.length).to.eq(0);
  });

  it('should return an error if "none" and any other choice is set', () => {
    validateFacilityTypes(errors, {});
    expect(errorList[0]).to.eq(facilityTypeError);
  });
});
