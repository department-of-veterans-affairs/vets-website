import { expect } from 'chai';
import {
  extractOrderedBy,
  extractOrderedTest,
  extractOrderedTests,
  extractPerformingLabLocation,
  extractSpecimen,
  labsAndTestsReducer,
} from '../../reducers/labsAndTests';
import { Actions } from '../../util/actionTypes';
import { fhirResourceTypes, loincCodes } from '../../util/constants';

describe('extractOrderedTest', () => {
  const TEST_ID = 'ServiceRequest-1';
  const TEST_REF = `#${TEST_ID}`;
  const TEST_NAME = 'Test Name';
  const record = {
    contained: [{ id: 'ServiceRequest-1', code: { text: TEST_NAME } }],
  };

  it('returns the test name when present', () => {
    expect(extractOrderedTest(record, TEST_REF)).to.equal(TEST_NAME);
  });

  it('returns null when the reference is not found', () => {
    const badRec = {
      contained: [{ id: TEST_ID, code: { text: TEST_NAME } }],
    };
    expect(extractOrderedTest(badRec, '#Not-Found')).to.be.null;
  });

  it('returns null when the ServiceRequest has no "code" field', () => {
    const badRec = {
      contained: [{ id: TEST_ID, ignore: 'wrong field' }],
      basedOn: [{ reference: TEST_REF }],
    };
    expect(extractOrderedTest(badRec)).to.be.null;
  });

  it('returns null when "code" has no "text" field', () => {
    const badRec = {
      contained: [{ id: TEST_ID, code: { ignore: 'wrong field' } }],
      basedOn: [{ reference: TEST_REF }],
    };
    expect(extractOrderedTest(badRec)).to.be.null;
  });
});

describe('extractOrderedTests', () => {
  const TEST1 = 'Test 1 Name';
  const TEST2 = 'Test 2 Name';
  const record = {
    contained: [
      { id: 'ServiceRequest-1', code: { text: TEST1 } },
      { id: 'ServiceRequest-2', code: { text: TEST2 } },
    ],
    basedOn: [
      { reference: '#ServiceRequest-1' },
      { reference: '#ServiceRequest-2' },
    ],
  };

  it('returns multiple test names when present', () => {
    expect(extractOrderedTests(record)).to.equal(`${TEST1}, ${TEST2}`);
  });

  it('returns one test name if one of two references returns null', () => {
    const badRec = {
      contained: [
        { id: 'ServiceRequest-1', ignore: 'wrong field' },
        { id: 'ServiceRequest-2', code: { text: TEST2 } },
      ],
      basedOn: [
        { reference: '#ServiceRequest-1' },
        { reference: '#ServiceRequest-2' },
      ],
    };
    expect(extractOrderedTests(badRec)).to.equal(TEST2);
  });

  it('returns null if all references return null', () => {
    const badRec = {
      contained: [
        { id: 'ServiceRequest-1', ignore: 'wrong field' },
        { id: 'ServiceRequest-2', ignore: 'wrong field' },
      ],
      basedOn: [
        { reference: '#ServiceRequest-1' },
        { reference: '#ServiceRequest-2' },
      ],
    };
    expect(extractOrderedTests(badRec)).to.be.null;
  });

  it('returns null when basedOn is not found', () => {
    const badRec = {
      contained: [{ id: 'ServiceRequest-1', code: { text: TEST1 } }],
    };
    expect(extractOrderedTest(badRec)).to.be.null;
  });
});

describe('extractSpecimen', () => {
  const testRecord = {
    contained: [{ id: 'ex-MHV-specimen-3', resourceType: 'Specimen' }],
    specimen: [{ reference: '#ex-MHV-specimen-3' }],
  };
  const testRecord2 = {
    contained: [{ id: 'ex-MHV-specimen-3', resourceType: 'Specimen' }],
  };

  it('should return the specimen if correct parameter is passed', () => {
    const record = extractSpecimen(testRecord);
    expect(record.resourceType).to.eq('Specimen');
  });

  it('should return "null" if record is passed without a specimen key', () => {
    const record = extractSpecimen(testRecord2);
    expect(record).to.eq(null);
  });
});

