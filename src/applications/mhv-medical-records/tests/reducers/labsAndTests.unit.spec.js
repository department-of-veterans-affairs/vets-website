import { expect } from 'chai';
import {
  buildRadiologyResults,
  convertChemHemObservation,
  distillChemHemNotes,
  extractLabLocation,
  extractOrderedBy,
  extractOrderedTest,
  extractOrderedTests,
  extractPerformingLabLocation,
  extractPractitioner,
  extractSpecimen,
  labsAndTestsReducer,
} from '../../reducers/labsAndTests';
import { Actions } from '../../util/actionTypes';
import {
  EMPTY_FIELD,
  fhirResourceTypes,
  loincCodes,
  labTypes,
} from '../../util/constants';

describe('extractLabLocation', () => {
  const LAB_ID = 'Org-1';
  const LAB_NAME = 'Lab Name';

  it('should return the author', () => {
    const record = {
      contained: [{ id: LAB_ID, name: LAB_NAME }],
      performer: [{ reference: `#${LAB_ID}` }],
    };
    expect(extractLabLocation(record.performer, record)).to.equal(LAB_NAME);
  });

  it('should return null if there is no performer', () => {
    const record = {
      contained: [{ id: LAB_ID, name: LAB_NAME }],
      performer: [],
    };
    expect(extractLabLocation(record.performer, record)).to.be.null;
  });

  it('should return null if the IDs do not match', () => {
    const record = {
      contained: [{ id: 'wrongId', name: LAB_NAME }],
      performer: [{ reference: `#${LAB_ID}` }],
    };
    expect(extractLabLocation(record.performer, record)).to.be.null;
  });

  it('should return null if the Organization has no "name" field', () => {
    const record = {
      contained: [{ id: LAB_ID }],
      performer: [{ reference: `#${LAB_ID}` }],
    };
    expect(extractLabLocation(record.performer, record)).to.be.null;
  });
});

describe('distillChemHemNotes', () => {
  const NOTES1 = 'These are the notes.';
  const NOTES2 = 'These are more notes.';

  it('should return one note', () => {
    const record = { note: [{ text: NOTES1 }] };
    expect(distillChemHemNotes(record.note, 'text')).to.deep.equal([NOTES1]);
  });

  it('should return multiple notes', () => {
    const record = { note: [{ text: NOTES1 }, { text: NOTES2 }] };
    expect(distillChemHemNotes(record.note, 'text')).to.deep.equal([
      NOTES1,
      NOTES2,
    ]);
  });

  it('should return null if the field name does not match', () => {
    const record = { note: [{ text: NOTES1 }] };
    expect(distillChemHemNotes(record.note, 'wrongField')).to.be.null;
  });

  it('should return null if there is no "note" field', () => {
    const record = { wrongField: [{ text: NOTES1 }] };
    expect(distillChemHemNotes(record.note, 'text')).to.be.null;
  });
});

describe('convertChemHemObservation', () => {
  it('should return an empty chem/hem observation if nothing is filled', () => {
    const record = {
      contained: [
        {
          resourceType: 'Observation',
          id: 'test-1',
          // valueString: 'POSITIVE',
        },
      ],
      result: [{ reference: '#test-1' }],
    };

    expect(convertChemHemObservation(record)).to.deep.equal([
      {
        labComments: EMPTY_FIELD,
        labLocation: EMPTY_FIELD,
        name: EMPTY_FIELD,
        result: EMPTY_FIELD,
        standardRange: EMPTY_FIELD,
        status: EMPTY_FIELD,
      },
    ]);
  });

  it('should return a chem/hem observation for a valueString', () => {
    const record = {
      contained: [
        {
          resourceType: 'Observation',
          id: 'test-1',
          code: { text: 'Name' },
          valueString: 'POSITIVE',
          status: 'final',
          note: [{ text: 'Note' }],
          performer: [{ reference: `#Org-1` }],
        },
        { id: 'Org-1', name: 'Lab Name' },
      ],
      result: [{ reference: '#test-1' }],
    };
    expect(convertChemHemObservation(record)).to.deep.equal([
      {
        name: 'Name',
        result: 'POSITIVE',
        standardRange: EMPTY_FIELD,
        status: 'final',
        labComments: ['Note'],
        labLocation: 'Lab Name',
      },
    ]);
  });

  it('should return a chem/hem observation for a valueQuantity', () => {
    const record = {
      contained: [
        {
          resourceType: 'Observation',
          id: 'test-1',
          code: { text: 'Name' },
          valueQuantity: {
            value: 138,
            unit: 'mEq/L',
            system: 'http://unitsofmeasure.org',
          },
          interpretation: [{ text: 'L' }],
          status: 'final',
          note: [],
        },
      ],
      result: [{ reference: '#test-1' }],
    };
    expect(convertChemHemObservation(record)).to.deep.equal([
      {
        name: 'Name',
        result: '138.0 mEq/L (Low)',
        standardRange: EMPTY_FIELD,
        status: 'final',
        labComments: EMPTY_FIELD,
        labLocation: EMPTY_FIELD,
      },
    ]);
  });

  it('should return an empty array if there are no observations', () => {
    const record = {
      contained: [],
      result: [],
    };
    expect(convertChemHemObservation(record)).to.deep.equal([]);
  });
});

