import { expect } from 'chai';
import {
  getRecordType,
  convertCareSummariesAndNotesRecord,
  getDateSigned,
} from '../../reducers/careSummariesAndNotes';
import { noteTypes } from '../../util/constants';
import dischargeSummary from '../fixtures/dischargeSummary.json';
import progressNote from '../fixtures/physicianProcedureNote.json';
import consultResultNote from '../fixtures/consultResultNote.json';

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

describe('getDateSigned', () => {
  it('returns formatted date when extension array has an item with valueDateTime', () => {
    const mockRecord = {
      authenticator: {
        extension: [{ valueDateTime: '2024-02-07T15:41:47-05:00' }],
      },
    };
    const result = getDateSigned(mockRecord);
    expect(result).to.equal('February 7, 2024');
  });

  it('returns null when extension array is present but empty', () => {
    const mockRecord = {
      authenticator: {
        extension: [],
      },
    };
    const result = getDateSigned(mockRecord);
    expect(result).to.be.null;
  });

  it("returns null when extension array's first item lacks valueDateTime", () => {
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