describe('extractPerformingLabLocation', () => {
  const record = {
    contained: [
      {
        id: 'o-1',
        resourceType: fhirResourceTypes.ORGANIZATION,
        name: 'Org Name',
      },
    ],
    performer: [{ reference: '#o-1' }],
  };
  it('gets the performing lab location', () => {
    expect(extractPerformingLabLocation(record)).to.eq('Org Name');
  });
});

describe('extractOrderedBy', () => {
  const record = {
    contained: [
      {
        id: 'p-1',
        resourceType: fhirResourceTypes.PRACTITIONER,
        name: [{ text: 'Practitioner Name' }],
      },
    ],
    performer: [{ reference: '#p-1' }],
  };
  it('gets the performing lab location', () => {
    expect(extractOrderedBy(record)).to.eq('Practitioner Name');
  });
});

describe.skip('labsAndTestsReducer', () => {
  it('creates a list', () => {
    const labsAndTestsResponse = {
      entry: [
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            code: { text: 'CH' },
          },
        },
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            code: { coding: [{ code: loincCodes.MICROBIOLOGY }] },
          },
        },
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            code: { coding: [{ code: loincCodes.PATHOLOGY }] },
          },
        },
      ],
      resourceType: 'Bundle',
    };
    const radiologyResponse = [{ radiologist: 'foo bar' }];

    const newState = labsAndTestsReducer(
      {},
      {
        type: Actions.LabsAndTests.GET_LIST,
        labsAndTestsResponse,
        radiologyResponse,
      },
    );
    expect(newState.labsAndTestsList.length).to.equal(4);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('puts updated records in updatedList', () => {
    const labsAndTestsResponse = {
      entry: [
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            code: { text: 'CH' },
          },
        },
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            code: { coding: [{ code: loincCodes.MICROBIOLOGY }] },
          },
        },
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            code: { coding: [{ code: loincCodes.PATHOLOGY }] },
          },
        },
      ],
      resourceType: 'Bundle',
    };
    const newState = labsAndTestsReducer(
      {
        labsAndTestsList: [
          {
            resource: {
              resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
              code: { coding: [{ code: loincCodes.MICROBIOLOGY }] },
            },
          },
          {
            resource: {
              resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
              code: { coding: [{ code: loincCodes.PATHOLOGY }] },
            },
          },
        ],
      },
      {
        type: Actions.LabsAndTests.GET_LIST,
        labsAndTestsResponse,
        radiologyResponse: [],
      },
    );
    expect(newState.labsAndTestsList.length).to.equal(2);
    expect(newState.updatedList.length).to.equal(3);
  });

  it('moves updatedList into labsAndTestsList on request', () => {
    const newState = labsAndTestsReducer(
      {
        labsAndTestsList: [
          {
            resource: {
              resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
              code: { coding: [{ code: loincCodes.MICROBIOLOGY }] },
            },
          },
        ],
        updatedList: [
          {
            resource: {
              resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
              code: { coding: [{ code: loincCodes.MICROBIOLOGY }] },
            },
          },
          {
            resource: {
              resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
              code: { coding: [{ code: loincCodes.PATHOLOGY }] },
            },
          },
        ],
      },
      { type: Actions.LabsAndTests.COPY_UPDATED_LIST },
    );
    expect(newState.labsAndTestsList.length).to.equal(2);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('does not move updatedList into labsAndTestsList if updatedList does not exist', () => {
    const newState = labsAndTestsReducer(
      {
        labsAndTestsList: [
          {
            resource: {
              resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
              code: { coding: [{ code: loincCodes.MICROBIOLOGY }] },
            },
          },
        ],
        updatedList: undefined,
      },
      { type: Actions.LabsAndTests.COPY_UPDATED_LIST },
    );
    expect(newState.labsAndTestsList.length).to.equal(1);
    expect(newState.updatedList).to.equal(undefined);
  });
});