describe('extractPractitioner', () => {
  it('should return the practitioner', () => {
    const svcReq = { requester: { reference: '#Prac-1' } };
    const record = {
      contained: [
        {
          resourceType: 'Practitioner',
          id: 'Prac-1',
          name: [{ family: 'DOE', given: ['JANE', 'A'] }],
        },
      ],
    };
    expect(extractPractitioner(record, svcReq)).to.equal('DOE, JANE A');
  });

  it('should return null if the practitioner is not found', () => {
    const svcReq = { requester: { reference: '#Prac-1' } };
    const record = { contained: [{ id: 'Prac-2' }] };
    expect(extractPractitioner(record, svcReq)).to.be.null;
  });

  it('should return null if there is no reference', () => {
    const record = { contained: [{ id: 'Prac-2' }] };
    expect(extractPractitioner(record, null)).to.be.null;
  });
});

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
      {
        id: 'p-1',
        resourceType: fhirResourceTypes.PRACTITIONER,
        name: [{ text: 'Practitioner Name' }],
      },
    ],
    performer: [{ reference: '#p-1' }, { reference: '#o-1' }],
  };
  it('gets the performing lab location', () => {
    expect(extractPerformingLabLocation(record)).to.eq('Org Name');
  });
});

describe('extractOrderedBy', () => {
  const record = {
    contained: [
      {
        id: 'o-1',
        resourceType: fhirResourceTypes.ORGANIZATION,
        name: 'Org Name',
      },
      {
        id: 'p-1',
        resourceType: fhirResourceTypes.PRACTITIONER,
        name: [{ text: 'Practitioner Name' }],
      },
    ],
    performer: [{ reference: '#o-1' }, { reference: '#p-1' }],
  };
  it('gets the performing lab location', () => {
    expect(extractOrderedBy(record)).to.eq('Practitioner Name');
  });
});

describe('buildRadiologyResults', () => {
  const REPORT = 'The report.';
  const IMPRESSION = 'The impression.';

  it('builds the full result', () => {
    const record = {
      reportText: REPORT,
      impressionText: IMPRESSION,
    };
    const report = buildRadiologyResults(record);
    expect(report).to.include(REPORT);
    expect(report).to.include(IMPRESSION);
  });

  it('builds the result without impression', () => {
    const record = { reportText: REPORT };
    const report = buildRadiologyResults(record);
    expect(report).to.include(REPORT);
    expect(report).to.not.include(IMPRESSION);
  });

  it('builds the result without report', () => {
    const record = { impressionText: IMPRESSION };
    const report = buildRadiologyResults(record);
    expect(report).to.not.include(REPORT);
    expect(report).to.include(IMPRESSION);
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

describe('labsAndTestsReducer', () => {
  it('creates a list', () => {
    const labsResponse = {
      entry: [
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            id: 'chemhem',
            code: { text: 'CH' },
          },
        },
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            id: 'microbio',
            code: { coding: [{ code: loincCodes.MICROBIOLOGY }] },
          },
        },
        {
          resource: {
            resourceType: fhirResourceTypes.DIAGNOSTIC_REPORT,
            id: 'pathology',
            code: { coding: [{ code: loincCodes.PATHOLOGY }] },
          },
        },
      ],
      resourceType: 'Bundle',
    };
    const radResponse = [
      {
        id: 'radiology',
        radiologist: 'John',
      },
    ];
    const newState = labsAndTestsReducer(
      {},
      {
        type: Actions.LabsAndTests.GET_LIST,
        labsAndTestsResponse: labsResponse,
        radiologyResponse: radResponse,
      },
    );
    expect(newState.labsAndTestsList.length).to.equal(4);

    expect(
      newState.labsAndTestsList.find(record => {
        record.id === 'chemhem';
      })?.type === labTypes.CHEM_HEM,
    );
    expect(
      newState.labsAndTestsList.find(record => {
        record.id === 'microbio';
      })?.type === labTypes.MICROBIOLOGY,
    );
    expect(
      newState.labsAndTestsList.find(record => {
        record.id === 'pathology';
      })?.type === labTypes.PATHOLOGY,
    );
    expect(
      newState.labsAndTestsList.find(record => {
        record.id === 'rradiology';
      })?.type === labTypes.RADIOLOGY,
    );

    expect(newState.updatedList).to.equal(undefined);
  });
});
