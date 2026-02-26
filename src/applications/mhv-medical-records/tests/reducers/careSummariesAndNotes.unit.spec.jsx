import { expect } from 'chai';
import {
  careSummariesAndNotesReducer,
  convertAdmissionAndDischargeDetails,
  convertCareSummariesAndNotesRecord,
  convertUnifiedCareSummariesAndNotesRecord,
  extractAuthenticator,
  extractAuthor,
  extractLocation,
  getAdmissionDate,
  getAttending,
  getDateFromBody,
  getDateSigned,
  getDischargeDate,
  getNote,
  getRecordType,
  getTitle,
  getType,
} from '../../reducers/careSummariesAndNotes';
import { dischargeSummarySortFields, noteTypes } from '../../util/constants';
import dischargeSummary from '../fixtures/dischargeSummary.json';
import progressNote from '../fixtures/physicianProcedureNote.json';
import consultResultNote from '../fixtures/consultResultNote.json';
import { Actions } from '../../util/actionTypes';

describe('getTitle', () => {
  context('local title is present', () => {
    const record = {
      content: [
        { ignore: 'the wrong object' },
        { attachment: { title: 'NOTE TITLE' } },
      ],
    };

    it('should return the title', () => {
      expect(getTitle(record)).to.equal('NOTE TITLE');
    });
  });

  context('local title is absent', () => {
    const record = {
      type: {
        coding: [
          { ignore: 'the wrong object' },
          { display: 'Consultation Note' },
        ],
      },
    };

    it('should return the title', () => {
      expect(getTitle(record)).to.equal('Consultation Note');
    });

    it('should return null if the "coding" array contains no code', () => {
      const badRec = { type: { coding: [{ ignore: 'the wrong object' }] } };
      expect(getTitle(badRec)).to.be.null;
    });

    it('should return null if the "coding" array is empty', () => {
      const badRec = { type: { coding: [] } };
      expect(getTitle(badRec)).to.be.null;
    });

    it('should return null if the "type" object contains no coding', () => {
      const badRec = { type: { ignore: 'the wrong object' } };
      expect(getTitle(badRec)).to.be.null;
    });
  });
});

describe('getType', () => {
  const record = {
    type: {
      coding: [{ ignore: 'the wrong object' }, { code: '11488-4' }],
    },
  };

  it('should return the type', () => {
    expect(getType(record)).to.equal('11488-4');
  });

  it('should return null if the "coding" array contains no code', () => {
    const badRec = { type: { coding: [{ ignore: 'the wrong object' }] } };
    expect(getType(badRec)).to.be.null;
  });

  it('should return null if the "coding" array is empty', () => {
    const badRec = { type: { coding: [] } };
    expect(getType(badRec)).to.be.null;
  });

  it('should return null if the "type" object contains no coding', () => {
    const badRec = { type: { ignore: 'the wrong object' } };
    expect(getType(badRec)).to.be.null;
  });
});

describe('extractAuthenticator', () => {
  const record = {
    contained: [
      {
        id: 'Provider-1',
        name: [{ ignore: 'the wrong object' }, { text: 'SMITH,JOHN' }],
      },
    ],
    authenticator: { reference: '#Provider-1' },
  };

  it('should return the authenticator', () => {
    expect(extractAuthenticator(record)).to.equal('JOHN SMITH');
  });

  it('should return null if no "name" item contains a "text" field', () => {
    const badRec = {
      contained: [{ id: 'Provider-0', name: [{ ignore: 'the wrong object' }] }],
      authenticator: { reference: '#Provider-0' },
    };
    expect(extractAuthenticator(badRec)).to.be.null;
  });

  it('should return null if "name" is empty', () => {
    const badRec = {
      contained: [{ id: 'Provider-0', name: [] }],
      authenticator: { reference: '#Provider-0' },
    };
    expect(extractAuthenticator(badRec)).to.be.null;
  });

  it('should return null if the authenticator is not found', () => {
    const badRec = {
      contained: [{ id: 'Provider-0', name: [{ text: 'SMITH,JOHN' }] }],
      authenticator: { reference: '#NotFound-0' },
    };
    expect(extractAuthenticator(badRec)).to.be.null;
  });

  it('should return null if the authenticator has no reference', () => {
    const badRec = {
      contained: [{ id: 'Provider-0', name: [{ text: 'SMITH,JOHN' }] }],
      authenticator: { ignore: 'the wrong object' },
    };
    expect(extractAuthenticator(badRec)).to.be.null;
  });
});

