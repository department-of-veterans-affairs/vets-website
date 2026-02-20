import { expect } from 'chai';
import sinon from 'sinon';

import {
  base64ToPdfObjectUrl,
  buildPdfObjectUrls,
  revokeObjectUrls,
  avsIsValid,
  avsHasData,
  avsIsReady,
  separateFetchableAvsPdfs,
} from './avs';
import { AMBULATORY_PATIENT_SUMMARY } from './constants';

describe('VAOS Utils: AVS', () => {
  let sandbox;
  let originalCreateObjectURL;
  let originalRevokeObjectURL;
  let originalAtob;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    originalAtob = global.atob;
  });

  afterEach(() => {
    // Restore potential globals if replaced
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    if (originalAtob) {
      global.atob = originalAtob;
    } else {
      delete global.atob;
    }
    sandbox.restore();
  });

  it('base64ToPdfObjectUrl returns object URL for valid base64 decode', () => {
    // Arrange
    const createStub = sandbox.stub(URL, 'createObjectURL').returns('blob:ok');

    global.atob = sandbox.stub().returns('%PDF-1.4\nMOCK');

    // Act
    const url = base64ToPdfObjectUrl('JVBERi0xLjQK');

    // Assert
    expect(url).to.equal('blob:ok');
    expect(createStub.calledOnce).to.be.true;
  });

  it('base64ToPdfObjectUrl returns null when decode fails', () => {
    // Arrange
    const createStub = sandbox.stub(URL, 'createObjectURL');
    global.atob = sandbox.stub().throws(new Error('bad base64'));

    // Act
    const url = base64ToPdfObjectUrl('not-base64');

    // Assert
    expect(url).to.equal(null);
    expect(createStub.called).to.be.false;
  });

  it('buildPdfObjectUrls maps files to object URLs', () => {
    // Arrange
    const createStub = sandbox.stub(URL, 'createObjectURL');
    createStub.onFirstCall().returns('blob:a');
    createStub.onSecondCall().returns('blob:b');
    global.atob = sandbox.stub().returns('%PDF-1.4\nMOCK');
    const files = [
      { binary: 'AAA', contentType: 'application/pdf' },
      { binary: 'BBB', contentType: 'application/pdf' },
    ];

    // Act
    const urls = buildPdfObjectUrls(files);

    // Assert
    expect(urls).to.deep.equal(['blob:a', 'blob:b']);
    expect(createStub.callCount).to.equal(2);
  });

  it('revokeObjectUrls revokes only truthy URLs', () => {
    // Arrange
    const revokeStub = sandbox.stub(URL, 'revokeObjectURL');
    const urls = ['blob:1', null, undefined, ''];

    // Act
    revokeObjectUrls(urls);

    // Assert
    expect(revokeStub.callCount).to.equal(1);
    expect(revokeStub.calledWith('blob:1')).to.be.true;
  });

  describe('avsIsValid', () => {
    it('should return true when object has noteType and id', () => {
      const obj = {
        noteType: AMBULATORY_PATIENT_SUMMARY,
        id: '123',
      };
      expect(avsIsValid(obj)).to.be.true;
    });

    it('should return false when noteType is not ambulatory_patient_summary', () => {
      const obj = {
        noteType: 'some_other_type',
        id: '123',
      };
      expect(avsIsValid(obj)).to.be.false;
    });

    it('should return false when noteType is missing', () => {
      const obj = { id: '123' };
      expect(avsIsValid(obj)).to.be.false;
    });

    it('should return false when id is missing', () => {
      const obj = { noteType: AMBULATORY_PATIENT_SUMMARY };
      expect(avsIsValid(obj)).to.be.false;
    });

    it('should return false for null or undefined', () => {
      expect(avsIsValid(null)).to.be.false;
      expect(avsIsValid(undefined)).to.be.false;
    });

    it('should return false for empty object', () => {
      expect(avsIsValid({})).to.be.false;
    });
  });

  describe('avsHasData', () => {
    it('should return true when binary is present', () => {
      const obj = { binary: 'base64data' };
      expect(avsHasData(obj)).to.be.true;
    });

    it('should return true when error is present', () => {
      const obj = { error: 'fetch failed' };
      expect(avsHasData(obj)).to.be.true;
    });

    it('should return true when both binary and error present', () => {
      const obj = { binary: 'base64data', error: 'some error' };
      expect(avsHasData(obj)).to.be.true;
    });

    it('should return false when neither binary nor error present', () => {
      const obj = { noteType: AMBULATORY_PATIENT_SUMMARY, id: '123' };
      expect(avsHasData(obj)).to.be.false;
    });

    it('should return false for null or undefined', () => {
      expect(avsHasData(null)).to.be.false;
      expect(avsHasData(undefined)).to.be.false;
    });

    it('should return false for empty object', () => {
      expect(avsHasData({})).to.be.false;
    });
  });

  describe('avsIsReady', () => {
    it('should return true when object is valid and has binary', () => {
      const obj = {
        noteType: AMBULATORY_PATIENT_SUMMARY,
        id: '123',
        binary: 'base64data',
      };
      expect(avsIsReady(obj)).to.be.true;
    });

    it('should return true when object is valid and has error', () => {
      const obj = {
        noteType: AMBULATORY_PATIENT_SUMMARY,
        id: '123',
        error: 'fetch failed',
      };
      expect(avsIsReady(obj)).to.be.true;
    });

    it('should return false when valid but no data', () => {
      const obj = { noteType: AMBULATORY_PATIENT_SUMMARY, id: '123' };
      expect(avsIsReady(obj)).to.be.false;
    });

    it('should return false when has data but invalid noteType', () => {
      const obj = { noteType: 'wrong_type', id: '123', binary: 'base64data' };
      expect(avsIsReady(obj)).to.be.false;
    });

    it('should return false when has data but missing id', () => {
      const obj = {
        noteType: AMBULATORY_PATIENT_SUMMARY,
        binary: 'base64data',
      };
      expect(avsIsReady(obj)).to.be.false;
    });

    it('should return false for null or undefined', () => {
      expect(avsIsReady(null)).to.be.false;
      expect(avsIsReady(undefined)).to.be.false;
    });

    it('should return false for empty object', () => {
      expect(avsIsReady({})).to.be.false;
    });
  });

  describe('separateFetchableAvsPdfs', () => {
    it('should separate PDFs into toFetch and doNotFetch', () => {
      const avsPdf = [
        {
          id: '1',
          noteType: AMBULATORY_PATIENT_SUMMARY,
        },
        {
          id: '2',
          noteType: AMBULATORY_PATIENT_SUMMARY,
          binary: 'already-has-binary',
        },
        {
          id: '3',
          noteType: 'wrong_type',
        },
      ];

      const result = separateFetchableAvsPdfs(avsPdf);

      expect(result.toFetch).to.have.lengthOf(1);
      expect(result.toFetch[0].id).to.equal('1');
      expect(result.doNotFetch).to.have.lengthOf(2);
    });

    it('should handle empty array', () => {
      const result = separateFetchableAvsPdfs([]);

      expect(result.toFetch).to.be.an('array').that.is.empty;
      expect(result.doNotFetch).to.be.an('array').that.is.empty;
    });

    it('should handle null input', () => {
      const result = separateFetchableAvsPdfs(null);

      expect(result.toFetch).to.be.an('array').that.is.empty;
      expect(result.doNotFetch).to.be.an('array').that.is.empty;
    });

    it('should put all valid PDFs without binary/error in toFetch', () => {
      const avsPdf = [
        { id: '1', noteType: AMBULATORY_PATIENT_SUMMARY },
        { id: '2', noteType: AMBULATORY_PATIENT_SUMMARY },
        { id: '3', noteType: AMBULATORY_PATIENT_SUMMARY },
      ];

      const result = separateFetchableAvsPdfs(avsPdf);

      expect(result.toFetch).to.have.lengthOf(3);
      expect(result.doNotFetch).to.have.lengthOf(0);
    });

    it('should put PDFs with binary in doNotFetch', () => {
      const avsPdf = [
        { id: '1', noteType: AMBULATORY_PATIENT_SUMMARY, binary: 'binary1' },
        { id: '2', noteType: AMBULATORY_PATIENT_SUMMARY, binary: 'binary2' },
      ];

      const result = separateFetchableAvsPdfs(avsPdf);

      expect(result.toFetch).to.have.lengthOf(0);
      expect(result.doNotFetch).to.have.lengthOf(2);
    });

    it('should put PDFs with error in doNotFetch', () => {
      const avsPdf = [
        { id: '1', noteType: AMBULATORY_PATIENT_SUMMARY, error: 'Error 1' },
        { id: '2', noteType: AMBULATORY_PATIENT_SUMMARY, error: 'Error 2' },
      ];

      const result = separateFetchableAvsPdfs(avsPdf);

      expect(result.toFetch).to.have.lengthOf(0);
      expect(result.doNotFetch).to.have.lengthOf(2);
    });

    it('should put PDFs with wrong noteType in doNotFetch', () => {
      const avsPdf = [
        { id: '1', noteType: 'wrong_type' },
        { id: '2', noteType: 'pharmacology_discharge_summary' },
      ];

      const result = separateFetchableAvsPdfs(avsPdf);

      expect(result.toFetch).to.have.lengthOf(0);
      expect(result.doNotFetch).to.have.lengthOf(2);
    });

    it('should preserve all properties of PDF objects', () => {
      const avsPdf = [
        {
          id: '1',
          noteType: AMBULATORY_PATIENT_SUMMARY,
          apptId: 'APPT_123',
          name: 'Test AVS',
          customField: 'custom-value',
        },
      ];

      const result = separateFetchableAvsPdfs(avsPdf);

      expect(result.toFetch[0]).to.deep.equal(avsPdf[0]);
      expect(result.toFetch[0].customField).to.equal('custom-value');
    });
  });
});
