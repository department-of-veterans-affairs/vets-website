import { expect } from 'chai';
import sinon from 'sinon';

import {
  transformPicklistToV2,
  enrichDivorceWithSSN,
} from '../../config/utilities/picklistTransform';

import { PICKLIST_DATA } from '../../config/constants';
import transformedV3RemoveOnlyData from '../e2e/fixtures/transformed-remove-only-v3';
import v3RemoveOnlyData from '../e2e/fixtures/removal-only-v3.json';

const dataOptions = 'view:removeDependentOptions';

describe('transformPicklistToV2', () => {
  it('should do nothing when picklist is empty', () => {
    const data = {
      [PICKLIST_DATA]: [],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.undefined;
    expect(result.childMarriage).to.be.undefined;
    expect(result.childStoppedAttendingSchool).to.be.undefined;
    expect(result.reportDivorce).to.be.undefined;
    expect(result.stepChildren).to.be.undefined;
    expect(result[dataOptions]).to.be.undefined;
  });

  it('should do nothing when no items are selected', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'TEST', last: 'USER' },
          selected: false,
          removalReason: 'childMarried',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.undefined;
    expect(result.childMarriage).to.be.undefined;
    expect(result[dataOptions]).to.be.undefined;
  });

  it('should transform childMarried to childMarriage array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'MORTY', last: 'SMITH' },
          dateOfBirth: '2007-11-15',
          ssn: '6791',
          selected: true,
          removalReason: 'childMarried',
          endDate: '2000-01-01',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.childMarriage).to.be.an('array');
    expect(result.childMarriage).to.have.lengthOf(1);
    expect(result.childMarriage[0]).to.deep.equal({
      fullName: { first: 'MORTY', last: 'SMITH' },
      ssn: '6791',
      birthDate: '2007-11-15',
      dateMarried: '2000-01-01',
      dependentIncome: 'N',
    });
  });

  it('should transform childNotInSchool to childStoppedAttendingSchool array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'CHILD', last: 'SMITH' },
          dateOfBirth: '2005-06-15',
          ssn: '1234',
          selected: true,
          removalReason: 'childNotInSchool',
          endDate: '2024-05-01',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.childStoppedAttendingSchool).to.be.an('array');
    expect(result.childStoppedAttendingSchool).to.have.lengthOf(1);
    expect(result.childStoppedAttendingSchool[0]).to.deep.equal({
      fullName: { first: 'CHILD', last: 'SMITH' },
      ssn: '1234',
      birthDate: '2005-06-15',
      dateChildLeftSchool: '2024-05-01',
      dependentIncome: 'N',
    });
  });

  it('should transform childDied to deaths array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'CHILD', last: 'DOE' },
          dateOfBirth: '2000-01-01',
          ssn: '5678',
          selected: true,
          age: 25,
          isStepchild: 'Y',
          removalReason: 'childDied',
          endDate: '2023-12-01',
          endOutsideUs: false,
          endCity: 'Portland',
          endState: 'OR',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.an('array');
    expect(result.deaths).to.have.lengthOf(1);
    expect(result.deaths[0]).to.deep.equal({
      fullName: { first: 'CHILD', last: 'DOE' },
      ssn: '5678',
      birthDate: '2000-01-01',
      dependentType: 'CHILD',
      dependentDeathDate: '2023-12-01',
      dependentDeathLocation: {
        outsideUsa: false,
        location: {
          city: 'Portland',
          state: 'OR',
        },
      },
      deceasedDependentIncome: 'N',
      childStatus: {
        childUnder18: false,
        disabled: true,
        stepChild: true,
      },
    });
  });

  it('should transform marriageEnded (divorce) to reportDivorce object', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SUMMER', last: 'SMITH' },
          dateOfBirth: '1990-08-01',
          ssn: '123456790',
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2000-02-02',
          endCity: 'test',
          endState: 'AS',
          endOutsideUs: false,
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce).to.be.an('object');
    expect(result.reportDivorce).to.deep.equal({
      fullName: { first: 'SUMMER', last: 'SMITH' },
      ssn: '123456790',
      birthDate: '1990-08-01',
      date: '2000-02-02',
      reasonMarriageEnded: 'Divorce',
      explanationOfOther: '',
      divorceLocation: {
        outsideUsa: false,
        location: {
          city: 'test',
          state: 'AS',
        },
      },
      spouseIncome: 'N',
    });
  });

  it('should transform marriageEnded (annulmentOrVoid) to reportDivorce object', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '9999',
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'annulmentOrVoid',
          endAnnulmentOrVoidDescription: 'Test description',
          endDate: '2020-01-01',
          endOutsideUs: true,
          endCity: 'Paris',
          endProvince: 'Test',
          endCountry: 'FRA',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce.reasonMarriageEnded).to.equal('Annulment');
    expect(result.reportDivorce.explanationOfOther).to.equal(
      'Test description',
    );
    expect(result.reportDivorce.divorceLocation).to.deep.equal({
      outsideUsa: true,
      location: {
        city: 'Paris',
        state: 'Test',
        country: 'FRA',
      },
    });
  });

  it('should not include SSN in reportDivorce if SSN is not exactly 9 digits', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '1234', // Only 4 digits
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-01-01',
          endCity: 'test',
          endState: 'AS',
          endOutsideUs: false,
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce).to.be.an('object');
    expect(result.reportDivorce.ssn).to.be.undefined;
    expect(result.reportDivorce.fullName).to.deep.equal({
      first: 'SPOUSE',
      last: 'DOE',
    });
  });

  it('should include SSN in reportDivorce if SSN is exactly 9 digits', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '123456789', // Exactly 9 digits
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-01-01',
          endCity: 'test',
          endState: 'AS',
          endOutsideUs: false,
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce).to.be.an('object');
    expect(result.reportDivorce.ssn).to.equal('123456789');
  });

  it('should normalize SSN in reportDivorce by removing dashes', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '123-45-6789', // 9 digits with dashes
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-01-01',
          endCity: 'test',
          endState: 'AS',
          endOutsideUs: false,
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.reportDivorce).to.be.an('object');
    // Should strip dashes and send digits only
    expect(result.reportDivorce.ssn).to.equal('123456789');
  });

  it('should transform spouse death to deaths array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE', last: 'DOE' },
          dateOfBirth: '1980-05-15',
          ssn: '4444',
          selected: true,
          removalReason: 'spouseDied',
          endDate: '2024-01-15',
          endOutsideUs: true,
          endCity: 'London',
          endCountry: 'GBR',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.an('array');
    expect(result.deaths).to.have.lengthOf(1);
    expect(result.deaths[0]).to.deep.equal({
      fullName: { first: 'SPOUSE', last: 'DOE' },
      ssn: '4444',
      birthDate: '1980-05-15',
      dependentType: 'SPOUSE',
      dependentDeathDate: '2024-01-15',
      dependentDeathLocation: {
        outsideUsa: true,
        location: {
          city: 'London',
          state: '',
          country: 'GBR',
        },
      },
      deceasedDependentIncome: 'N',
    });
  });

  it('should transform parentDied to deaths array', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SAM', last: 'PETER' },
          dateOfBirth: '1936-05-16',
          ssn: '6767',
          selected: true,
          removalReason: 'parentDied',
          endDate: '2000-02-02',
          endOutsideUs: false,
          endCity: 'test',
          endState: 'AK',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths).to.be.an('array');
    expect(result.deaths).to.have.lengthOf(1);
    expect(result.deaths[0]).to.deep.equal({
      fullName: { first: 'SAM', last: 'PETER' },
      ssn: '6767',
      birthDate: '1936-05-16',
      dependentType: 'DEPENDENT_PARENT',
      dependentDeathDate: '2000-02-02',
      dependentDeathLocation: {
        outsideUsa: false,
        location: {
          city: 'test',
          state: 'AK',
        },
      },
      deceasedDependentIncome: 'N',
    });
  });

  it('should transform multiple items to appropriate arrays', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'CHILD1', last: 'SMITH' },
          dateOfBirth: '2007-11-15',
          ssn: '6791',
          selected: true,
          removalReason: 'childMarried',
          endDate: '2000-01-01',
        },
        {
          fullName: { first: 'CHILD2', last: 'SMITH' },
          dateOfBirth: '2010-01-01',
          ssn: '5678',
          selected: true,
          removalReason: 'childDied',
          endDate: '2023-12-01',
          endOutsideUs: false,
          endCity: 'Portland',
          endState: 'OR',
        },
        {
          fullName: { first: 'PARENT', last: 'PETER' },
          dateOfBirth: '1936-05-16',
          ssn: '6767',
          selected: true,
          removalReason: 'parentDied',
          endDate: '2000-02-02',
          endOutsideUs: false,
          endCity: 'test',
          endState: 'AK',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.childMarriage).to.have.lengthOf(1);
    expect(result.deaths).to.have.lengthOf(2);
    expect(result.deaths[0].dependentType).to.equal('CHILD');
    expect(result.deaths[1].dependentType).to.equal('DEPENDENT_PARENT');
  });

  it('should handle stepchildNotMember removal reason', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2012-02-19',
          ssn: '333445555',
          selected: true,
          isStepchild: 'Y',
          removalReason: 'stepchildNotMember',
          endDate: '2000-02-02',
          whoDoesTheStepchildLiveWith: { first: 'John', last: 'Doe' },
          address: {
            country: 'USA',
            street: '123 Fake St.',
            city: 'Las Vegas',
            state: 'NV',
            postalCode: '12345',
          },
          stepchildFinancialSupport: 'N',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.stepChildren).to.be.an('array');
    expect(result.stepChildren).to.have.lengthOf(1);
    expect(result.stepChildren[0]).to.deep.equal({
      fullName: { first: 'STEP', last: 'CHILD' },
      ssn: '333445555',
      birthDate: '2012-02-19',
      dateStepchildLeftHousehold: '2000-02-02',
      whoDoesTheStepchildLiveWith: { first: 'John', last: 'Doe' },
      address: {
        country: 'USA',
        street: '123 Fake St.',
        city: 'Las Vegas',
        state: 'NV',
        postalCode: '12345',
      },
      livingExpensesPaid: 'Less than half',
      supportingStepchild: false,
    });
  });

  it('should map stepchildNotMember with >50% financial support to More than half', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2012-02-19',
          ssn: '333445555',
          selected: true,
          removalReason: 'stepchildNotMember',
          endDate: '2000-02-02',
          whoDoesTheStepchildLiveWith: { first: 'John', last: 'Doe' },
          address: {
            country: 'USA',
            street: '123 Fake St.',
            city: 'Las Vegas',
            state: 'NV',
            postalCode: '12345',
          },
          stepchildFinancialSupport: 'Y',
          isStepchild: 'Y',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.stepChildren).to.deep.equal([
      {
        address: {
          city: 'Las Vegas',
          country: 'USA',
          postalCode: '12345',
          state: 'NV',
          street: '123 Fake St.',
        },
        birthDate: '2012-02-19',
        dateStepchildLeftHousehold: '2000-02-02',
        fullName: {
          first: 'STEP',
          last: 'CHILD',
        },
        livingExpensesPaid: 'More than half',
        ssn: '333445555',
        supportingStepchild: true,
        whoDoesTheStepchildLiveWith: {
          first: 'John',
          last: 'Doe',
        },
      },
    ]);
  });

  it('should add stepchild to stepChildren array only when isStepchild is Y and removalReason is childMarried', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2010-03-15',
          ssn: '123456789',
          selected: true,
          isStepchild: 'Y',
          removalReason: 'childMarried',
          endDate: '2024-06-01',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    // Stepchild with childMarried goes to stepChildren array (not childMarriage)
    expect(result.stepChildren).to.be.an('array');
    expect(result.stepChildren).to.have.lengthOf(1);
    expect(result.stepChildren[0]).to.deep.equal({
      fullName: { first: 'STEP', last: 'CHILD' },
      ssn: '123456789',
      birthDate: '2010-03-15',
    });
    // Should NOT be in childMarriage array
    expect(result.childMarriage).to.be.undefined;
  });

  it('should add stepchild to deaths array only when isStepchild is Y and removalReason is childDied', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2005-08-20',
          ssn: '987654321',
          selected: true,
          isStepchild: 'Y',
          removalReason: 'childDied',
          endDate: '2024-01-15',
          endOutsideUs: false,
          endCity: 'Seattle',
          endState: 'WA',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    // Stepchild should NOT be in stepChildren array for childDied
    expect(result.stepChildren).to.be.undefined;
    // Stepchild should be in deaths array
    expect(result.deaths).to.have.lengthOf(1);
    expect(result.deaths[0]).to.deep.equal({
      fullName: { first: 'STEP', last: 'CHILD' },
      ssn: '987654321',
      birthDate: '2005-08-20',
      dependentType: 'CHILD',
      dependentDeathDate: '2024-01-15',
      dependentDeathLocation: {
        outsideUsa: false,
        location: {
          city: 'Seattle',
          state: 'WA',
        },
      },
      deceasedDependentIncome: 'N',
      childStatus: {
        childUnder18: false,
        disabled: false,
        stepChild: true,
      },
    });
  });

  it('should add stepchild to stepChildren array only when isStepchild is Y and removalReason is childNotInSchool', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'STEP', last: 'CHILD' },
          dateOfBirth: '2003-11-10',
          ssn: '555666777',
          selected: true,
          isStepchild: 'Y',
          removalReason: 'childNotInSchool',
          endDate: '2024-05-20',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    // Stepchild with childNotInSchool goes to stepChildren array (not childStoppedAttendingSchool)
    expect(result.stepChildren).to.be.an('array');
    expect(result.stepChildren).to.have.lengthOf(1);
    expect(result.stepChildren[0]).to.deep.equal({
      fullName: { first: 'STEP', last: 'CHILD' },
      ssn: '555666777',
      birthDate: '2003-11-10',
    });
    // Should NOT be in childStoppedAttendingSchool array
    expect(result.childStoppedAttendingSchool).to.be.undefined;
  });

  it('should NOT add stepchild to stepChildren array when isStepchild is N', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'BIOLOGICAL', last: 'CHILD' },
          dateOfBirth: '2010-03-15',
          ssn: '123456789',
          selected: true,
          isStepchild: 'N',
          removalReason: 'childMarried',
          endDate: '2024-06-01',
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.stepChildren).to.be.undefined;
    expect(result.childMarriage).to.have.lengthOf(1);
  });

  it('should handle missing optional location fields', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'CHILD', last: 'DOE' },
          dateOfBirth: '2010-01-01',
          ssn: '5678',
          selected: true,
          removalReason: 'childDied',
          endDate: '2023-12-01',
          // No location fields provided
        },
      ],
    };
    const result = transformPicklistToV2(data);

    expect(result.deaths[0].dependentDeathLocation).to.deep.equal({
      outsideUsa: false,
      location: {
        city: '',
        state: '',
      },
    });
  });

  it('should ignore parentOther removal reason', () => {
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'PARENT', last: 'DOE' },
          dateOfBirth: '1940-01-01',
          ssn: '9999',
          selected: true,
          removalReason: 'parentOther',
          endDate: '2024-01-01',
        },
      ],
    };

    const result = transformPicklistToV2(data);
    expect(result.reportDivorce).to.be.undefined;
  });

  it('should log issue in Datadog for multiple spouses with marriageEnded', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = {
      logger: { log: logSpy },
    };
    const data = {
      [PICKLIST_DATA]: [
        {
          fullName: { first: 'SPOUSE1', last: 'SMITH' },
          dateOfBirth: '1990-08-01',
          ssn: '6790',
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2000-02-02',
          endOutsideUs: false,
        },
        {
          fullName: { first: 'SPOUSE2', last: 'DOE' },
          dateOfBirth: '1985-01-01',
          ssn: '9999',
          selected: true,
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-01-01',
          endOutsideUs: false,
        },
      ],
    };
    transformPicklistToV2(data);

    // Should log issue in Datadog
    expect(logSpy.args[0]).to.deep.equal([
      'Multiple spouses with marriageEnded in v3 to V2 transform',
      {},
      'info',
      undefined,
    ]);
  });

  it('should log issue in Datadog for an unknown removal reason', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = {
      logger: { log: logSpy },
    };
    const data = {
      [PICKLIST_DATA]: [
        {
          selected: true,
          removalReason: 'somethingUnknown',
        },
      ],
    };

    // Should log issue in Datadog
    transformPicklistToV2(data);
    expect(logSpy.args[0]).to.deep.equal([
      'Unknown removal reason in v3 to V2 transform',
      { removalReason: 'somethingUnknown' },
      'error',
      undefined,
    ]);
  });

  it('should do a full transformation with all dependent types', () => {
    const v3Result = transformedV3RemoveOnlyData;
    // First fix v3 remove only datesOfBirth
    const data = {
      ...v3RemoveOnlyData,
      [PICKLIST_DATA]: v3Result[PICKLIST_DATA],
    };

    const result = transformPicklistToV2(data);
    expect(result.childMarriage).to.deep.equal(v3Result.childMarriage);
    expect(result.childStoppedAttendingSchool).to.deep.equal(
      v3Result.childStoppedAttendingSchool,
    );
    expect(result.deaths).to.deep.equal(v3Result.deaths);
    expect(result.reportDivorce).to.deep.equal(v3Result.reportDivorce);
    expect(result.stepChildren).to.deep.equal(v3Result.stepChildren);
  });
});