describe('extractAuthor', () => {
  const record = {
    contained: [
      {
        id: 'Author-0',
        name: [{ ignore: 'the wrong object' }, { text: 'SMITH,JANE' }],
      },
    ],
    author: [{ ignore: 'the wrong object' }, { reference: '#Author-0' }],
  };

  it('should return the author', () => {
    expect(extractAuthor(record)).to.equal('JANE SMITH');
  });

  it('should return null if no "name" item contains a "text" field', () => {
    const badRec = {
      contained: [{ id: 'Author-0', name: [{ ignore: 'the wrong object' }] }],
      author: [{ reference: '#Author-0' }],
    };
    expect(extractAuthor(badRec)).to.be.null;
  });

  it('should return null if "name" is empty', () => {
    const badRec = {
      contained: [{ id: 'Author-0', name: [] }],
      author: [{ reference: '#Author-0' }],
    };
    expect(extractAuthor(badRec)).to.be.null;
  });

  it('should return null if the author is not found', () => {
    const badRec = {
      contained: [{ id: 'Author-0', name: [{ text: 'SMITH,JANE' }] }],
      author: [{ reference: '#NotFound-0' }],
    };
    expect(extractAuthor(badRec)).to.be.null;
  });

  it('should return null if the "author" array has no reference', () => {
    const badRec = {
      contained: [{ id: 'Author-0', name: [{ text: 'SMITH,JANE' }] }],
      author: [{ ignore: 'the wrong object' }],
    };
    expect(extractAuthor(badRec)).to.be.null;
  });

  it('should return null if the "author" array is empty', () => {
    const badRec = {
      contained: [{ id: 'Author-0', name: [{ text: 'SMITH,JANE' }] }],
      author: [],
    };
    expect(extractAuthor(badRec)).to.be.null;
  });
});

describe('extractLocation', () => {
  const record = {
    contained: [
      {
        id: 'Location-0',
        name: 'DAYTON',
        resourceType: 'Location',
      },
    ],
    context: {
      related: [{ ignore: 'the wrong object' }, { reference: '#Location-0' }],
    },
  };

  it('should return the location', () => {
    expect(extractLocation(record)).to.equal('DAYTON');
  });

  it('should return null if "related" is not an array', () => {
    const badRec = {
      ...record,
      context: { related: { reference: '#Location-0' } },
    };
    expect(extractLocation(badRec)).to.be.null;
  });

  it('should return null if "name" is not part of the contained location', () => {
    const badRec = {
      ...record,
      contained: [{ id: 'Location-0' }],
    };
    expect(extractLocation(badRec)).to.be.null;
  });

  it('should return null if "context" is not found', () => {
    const badRec = { ...record, context: null };
    expect(extractLocation(badRec)).to.be.null;
  });

  it('should return null if the referenced item is not found', () => {
    const badRec = {
      ...record,
      context: { related: [{ reference: '#NotFound-0' }] },
    };
    expect(extractLocation(badRec)).to.be.null;
  });

  it('should return null if no "related" items contain a "reference"', () => {
    const badRec = {
      ...record,
      context: { related: [{ unrelated: 'unrelated' }] },
    };
    expect(extractLocation(badRec)).to.be.null;
  });
});

