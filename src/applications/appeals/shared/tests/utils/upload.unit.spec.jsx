import { expect } from 'chai';

import {
  createPayload,
  parseResponse,
  MAX_FILE_NAME_LENGTH,
  checkIsFileNameTooLong,
  hasSomeUploading,
  checkUploadVisibility,
  createContent,
} from '../../utils/upload';

describe('createPayload', () => {
  it('should return a form data object with file only', () => {
    const file = 'mock-file';
    const result = createPayload(file);
    expect(
      result.getAll('decision_review_evidence_attachment[file_data]'),
    ).to.deep.equal(['mock-file']);
    expect(
      result.getAll('decision_review_evidence_attachment[password]'),
    ).to.deep.equal([]);
  });
  it('should return a form data object with file & password', () => {
    const file = 'mock-file';
    const password = '1234';
    const result = createPayload(file, '', password);
    expect(
      result.getAll('decision_review_evidence_attachment[file_data]'),
    ).to.deep.equal(['mock-file']);
    expect(
      result.getAll('decision_review_evidence_attachment[password]'),
    ).to.deep.equal(['1234']);
  });
});

// Currently only used by 10182 (NOD)
describe('parseResponse', () => {
  it('should return parsed file name & confirmation code', () => {
    const result = parseResponse(
      { data: { attributes: { guid: 'uuid-1234' } } },
      { name: 'test-file.pdf', size: 100000 },
    );
    expect(result).to.deep.equal({
      name: 'test-file.pdf',
      size: 100000,
      confirmationCode: 'uuid-1234',
      attachmentId: '',
    });
  });
});

describe('checkIsFileNameTooLong', () => {
  it('should return false for file names under the size limit', () => {
    expect(checkIsFileNameTooLong()).to.be.false;
    expect(checkIsFileNameTooLong('')).to.be.false;
    expect(checkIsFileNameTooLong('abcd')).to.be.false;
    expect(checkIsFileNameTooLong('a'.repeat(MAX_FILE_NAME_LENGTH / 2))).to.be
      .false;
    expect(checkIsFileNameTooLong('a'.repeat(MAX_FILE_NAME_LENGTH - 1))).to.be
      .false;
  });
  it('should return true for file names over the size limit', () => {
    expect(checkIsFileNameTooLong('a'.repeat(MAX_FILE_NAME_LENGTH + 1))).to.be
      .true;
    expect(checkIsFileNameTooLong('a'.repeat(MAX_FILE_NAME_LENGTH * 2))).to.be
      .true;
  });
});

describe('hasSomeUploading', () => {
  it('should return false if no files are uploading', () => {
    expect(hasSomeUploading([])).to.be.false;
    expect(hasSomeUploading([{}])).to.be.false;
    expect(hasSomeUploading([{ uploading: false }])).to.be.false;
    expect(hasSomeUploading([{}, { uploading: false }])).to.be.false;
    expect(hasSomeUploading([{}, {}, { uploading: false }])).to.be.false;
    expect(hasSomeUploading([{}, { uploading: false }, {}])).to.be.false;
  });
  it('should return true if at least one file is uploading', () => {
    expect(hasSomeUploading([{ uploading: true }])).to.be.true;
    expect(hasSomeUploading([{}, { uploading: true }])).to.be.true;
    expect(hasSomeUploading([{ uploading: false }, { uploading: true }])).to.be
      .true;
    expect(
      hasSomeUploading([{}, {}, { uploading: true }, { uplloading: false }]),
    ).to.be.true;
    expect(hasSomeUploading([{}, {}, {}, { uploading: true }, {}])).to.be.true;
  });
});

describe('checkUploadVisibility', () => {
  it('should return true if there are no file errors', () => {
    expect(checkUploadVisibility([{}], {})).to.be.true;
    expect(checkUploadVisibility([{}, {}], {})).to.be.true;
    expect(checkUploadVisibility([{}], { 1: { __errors: [] } })).to.be.true;
    expect(checkUploadVisibility([{ errorMessage: '' }], {})).to.be.true;
  });
  it('should return false if there are any file errors', () => {
    expect(checkUploadVisibility([{ errorMessage: 'Doh' }], {})).to.be.false;
    expect(checkUploadVisibility([{}, { errorMessage: '2' }], {})).to.be.false;
    expect(checkUploadVisibility([{ errorMessage: 'x' }, {}], {})).to.be.false;
    expect(checkUploadVisibility([{}, {}], { 1: { __errors: ['x'] } })).to.be
      .false;
    expect(
      checkUploadVisibility([{}, {}, { errorMessage: 'Doh' }], {
        2: { __errors: ['y'] },
      }),
    ).to.be.false;
  });
});

describe('createContent', () => {
  const content = createContent();
  it('should return modal content with unknown file name', () => {
    const result = content.modalContent().props.children[1].props.children;
    expect(result).to.eq('Unknown');
  });
});
