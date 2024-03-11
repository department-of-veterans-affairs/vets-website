import { expect } from 'chai';
import {
  careSummariesAndNotesReducer,
  convertCareSummariesAndNotesRecord,
  extractAuthenticator,
  extractAuthor,
  extractLocation,
  getAttending,
  getDateSigned,
  getNote,
  getRecordType,
  getTitle,
  getType,
} from '../../reducers/careSummariesAndNotes';
import { noteTypes } from '../../util/constants';
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
    expect(extractAuthenticator(record)).to.equal('SMITH,JOHN');
  });

  it('should return null if no "name" item contains a "text" field', () => {
    const badRec = {
      contained: [{ id: 'Provider-0', name: [{ ignore: 'the wrong object' }] }],
      authenticator: { reference: '#Provider-1' },
    };
    expect(extractAuthenticator(badRec)).to.be.null;
  });

  it('should return null if "name" is empty', () => {
    const badRec = {
      contained: [{ id: 'Provider-0', name: [] }],
      authenticator: { reference: '#Provider-1' },
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
    expect(extractAuthor(record)).to.equal('SMITH,JANE');
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

  it('returns null when the date is invalid', () => {
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
});

describe('convertCareSummariesAndNotesRecord', () => {
  it('should properly convert discharge summaries', () => {
    const note = convertCareSummariesAndNotesRecord(dischargeSummary);
    expect(note.type).to.equal('18842-5');
    expect(note.admissionDate).to.be.not.null;
    expect(note.dischargeDate).to.be.not.null;
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
    expect(newState).to.deep.equal({ careSummariesAndNotesList: [] });
  });

  it('creates an empty list if "entry" is not present', () => {
    const response = {
      resourceType: 'Bundle',
    };
    const newState = careSummariesAndNotesReducer(
      {},
      { type: Actions.CareSummariesAndNotes.GET_LIST, response },
    );
    expect(newState).to.deep.equal({ careSummariesAndNotesList: [] });
  });
});