describe('getNote', () => {
  it('should return the decoded note, ignoring other content records', () => {
    const record = {
      content: [
        { ignore: 'the wrong object' },
        { attachment: { data: 'dGVzdA==' } },
        { ignore: 'the wrong object' },
      ],
    };
    expect(getNote(record)).to.equal('test');
  });

  it('should return null if the field is not a string', () => {
    const record = { content: [{ attachment: { data: 12345 } }] };
    expect(getNote(record)).to.be.null;
  });

  it('should return null if "content" is not an array', () => {
    const record = { content: { attachment: { data: 'dGVzdA==' } } };
    expect(getNote(record)).to.be.null;
  });

  it('should return null if no attachment is present', () => {
    const record = { content: [{ ignore: 'the wrong object' }] };
    expect(getNote(record)).to.be.null;
  });
});

describe('getDateSigned', () => {
  // This test is time-zone dependent and will fail in certain circumstances. Skipping for now.
  it('returns formatted date when extension array has an item with valueDateTime', () => {
    const mockRecord = {
      authenticator: {
        extension: [
          { ignore: 'the wrong object' },
          { valueDateTime: '2024-02-07T15:41:47-05:00' },
          { ignore: 'the wrong object' },
        ],
      },
    };
    const result = getDateSigned(mockRecord);
    expect(result).to.equal('February 7, 2024');
  });

  // This test is time-zone dependent and will fail in certain circumstances. Skipping for now.
  it.skip('returns null when the date is invalid', () => {
    const mockRecord = {
      authenticator: { extension: [{ valueDateTime: 'bad date' }] },
    };
    const result = getDateSigned(mockRecord);
    expect(result).to.be.null;
  });

  it('returns null when extension array is present but empty', () => {
    const mockRecord = { authenticator: { extension: [] } };
    const result = getDateSigned(mockRecord);
    expect(result).to.be.null;
  });

  it('returns null when "extension" is not an array', () => {
    const mockRecord = { authenticator: { extension: { ignore: 'object' } } };
    const result = getDateSigned(mockRecord);
    expect(result).to.be.null;
  });

  it('returns null when extension array lacks a valueDateTime', () => {
    const mockRecord = {
      authenticator: {
        extension: [{ notValueDateTime: 'some value' }],
      },
    };
    const result = getDateSigned(mockRecord);
    expect(result).to.be.null;
  });

  it('returns null when record does not have authenticator.extension array', () => {
    const mockRecord = {
      authenticator: {},
    };
    const result = getDateSigned(mockRecord);
    expect(result).to.be.null;
  });
});

describe('getRecordType', () => {
  const buildRecord = loinc => {
    return { type: { coding: [{ code: loinc }] } };
  };

  it('should return the correct type based on LOINC code', () => {
    const dsNote = buildRecord('18842-5');
    const pnNote = buildRecord('11506-3');
    const crNote = buildRecord('11488-4');
    expect(getRecordType(dsNote)).to.equal(noteTypes.DISCHARGE_SUMMARY);
    expect(getRecordType(pnNote)).to.equal(noteTypes.PHYSICIAN_PROCEDURE_NOTE);
    expect(getRecordType(crNote)).to.equal(noteTypes.CONSULT_RESULT);
  });

  it('should handle records with missing type or coding without crashing', () => {
    expect(() => getRecordType({})).to.not.throw();
    expect(() => getRecordType({ type: {} })).to.not.throw();
    expect(() => getRecordType({ type: { coding: undefined } })).to.not.throw();
    expect(getRecordType({})).to.equal(noteTypes.OTHER);
    expect(getRecordType({ type: {} })).to.equal(noteTypes.OTHER);
  });
});

describe('getAttending', () => {
  it('should return the attending', () => {
    const summary =
      'DICTATED BY: SMITH, ALICE    ATTENDING: SMITH, BOB         \nURGENCY: routine';
    expect(getAttending(summary)).to.equal('SMITH, BOB');
  });

  it('should return null if there is no attending', () => {
    const summary = 'DICTATED BY: SMITH, ALICE             \nURGENCY: routine';
    expect(getAttending(summary)).to.be.null;
  });

  it('should return null if attending is listed with no entry', () => {
    const summary =
      'DICTATED BY: SMITH, ALICE    ATTENDING:          \nURGENCY: routine';
    expect(getAttending(summary)).to.be.null;
  });

  it('should return null when noteSummary is not a string', () => {
    expect(getAttending(null)).to.be.null;
    expect(getAttending(undefined)).to.be.null;
    expect(getAttending(12345)).to.be.null;
  });
});

