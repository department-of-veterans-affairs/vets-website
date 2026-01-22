import { expect } from 'chai';
import sinon from 'sinon';

import { parseISO } from 'date-fns';
import {
  buildRadiologyResults,
  convertChemHemObservation,
  convertChemHemRecord,
  convertCvixRadiologyRecord,
  convertMicrobiologyRecord,
  convertMhvRadiologyRecord,
  distillChemHemNotes,
  extractLabLocation,
  extractOrderedBy,
  extractOrderedTest,
  extractOrderedTests,
  extractPerformingLabLocation,
  extractPractitioner,
  extractSpecimen,
  labsAndTestsReducer,
  mergeRadiologyLists,
  convertUnifiedLabsAndTestRecord,
  convertPathologyRecord,
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

describe('convertPathologyRecord', () => {
  const createMockRecord = (code, text = 'LR SURGICAL PATHOLOGY REPORT') => ({
    id: 'mock-id',
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code,
        },
      ],
      text,
    },
    physician: 'Dr. John Doe',
    effectiveDateTime: '2025-04-28T12:00:00Z',
    specimen: {
      collection: {
        collectedDateTime: '2025-04-26T12:00:00Z',
        bodySite: { text: 'Left Arm' },
      },
      type: { text: 'Blood' },
    },
    presentedForm: [{ data: 'mockedBase64ReportData' }],
    labComments: 'Mocked comment.',
  });

  const testCases = [
    {
      code: loincCodes.PATHOLOGY, // '11526-1'
      expectedName: 'LR SURGICAL PATHOLOGY REPORT',
    },
    {
      code: loincCodes.SURGICAL_PATHOLOGY, // e.g. '27898-6'
      expectedName: 'Surgical Pathology',
    },
    {
      code: loincCodes.ELECTRON_MICROSCOPY, // e.g. '50668-3'
      expectedName: 'Electron Microscopy',
    },
    {
      code: loincCodes.CYTOPATHOLOGY, // e.g. '26438-2'
      expectedName: 'Cytology',
    },
    {
      code: 'invalid-code',
      expectedName: 'Pathology',
    },
  ];

  testCases.forEach(({ code, expectedName }) => {
    it(`should correctly map pathology record for code ${code}`, () => {
      const record = createMockRecord(code);
      const result = convertPathologyRecord(record);

      expect(result.id).to.equal('mock-id');
      expect(result.name).to.equal(expectedName);
      expect(result.type).to.equal(labTypes.PATHOLOGY);
      expect(result.orderedBy).to.equal('Dr. John Doe');
      expect(result.date).to.exist;
      expect(result.dateCollected).to.exist;
      expect(result.sampleFrom).to.exist;
      expect(result.sampleTested).to.exist;
      expect(result.labLocation).to.exist;
      expect(result.collectingLocation).to.exist;
      expect(result.results).to.be.an('array');
      expect(result.labComments).to.equal('Mocked comment.');
    });
  });

  it('should return null for an undefined pathology record', () => {
    const result = convertPathologyRecord(undefined);
    expect(result).to.be.null;
  });

  it('should fallback gracefully when pathology record has no code object', () => {
    const minimalRecord = {
      id: 'no-code-id',
      physician: 'Dr. Jane Doe',
      effectiveDateTime: '2025-04-28T12:00:00Z',
      presentedForm: [],
      labComments: 'No code field present',
    };
    const result = convertPathologyRecord(minimalRecord);
    expect(result).to.exist;
    expect(result.name).to.equal('Pathology');
    expect(result.type).to.equal(labTypes.PATHOLOGY);
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
        result: '138 mEq/L (Low)',
        standardRange: EMPTY_FIELD,
        status: 'final',
        labComments: EMPTY_FIELD,
        labLocation: EMPTY_FIELD,
      },
    ]);
  });

  it('should retain significant digits in small numbers', () => {
    const record = {
      contained: [
        {
          resourceType: 'Observation',
          id: 'test-1',
          code: { text: 'Name' },
          valueQuantity: {
            value: 0.0007,
            unit: 'mEq/L',
          },
          status: 'final',
        },
      ],
      result: [{ reference: '#test-1' }],
    };

    expect(convertChemHemObservation(record)).to.deep.equal([
      {
        name: 'Name',
        result: '0.0007 mEq/L',
        standardRange: EMPTY_FIELD,
        status: 'final',
        labComments: EMPTY_FIELD,
        labLocation: EMPTY_FIELD,
      },
    ]);
  });

  it('should display string values as-is', () => {
    const record = {
      contained: [
        {
          resourceType: 'Observation',
          id: 'test-1',
          code: { text: 'Name' },
          valueQuantity: {
            value: '0.0007000',
            unit: 'mEq/L',
          },
          status: 'final',
        },
      ],
      result: [{ reference: '#test-1' }],
    };

    expect(convertChemHemObservation(record)).to.deep.equal([
      {
        name: 'Name',
        result: '0.0007000 mEq/L',
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
    expect(extractPractitioner(record, svcReq)).to.equal('JANE A DOE');
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
  const CODE_TEXT_NAME = 'Glycohemoglobin HbA 1c~ARCHITECH C8000';
  const DISPLAY_NAME = 'HEMOGLOBIN A1C*';
  const record = {
    contained: [{ id: 'ServiceRequest-1', code: { text: CODE_TEXT_NAME } }],
  };

  it('returns the test name when present', () => {
    expect(extractOrderedTest(record, TEST_REF)).to.equal(CODE_TEXT_NAME);
  });

  it('returns null when the reference is not found', () => {
    const badRec = {
      contained: [{ id: TEST_ID, code: { text: CODE_TEXT_NAME } }],
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

  it('prioritizes display value from coding array when available', () => {
    const recordWithCoding = {
      contained: [
        {
          id: TEST_ID,
          code: {
            text: CODE_TEXT_NAME,
            coding: [
              {
                code: '85053.3412',
                system: 'http://va.gov/terminology/vistaDefinedTerms/64',
              },
              {
                code: '7531',
                display: DISPLAY_NAME,
                system: 'http://va.gov/terminology/vistaDefinedTerms/60',
              },
            ],
          },
        },
      ],
    };

    expect(extractOrderedTest(recordWithCoding, TEST_REF)).to.equal(
      DISPLAY_NAME,
    );
  });

  it('falls back to code.text when no display value is found in coding array', () => {
    const recordWithCodingNoDisplay = {
      contained: [
        {
          id: TEST_ID,
          code: {
            text: CODE_TEXT_NAME,
            coding: [
              {
                code: '85053.3412',
                system: 'http://va.gov/terminology/vistaDefinedTerms/64',
              },
              {
                code: '7531',
                system: 'http://va.gov/terminology/vistaDefinedTerms/60',
              },
            ],
          },
        },
      ],
    };

    expect(extractOrderedTest(recordWithCodingNoDisplay, TEST_REF)).to.equal(
      CODE_TEXT_NAME,
    );
  });

  it('ignores empty display values in coding array', () => {
    const recordWithEmptyDisplay = {
      contained: [
        {
          id: TEST_ID,
          code: {
            text: CODE_TEXT_NAME,
            coding: [
              {
                code: '85053.3412',
                display: '',
                system: 'http://va.gov/terminology/vistaDefinedTerms/64',
              },
              {
                code: '7531',
                display: '   ',
                system: 'http://va.gov/terminology/vistaDefinedTerms/60',
              },
              {
                code: '9999',
                display: DISPLAY_NAME,
                system: 'http://va.gov/terminology/vistaDefinedTerms/99',
              },
            ],
          },
        },
      ],
    };

    expect(extractOrderedTest(recordWithEmptyDisplay, TEST_REF)).to.equal(
      DISPLAY_NAME,
    );
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

describe('Sort date', () => {
  const date = new Date();
  const dateIso = `${date.toISOString().split('.')[0]}Z`; // e.g. 2024-11-20T13:42:33Z
  const dateTimestamp = date.getTime(); // e.g. 1732110153125
  const compareDate = Math.floor(dateTimestamp / 1000) * 1000;

  it('matches for convertChemHemRecord', () => {
    const record = { effectiveDateTime: dateIso };
    const convertedRecord = convertChemHemRecord(record);
    expect(parseISO(convertedRecord.sortDate).getTime()).to.eq(compareDate);
  });

  it('matches for convertMhvRadiologyRecord', () => {
    const record = {
      contained: [
        {
          id: 'ex-MHV-specimen-3',
          collection: { collectedDateTime: '1995-07-28' },
        },
      ],
      specimen: [{ reference: '#ex-MHV-specimen-3' }],
    };
    const convertedRecord = convertMicrobiologyRecord(record);
    expect(parseISO(convertedRecord.sortDate).getTime()).to.eq(
      parseISO('1995-07-28').getTime(),
    );
  });

  it('matches for convertMhvRadiologyRecord', () => {
    const record = { eventDate: dateIso };
    const convertedRecord = convertMhvRadiologyRecord(record);
    expect(parseISO(convertedRecord.sortDate).getTime()).to.eq(compareDate);
  });

  it('matches for convertCvixRadiologyRecord', () => {
    const record = { performedDatePrecise: dateTimestamp };
    const convertedRecord = convertCvixRadiologyRecord(record);
    expect(parseISO(convertedRecord.sortDate).getTime()).to.eq(compareDate);
  });
});

describe('mergeRadiologyLists', () => {
  it('returns an empty array when both input arrays are empty', () => {
    const result = mergeRadiologyLists([], []);
    expect(result).to.deep.equal([]);
  });

  it('returns the PHR list when CVIX list is empty', () => {
    const phrList = [{ id: 1, sortDate: '2020-01-01T12:00:00Z' }];
    const result = mergeRadiologyLists(phrList, []);
    expect(result).to.deep.equal(phrList);
  });

  it('returns the CVIX list when PHR list is empty', () => {
    const cvixList = [{ id: 2, sortDate: '2020-01-02T12:00:00Z' }];
    const result = mergeRadiologyLists([], cvixList);
    expect(result).to.deep.equal(cvixList);
  });

  it('concatenates lists when there are no matching dates', () => {
    const phrList = [{ id: 1, sortDate: '2020-01-01T12:00:00Z' }];
    const cvixList = [{ id: 2, sortDate: '2020-01-02T12:00:00Z' }];
    const result = mergeRadiologyLists(phrList, cvixList);
    expect(result).to.deep.equal([...phrList, ...cvixList]);
  });

  it('handles multiple matches correctly', () => {
    const phrList = [
      { id: 1, sortDate: '2020-01-01T10:00:00Z', data: 'phr1' },
      { id: 2, sortDate: '2020-01-02T11:00:00Z', data: 'phr2' },
    ];
    const cvixList = [
      { id: 3, sortDate: '2020-01-01T10:00:00Z', studyId: 'c1', imageCount: 1 },
      { id: 4, sortDate: '2020-01-02T11:00:00Z', studyId: 'c2', imageCount: 2 },
      { id: 5, sortDate: '2020-01-03T12:00:00Z', studyId: 'c3', imageCount: 3 },
    ];
    const result = mergeRadiologyLists(phrList, cvixList);
    expect(result).to.deep.equal([
      {
        id: 1,
        sortDate: '2020-01-01T10:00:00Z',
        data: 'phr1',
        studyId: 'c1',
        imageCount: 1,
      },
      {
        id: 2,
        sortDate: '2020-01-02T11:00:00Z',
        data: 'phr2',
        studyId: 'c2',
        imageCount: 2,
      },
      {
        id: 5,
        sortDate: '2020-01-03T12:00:00Z',
        studyId: 'c3',
        imageCount: 3,
      },
    ]);
  });
});

describe('labsAndTestsReducer', () => {
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
      newState.labsAndTestsList.find(record => record.id === 'chemhem')?.type,
    ).to.equal(labTypes.CHEM_HEM);
    expect(
      newState.labsAndTestsList.find(record => record.id === 'microbio')?.type,
    ).to.equal(labTypes.MICROBIOLOGY);
    expect(
      newState.labsAndTestsList.find(record => record.id === 'pathology')?.type,
    ).to.equal(labTypes.PATHOLOGY);
    expect(
      newState.labsAndTestsList.find(record => record.id.includes('radiology'))
        ?.type,
    ).to.equal(labTypes.RADIOLOGY);

    expect(newState.updatedList).to.equal(undefined);
  });
});

describe('convertUnifiedLabsAndTestRecord', () => {
  let clock;
  beforeEach(() => {
    const fixedTimestamp = new Date('2024-12-31T00:00:00Z').getTime();
    clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });
  });
  afterEach(() => {
    clock.restore();
  });
  it('should convert a valid record correctly', () => {
    const record = {
      id: 'test-id',
      attributes: {
        dateCompleted: '2025-04-22T14:30:00Z',
        display: 'Test Name',
        location: 'Test Location',
        observations: 'Test Observations',
        orderedBy: 'Dr. Smith',
        sampleTested: 'Blood',
        bodySite: 'Arm',
        testCode: '12345',
        comments: 'No issues',
        source: 'oracle-health',
        encodedData: 'VGhpcyBpcyBhIHRlc3Q=',
      },
    };

    const result = convertUnifiedLabsAndTestRecord(record);
    expect(result.id).to.equal('test-id');
    expect(result.name).to.equal('Test Name');
    expect(result.location).to.equal('Test Location');
    expect(result.observations).to.equal('Test Observations');
    expect(result.orderedBy).to.equal('Dr. Smith');
    expect(result.sampleTested).to.equal('Blood');
    expect(result.bodySite).to.equal('Arm');
    expect(result.testCode).to.equal('12345');
    expect(result.type).to.equal('12345');
    expect(result.comments).to.equal('No issues');
    expect(result.source).to.equal('oracle-health');
    expect(result.result).to.equal('This is a test');
  });

  it('should handle missing attributes gracefully', () => {
    const record = {
      id: 'test-id',
      attributes: {},
    };

    const result = convertUnifiedLabsAndTestRecord(record);

    expect(result).to.deep.equal({
      id: 'test-id',
      date: EMPTY_FIELD,
      name: undefined,
      location: undefined,
      observations: undefined,
      orderedBy: undefined,
      sampleTested: undefined,
      sortDate: undefined,
      bodySite: undefined,
      testCode: undefined,
      type: undefined,
      comments: undefined,
      source: undefined,
      result: null,
      base: {
        ...record,
      },
    });
  });

  it('should handle invalid dateCompleted gracefully', () => {
    const record = {
      id: 'test-id',
      attributes: {
        dateCompleted: 'invalid-date',
      },
    };

    const result = convertUnifiedLabsAndTestRecord(record);

    expect(result).to.deep.equal({
      id: 'test-id',
      date: EMPTY_FIELD,
      name: undefined,
      location: undefined,
      observations: undefined,
      orderedBy: undefined,
      sampleTested: undefined,
      sortDate: 'invalid-date',
      bodySite: undefined,
      testCode: undefined,
      type: undefined,
      comments: undefined,
      source: undefined,
      result: null,
      base: {
        ...record,
      },
    });
  });
});

describe('labsAndTestsReducer - unified labs and tests', () => {
  it('should handle unified labs and tests records', () => {
    const unifiedLabsResponse = [
      {
        id: 'test-id',
        attributes: {
          dateCompleted: '2025-04-22T14:30:00Z',
          display: 'Test Name',
          location: 'Test Location',
          observations: 'Test Observations',
          orderedBy: 'Dr. Smith',
          sampleTested: 'Blood',
          bodySite: 'Arm',
          testCode: '12345',
          comments: 'No issues',
          encodedData: 'VGhpcyBpcyBhIHRlc3Q=',
        },
      },
    ];

    const newState = labsAndTestsReducer(
      {},
      {
        type: Actions.LabsAndTests.GET_UNIFIED_LIST,
        labsAndTestsResponse: unifiedLabsResponse,
      },
    );

    expect(newState.labsAndTestsList.length).to.equal(1);
    const testRecord = newState.labsAndTestsList[0];
    expect(testRecord.id).to.equal('test-id');
    expect(testRecord.name).to.equal('Test Name');
    expect(testRecord.location).to.equal('Test Location');
    expect(testRecord.observations).to.equal('Test Observations');
    expect(testRecord.orderedBy).to.equal('Dr. Smith');
    expect(testRecord.sampleTested).to.equal('Blood');
    expect(testRecord.bodySite).to.equal('Arm');
    expect(testRecord.testCode).to.equal('12345');
    expect(testRecord.type).to.equal('12345');
    expect(testRecord.comments).to.equal('No issues');
    expect(testRecord.result).to.equal('This is a test');
  });

  it('merges CVIX radiology into unified list and strips undefined hash', () => {
    const unifiedLabsResponse = [
      { id: 'lab-1', attributes: { dateCompleted: '2025-04-22T14:30:00Z' } },
      { id: 'lab-2', attributes: { dateCompleted: '2025-05-01T09:00:00Z' } },
      { id: 'lab-3', attributes: { dateCompleted: '2025-03-15T18:45:00Z' } },
    ];

    const cvixRadiologyResponse = [
      {
        id: 42,
        performedDatePrecise: new Date('2024-12-01T10:00:00Z').getTime(),
      },
      {
        id: 100,
        performedDatePrecise: new Date('2025-03-22T02:40:00Z').getTime(),
      },
      {
        id: 77,
        performedDatePrecise: new Date('2025-05-01T00:00:00Z').getTime(),
      },
    ];

    const newState = labsAndTestsReducer(
      {},
      {
        type: Actions.LabsAndTests.GET_UNIFIED_LIST,
        labsAndTestsResponse: unifiedLabsResponse,
        cvixRadiologyResponse,
      },
    );

    // Expect six records: three unified labs + three CVIX radiology
    expect(newState.labsAndTestsList.length).to.equal(6);

    // Ensure each record has a sortDate
    newState.labsAndTestsList.forEach(rec => {
      expect(rec).to.have.property('sortDate');
      expect(rec.sortDate).to.exist;
    });

    // Verify list is sorted descending by sortDate
    const dates = newState.labsAndTestsList.map(r => r.sortDate);
    for (let i = 0; i < dates.length - 1; i++) {
      const a = dates[i];
      const b = dates[i + 1];
      // If both are truthy, ensure a >= b in lexicographic ISO comparison
      if (a && b) {
        expect(a >= b).to.equal(true);
      }
    }

    // Validate all CVIX records: id starts with 'r' and does not contain 'undefined'
    const cvixRecords = newState.labsAndTestsList.filter(
      r => r.type === labTypes.CVIX_RADIOLOGY,
    );
    expect(cvixRecords.length).to.equal(cvixRadiologyResponse.length);
    cvixRecords.forEach(rec => {
      expect(rec.id).to.match(/^r/);
      expect(rec.id.includes('undefined')).to.equal(false);
    });
  });
});

describe('labsAndTestsReducer - hardened array coercion', () => {
  it('handles undefined entry and filters out null radiology items safely in GET_LIST', () => {
    const action = {
      type: Actions.LabsAndTests.GET_LIST,
      labsAndTestsResponse: { resourceType: 'Bundle' }, // no entry array present
      radiologyResponse: [null, { id: 'rad-1', radiologist: 'Jane Doe' }],
      cvixRadiologyResponse: null,
    };

    const state = labsAndTestsReducer({}, action);

    // Should create a list with only the valid radiology record and not throw
    expect(state.labsAndTestsList).to.be.an('array');
    expect(state.labsAndTestsList.length).to.equal(1);
    expect(state.labsAndTestsList[0].type).to.equal(labTypes.RADIOLOGY);
    // updatedList should be undefined because this is initial population
    expect(state.updatedList).to.equal(undefined);
  });

  it('returns an empty array for GET_LIST when all sources are missing', () => {
    const action = {
      type: Actions.LabsAndTests.GET_LIST,
      labsAndTestsResponse: {},
      radiologyResponse: undefined,
      cvixRadiologyResponse: undefined,
    };
    const state = labsAndTestsReducer({}, action);
    expect(state.labsAndTestsList).to.be.an('array');
    expect(state.labsAndTestsList.length).to.equal(0);
  });

  it('returns an empty list for GET_UNIFIED_LIST when response is null', () => {
    const action = {
      type: Actions.LabsAndTests.GET_UNIFIED_LIST,
      labsAndTestsResponse: null,
    };
    const state = labsAndTestsReducer({}, action);
    expect(state.labsAndTestsList).to.be.an('array');
    expect(state.labsAndTestsList.length).to.equal(0);
  });
});