describe('enrichDivorceWithSSN', () => {
  it('should add SSN to reportDivorce when matching spouse is found', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
        date: '2020-06-01',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.equal('123456789');
    expect(result.reportDivorce.fullName).to.deep.equal({
      first: 'Jane',
      last: 'Doe',
    });
  });

  it('should match spouse with middle name', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', middle: 'Marie', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', middle: 'Marie', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '987654321',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.equal('987654321');
  });

  it('should match spouse with case-insensitive name comparison', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'jane', middle: 'MARIE', last: 'DoE' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'JANE', middle: 'marie', last: 'DOE' },
            dateOfBirth: '1990-01-15',
            ssn: '555666777',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.equal('555666777');
  });

  it('should match spouse without middle name when both are undefined', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '111222333',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.equal('111222333');
  });

  it('should not modify data if SSN already exists', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
        ssn: '555555555',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '999999999',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    // Should keep the existing SSN, not replace it
    expect(result.reportDivorce.ssn).to.equal('555555555');
  });

  it('should return unchanged data if no reportDivorce exists', () => {
    const data = {
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result).to.deep.equal(data);
  });

  it('should return unchanged data if no matching spouse is found', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'John', last: 'Smith' },
            dateOfBirth: '1985-05-20',
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
    expect(result.reportDivorce.fullName).to.deep.equal({
      first: 'Jane',
      last: 'Doe',
    });
  });

  it('should not match if birthDate is different', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-16', // Different date
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should not match if name is different', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Janet', last: 'Doe' }, // Different first name
            dateOfBirth: '1990-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should not match if relationship is not Spouse', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '123456789',
            relationshipToVeteran: 'Child', // Not a spouse
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should handle empty awarded dependents array', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [],
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should handle missing dependents object', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
    };

    const result = enrichDivorceWithSSN(data);

    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should not add SSN if it is not exactly 9 digits', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '12345', // Only 5 digits
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    // Should not add invalid SSN
    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should not add SSN if it has more than 9 digits', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '12345678901', // 11 digits
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    // Should not add invalid SSN
    expect(result.reportDivorce.ssn).to.be.undefined;
  });

  it('should normalize SSN by removing dashes and formatting', () => {
    const data = {
      reportDivorce: {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '1990-01-15',
      },
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Doe' },
            dateOfBirth: '1990-01-15',
            ssn: '123-45-6789', // 9 digits with formatting
            relationshipToVeteran: 'Spouse',
          },
        ],
      },
    };

    const result = enrichDivorceWithSSN(data);

    // Should normalize SSN to digits only (remove dashes)
    expect(result.reportDivorce.ssn).to.equal('123456789');
  });
});