describe('getDateFromBody', () => {
  it('should return null if there is an invalid date', () => {
    const summary = '  DATE OF ADMISSION:  INVALID-DATE  ';
    expect(getDateFromBody(summary, 'DATE OF ADMISSION')).to.eq(null);
  });

  it('should return null when label is not found', () => {
    const summary = '  SOME OTHER LABEL:  2024-01-01  ';
    expect(getDateFromBody(summary, 'DATE OF ADMISSION')).to.eq(null);
  });

  it('should return null when inputs are not strings', () => {
    expect(getDateFromBody(null, 'DATE OF ADMISSION')).to.eq(null);
    expect(getDateFromBody('DATE OF ADMISSION: 2024-01-01', null)).to.eq(null);
    expect(getDateFromBody(undefined, undefined)).to.eq(null);
  });
});

describe('getAdmissionDate', () => {
  it('should return the context.period.start field if it exists', () => {
    const record = { context: { period: { start: '2022-08-05T13:41:23Z' } } };
    expect(getAdmissionDate(record, '')).to.deep.equal(
      new Date('2022-08-05T13:41:23Z'),
    );
  });

  it('should parse the note text if context.period.start does not exist', () => {
    const record = { context: { period: { start: null } } };
    const summary = '  DATE OF ADMISSION: AUG 18,2022  ';
    const actualDate = getAdmissionDate(record, summary)
      .toISOString()
      .split('T')[0];
    const expectedDate = new Date('2022-08-18T00:00:00.000Z')
      .toISOString()
      .split('T')[0];
    expect(actualDate).to.equal(expectedDate);
  });

  it('should return null if there is no admission date', () => {
    const record = { context: { period: { start: null } } };
    const summary = '  DATE OF ADMISSION:  ';
    expect(getAdmissionDate(record, summary)).to.eq(null);
  });
});

describe('getDischargeDate', () => {
  it('should return the context.period.end field if it exists', () => {
    const record = { context: { period: { end: '2022-08-05T13:41:23Z' } } };
    expect(getDischargeDate(record, '')).to.deep.equal(
      new Date('2022-08-05T13:41:23Z'),
    );
  });

  it('should parse the note text if context.period.end does not exist', () => {
    const record = { context: { period: { end: null } } };
    const summary = '  DATE OF DISCHARGE: AUG 18,2022  ';
    const actualDate = getDischargeDate(record, summary)
      .toISOString()
      .split('T')[0];
    const expectedDate = new Date('2022-08-18T00:00:00.000Z')
      .toISOString()
      .split('T')[0];
    expect(actualDate).to.equal(expectedDate);
  });

  it('should return null if there is no discharge date', () => {
    const record = { context: { period: { end: null } } };
    const summary = '  DATE OF DISCHARGE: ';
    expect(getDischargeDate(record, summary)).to.eq(null);
  });
});

describe('convertAdmissionAndDischargeDetails', () => {
  it('should properly convert dates', () => {
    const record = {
      context: {
        period: {
          start: '2022-08-05T13:41:23-0500',
          end: '2022-08-18T04:00:00-0500',
        },
      },
    };
    const dsNote = convertAdmissionAndDischargeDetails(record);
    expect(dsNote.admissionDate).to.eq('August 5, 2022');
    expect(dsNote.dischargeDate).to.eq('August 18, 2022');
  });

  it('should set up sort first by admission date', () => {
    const record = {
      context: {
        period: { start: '2022-08-05T13:41:23Z', end: '2022-08-06T13:41:23Z' },
      },
      date: '2022-08-07T13:41:23Z',
    };
    const dsNote = convertAdmissionAndDischargeDetails(record);
    expect(dsNote.sortByField).to.eq(dischargeSummarySortFields.ADMISSION_DATE);
  });

  it('should set up sort second by discharge date', () => {
    const record = {
      context: { period: { end: '2022-08-06T13:41:23Z' } },
      date: '2022-08-07T13:41:23Z',
    };
    const dsNote = convertAdmissionAndDischargeDetails(record);
    expect(dsNote.sortByField).to.eq(dischargeSummarySortFields.DISCHARGE_DATE);
  });

  it('should set up sort third by date entered', () => {
    const record = { date: '2022-08-07T13:41:23Z' };
    const dsNote = convertAdmissionAndDischargeDetails(record);
    expect(dsNote.sortByField).to.eq(dischargeSummarySortFields.DATE_ENTERED);
  });
});

