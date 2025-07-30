import { expect } from 'chai';
import { validateFileField } from '../../utils/upload';

describe('validateFileField', () => {
  let errors;

  beforeEach(() => {
    errors = [];
  });

  it('clears errors for valid pdf under size limit', () => {
    const fileList = [
      { file: { type: 'application/pdf' }, size: 50 * 1024 * 1024 },
    ];
    validateFileField(errors, fileList);
    expect(errors[0].__errors).to.deep.equal([]);
  });

  it('sets error for pdf over size limit', () => {
    const fileList = [
      { file: { type: 'application/pdf' }, size: 100 * 1024 * 1024 },
    ];
    validateFileField(errors, fileList);
    expect(errors[0].__errors[0]).to.match(/couldn't upload/);
  });

  it('clears errors for valid jpg under size limit', () => {
    const fileList = [{ file: { type: 'image/jpg' }, size: 10 * 1024 * 1024 }];
    validateFileField(errors, fileList);
    expect(errors[0].__errors).to.deep.equal([]);
  });

  it('sets error for jpg over size limit', () => {
    const fileList = [{ file: { type: 'image/jpg' }, size: 50 * 1024 * 1024 }];
    validateFileField(errors, fileList);
    expect(errors[0].__errors[0]).to.match(/couldn't upload/);
  });

  it('sets error for invalid file type', () => {
    const fileList = [{ file: { type: 'text/plain' }, size: 10 * 1024 * 1024 }];
    validateFileField(errors, fileList);
    expect(errors[0].__errors[0]).to.match(/extension doesn't match/);
  });
});