describe('convertCareSummariesAndNotesRecord', () => {
  it('should properly convert discharge summaries', () => {
    const note = convertCareSummariesAndNotesRecord(dischargeSummary);
    expect(note.type).to.equal('18842-5');
    expect(note.admissionDate).to.eq('August 5, 2022');
    expect(note.dischargeDate).to.eq('August 9, 2022');
    expect(note.dateSigned).to.be.undefined;
  });

  it('should properly convert progress notes', () => {
    const note = convertCareSummariesAndNotesRecord(progressNote);
    expect(note.type).to.equal('11506-3');
    expect(note.admissionDate).to.be.undefined;
    expect(note.dischargeDate).to.be.undefined;
    expect(note.dateSigned).to.be.not.null;
  });

  it('should properly convert consult result notes', () => {
    const note = convertCareSummariesAndNotesRecord(consultResultNote);
    expect(note.type).to.equal('11488-4');
    expect(note.admissionDate).to.be.undefined;
    expect(note.dischargeDate).to.be.undefined;
    expect(note.dateSigned).to.be.not.null;
  });
});

describe('convertUnifiedCareSummariesAndNotesRecord', () => {
  it('should convert a unified record with all fields populated', () => {
    const mockRecord = {
      id: 'test-id-123',
      attributes: {
        name: 'Test Note',
        noteType: 'Progress Note',
        loincCodes: ['11506-3'],
        date: '2025-01-14T09:18:00.000+00:00',
        writtenBy: 'Dr. Jane Smith',
        signedBy: 'Dr. John Doe',
        location: 'Test Hospital',
        note: 'VGVzdCBub3RlIGNvbnRlbnQ=', // Base64 encoded "Test note content"
        admissionDate: '2025-01-13T08:00:00.000+00:00',
        dischargedDate: '2025-01-15T16:30:00.000+00:00',
        dateEntered: '2025-01-14T10:00:00.000+00:00',
        dateSigned: '2025-01-14T11:00:00.000+00:00',
      },
    };

    const result = convertUnifiedCareSummariesAndNotesRecord(mockRecord);

    expect(result.id).to.equal('test-id-123');
    expect(result.name).to.equal('Test Note');
    expect(result.type).to.equal('Progress Note');
    expect(result.loincCodes).to.deep.equal(['11506-3']);
    expect(result.date).to.contain('January 14');
    expect(result.writtenBy).to.equal('Dr. Jane Smith');
    expect(result.signedBy).to.equal('Dr. John Doe');
    expect(result.location).to.equal('Test Hospital');
    expect(result.note).to.equal('Test note content');
    expect(result.dischargedBy).to.equal('Dr. Jane Smith'); // Maps to writtenBy
    expect(result.summary).to.equal('Test note content'); // Decoded note attribute
    expect(result.admissionDate).to.contain('January 13');
    expect(result.dischargedDate).to.contain('January 15');
    expect(result.dateEntered).to.contain('January 14');
    expect(result.dateSigned).to.contain('January 14');
  });

  it('should handle empty or missing attributes with EMPTY_FIELD defaults', () => {
    const mockRecord = {
      id: 'test-id-456',
      attributes: {
        // Most fields missing or empty
        name: '',
        noteType: '',
        loincCodes: [],
        date: null,
        writtenBy: null,
        signedBy: null,
        location: '',
        note: null,
      },
    };

    const result = convertUnifiedCareSummariesAndNotesRecord(mockRecord);

    expect(result.id).to.equal('test-id-456');
    expect(result.name).to.equal('None recorded');
    expect(result.type).to.equal('None recorded');
    expect(result.loincCodes).to.deep.equal([]);
    expect(result.date).to.equal('None recorded');
    expect(result.writtenBy).to.equal('None recorded');
    expect(result.signedBy).to.equal('None recorded');
    expect(result.location).to.equal('None recorded');
    expect(result.note).to.be.null; // decodeBase64Report returns null for invalid input
    expect(result.dischargedBy).to.equal('None recorded');
    expect(result.summary).to.equal('None recorded');
    expect(result.admittedBy).to.equal('None recorded');
    expect(result.admissionDate).to.equal('None recorded');
    expect(result.dischargedDate).to.equal('None recorded');
    expect(result.dateEntered).to.equal('None recorded');
    expect(result.dateSigned).to.equal('None recorded');
  });

  it('should handle invalid date formats gracefully', () => {
    const mockRecord = {
      id: 'test-id-789',
      attributes: {
        name: 'Test Note',
        noteType: 'Discharge Summary',
        date: 'invalid-date',
        admissionDate: 'not-a-date',
        dischargedDate: 'also-invalid',
        dateEntered: '',
        dateSigned: undefined,
        note: 'VGVzdA==', // Base64 for "Test"
      },
    };

    const result = convertUnifiedCareSummariesAndNotesRecord(mockRecord);

    expect(result.date).to.equal('None recorded');
    expect(result.admissionDate).to.equal('None recorded');
    expect(result.dischargedDate).to.equal('None recorded');
    expect(result.dateEntered).to.equal('None recorded');
    expect(result.dateSigned).to.equal('None recorded');
    expect(result.note).to.equal('Test');
  });

  it('should extract admittedBy from note content when ATTENDING field is present', () => {
    const noteWithAttending =
      'DICTATED BY: Dr. Smith    ATTENDING: Dr. Johnson         \nURGENCY: routine';
    const base64Note = btoa(noteWithAttending); // Convert to base64

    const mockRecord = {
      id: 'test-id-attending',
      attributes: {
        name: 'Discharge Summary',
        noteType: 'Discharge Summary',
        note: base64Note,
        writtenBy: 'Dr. Smith',
      },
    };

    const result = convertUnifiedCareSummariesAndNotesRecord(mockRecord);

    expect(result.admittedBy).to.equal('Dr. Johnson');
    expect(result.note).to.equal(noteWithAttending);
  });

  it('should handle UTC date format correctly', () => {
    const mockRecord = {
      id: 'test-utc',
      attributes: {
        name: 'UTC Test Note',
        date: '2025-07-29T17:32:46.000Z', // UTC format
        admissionDate: '2025-07-28T12:00:00.000Z',
        writtenBy: 'Dr. UTC',
      },
    };

    const result = convertUnifiedCareSummariesAndNotesRecord(mockRecord);

    expect(result.date).to.contain('July 29');
    expect(result.admissionDate).to.contain('July 28');
  });

  it('should handle timezone offset date format correctly', () => {
    const mockRecord = {
      id: 'test-tz',
      attributes: {
        name: 'Timezone Test Note',
        date: '2024-10-18T11:52:00+00:00', // Timezone offset format
        dischargedDate: '2024-10-19T14:30:00-05:00', // Different timezone
        writtenBy: 'Dr. Timezone',
      },
    };

    const result = convertUnifiedCareSummariesAndNotesRecord(mockRecord);

    expect(result.date).to.contain('October 18');
    expect(result.dischargedDate).to.contain('October 19');
  });
});

describe('careSummariesAndNotesReducer', () => {
  it('creates a list', () => {
    const response = {
      entry: [
        { resource: { type: { coding: [{ code: '18842-5' }] } } },
        { resource: { type: { coding: [{ code: '11506-3' }] } } },
        { resource: { type: { coding: [{ code: '11488-4' }] } } },
      ],
      resourceType: 'Bundle',
    };
    const newState = careSummariesAndNotesReducer(
      {},
      { type: Actions.CareSummariesAndNotes.GET_LIST, response },
    );
    expect(newState.careSummariesAndNotesList.length).to.equal(3);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('creates an empty list if "entry" is empty', () => {
    const response = {
      entry: [],
      resourceType: 'Bundle',
    };
    const newState = careSummariesAndNotesReducer(
      {},
      { type: Actions.CareSummariesAndNotes.GET_LIST, response },
    );
    expect(newState).to.deep.equal({
      listCurrentAsOf: null,
      listState: 'fetched',
      careSummariesAndNotesList: [],
      updatedList: undefined,
    });
  });

  it('creates an empty list if "entry" is not present', () => {
    const response = {
      resourceType: 'Bundle',
    };
    const newState = careSummariesAndNotesReducer(
      {},
      { type: Actions.CareSummariesAndNotes.GET_LIST, response },
    );
    expect(newState).to.deep.equal({
      listCurrentAsOf: null,
      listState: 'fetched',
      careSummariesAndNotesList: [],
      updatedList: undefined,
    });
  });

  it('puts updated records in updatedList', () => {
    const response = {
      entry: [
        { resource: { type: { coding: [{ code: '18842-5' }] } } },
        { resource: { type: { coding: [{ code: '11506-3' }] } } },
        { resource: { type: { coding: [{ code: '11488-4' }] } } },
      ],
      resourceType: 'Bundle',
    };
    const newState = careSummariesAndNotesReducer(
      {
        careSummariesAndNotesList: [
          { resource: { type: { coding: [{ code: '18842-5' }] } } },
          { resource: { type: { coding: [{ code: '11506-3' }] } } },
        ],
      },
      { type: Actions.CareSummariesAndNotes.GET_LIST, response },
    );
    expect(newState.careSummariesAndNotesList.length).to.equal(2);
    expect(newState.updatedList.length).to.equal(3);
  });

  it('moves updatedList into careSummariesAndNotesList on request', () => {
    const newState = careSummariesAndNotesReducer(
      {
        careSummariesAndNotesList: [
          { resource: { type: { coding: [{ code: '18842-5' }] } } },
        ],
        updatedList: [
          { resource: { type: { coding: [{ code: '18842-5' }] } } },
          { resource: { type: { coding: [{ code: '11506-3' }] } } },
        ],
      },
      { type: Actions.CareSummariesAndNotes.COPY_UPDATED_LIST },
    );
    expect(newState.careSummariesAndNotesList.length).to.equal(2);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('does not move updatedList into careSummariesAndNotesList if updatedList does not exist', () => {
    const newState = careSummariesAndNotesReducer(
      {
        careSummariesAndNotesList: [
          { resource: { type: { coding: [{ code: '18842-5' }] } } },
        ],
        updatedList: undefined,
      },
      { type: Actions.CareSummariesAndNotes.COPY_UPDATED_LIST },
    );
    expect(newState.careSummariesAndNotesList.length).to.equal(1);
    expect(newState.updatedList).to.equal(undefined);
  });

  it('sorts the list in descending date order, with nulls at the end', () => {
    const response = {
      entry: [
        {
          resource: {
            id: 1,
            type: { coding: [{ code: '18842-5' }] },
            context: {
              period: { start: '2022-08-01' },
            },
          },
        },
        {
          resource: { id: 'NULL1', type: { coding: [{ code: '18842-5' }] } },
        },
        {
          resource: {
            id: 3,
            type: { coding: [{ code: '11506-3' }] },
            date: '2022-08-03',
          },
        },
        {
          resource: { id: 'NULL2', type: { coding: [{ code: '11506-3' }] } },
        },
        {
          resource: {
            id: 2,
            type: { coding: [{ code: '18842-5' }] },
            date: '2022-08-02',
          },
        },
      ],
      resourceType: 'Bundle',
    };
    const newState = careSummariesAndNotesReducer(
      {},
      { type: Actions.CareSummariesAndNotes.GET_LIST, response },
    );
    expect(newState.careSummariesAndNotesList.map(rec => rec.id)).to.deep.equal(
      [3, 2, 1, 'NULL1', 'NULL2'],
    );
  });

  it('creates a unified list (GET_UNIFIED_LIST) with descending date order and sets current timestamp when isCurrent is true', () => {
    const response = {
      data: [
        {
          id: 'one',
          attributes: {
            name: 'First Note',
            noteType: 'consult',
            date: '2024-10-02T10:00:00Z',
            dateEntered: '2024-10-02T10:05:00Z',
          },
        },
        {
          id: 'two',
          attributes: {
            name: 'Second Note',
            noteType: 'consult',
            date: '2024-10-03T09:00:00Z',
            dateEntered: '2024-10-03T09:05:00Z',
          },
        },
        {
          id: 'three',
          attributes: {
            name: 'Third Note',
            noteType: 'consult',
            date: '2024-10-01T12:00:00Z',
            dateEntered: '2024-10-01T12:05:00Z',
          },
        },
      ],
    };
    const newState = careSummariesAndNotesReducer(
      {},
      {
        type: Actions.CareSummariesAndNotes.GET_UNIFIED_LIST,
        response,
        isCurrent: true,
      },
    );
    // Expect list ordered by descending date (ids: two, one, three)
    expect(newState.careSummariesAndNotesList.map(r => r.id)).to.deep.equal([
      'two',
      'one',
      'three',
    ]);
    expect(newState.listState).to.equal('fetched');
    expect(newState.listCurrentAsOf).to.be.an.instanceof(Date);
    // Verify one converted field (name preserved)
    expect(newState.careSummariesAndNotesList[0].name).to.equal('Second Note');
  });

  it('creates a unified list with listCurrentAsOf = null when isCurrent is false', () => {
    const response = {
      data: [
        {
          id: 'n1',
          attributes: {
            name: 'Note 1',
            noteType: 'consult',
            date: '2024-10-05T11:00:00Z',
          },
        },
      ],
    };
    const newState = careSummariesAndNotesReducer(
      {},
      {
        type: Actions.CareSummariesAndNotes.GET_UNIFIED_LIST,
        response,
        isCurrent: false,
      },
    );
    expect(newState.careSummariesAndNotesList.map(r => r.id)).to.deep.equal([
      'n1',
    ]);
    expect(newState.listCurrentAsOf).to.equal(null);
    expect(newState.listState).to.equal('fetched');
  });
});

describe('careSummariesAndNotesReducer warnings', () => {
  it('stores warnings on SET_WARNINGS', () => {
    const mockWarnings = [
      {
        source: 'oracle-health',
        message: 'Binary not found',
        resourceType: 'Binary',
      },
    ];
    const state = careSummariesAndNotesReducer(undefined, {
      type: Actions.CareSummariesAndNotes.SET_WARNINGS,
      payload: mockWarnings,
    });
    expect(state.warnings).to.deep.equal(mockWarnings);
  });

  it('defaults warnings to empty array when payload is undefined', () => {
    const state = careSummariesAndNotesReducer(undefined, {
      type: Actions.CareSummariesAndNotes.SET_WARNINGS,
      payload: undefined,
    });
    expect(state.warnings).to.deep.equal([]);
  });

  it('clears warnings when UPDATE_LIST_STATE dispatches FETCHING', () => {
    const prevState = {
      warnings: [{ source: 'oracle-health' }],
      listState: 'fetched',
    };
    const state = careSummariesAndNotesReducer(prevState, {
      type: Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
      payload: 'fetching',
    });
    expect(state.warnings).to.deep.equal([]);
  });

  it('preserves warnings when UPDATE_LIST_STATE dispatches FETCHED', () => {
    const prevState = {
      warnings: [{ source: 'oracle-health' }],
      listState: 'fetching',
    };
    const state = careSummariesAndNotesReducer(prevState, {
      type: Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
      payload: 'fetched',
    });
    expect(state.warnings).to.deep.equal([{ source: 'oracle-health' }]);
  });

  it('initializes with empty warnings array', () => {
    const state = careSummariesAndNotesReducer(undefined, { type: 'INIT' });
    expect(state.warnings).to.deep.equal([]);
  });
});
