import { expect } from 'chai';

import {
  isValidFileSize,
  isValidFileType,
  isValidFile,
  isValidDocument,
  MAX_FILE_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
} from '../../utils/validations';

const validPdfSize =
  MAX_FILE_SIZE_BYTES + (MAX_PDF_SIZE_BYTES - MAX_FILE_SIZE_BYTES) / 2;

describe('Claims status validation:', () => {
  describe('isValidFileSize', () => {
    it('should validate size is less than max', () => {
      const result = isValidFileSize({ size: 10 });
      expect(result).to.be.true;
    });

    it('should invalidate size is greater than max', () => {
      const result = isValidFileSize({ size: MAX_PDF_SIZE_BYTES + 100 });
      expect(result).to.be.false;
    });

    it('should validate PDF size is less than max', () => {
      const result = isValidFileSize({ name: 'test.pdf', size: validPdfSize });
      expect(result).to.be.true;
    });

    it('should invalidate PDF size is greater than max', () => {
      const invalidSize = MAX_PDF_SIZE_BYTES;
      const result = isValidFileSize({ name: 'test.pdf', size: invalidSize });
      expect(result).to.be.false;
    });
  });
  describe('isValidFileType', () => {
    it('should check that file has a valid type', () => {
      const result = isValidFileType({
        name: 'testing.jpg',
      });

      expect(result).to.be.true;
    });
    it('should check that file has an invalid type', () => {
      const result = isValidFileType({
        name: 'testing.exe',
      });

      expect(result).to.be.false;
    });
    it('should check that file has a valid type regardless of case', () => {
      const result = isValidFileType({
        name: 'testing.JPG',
      });

      expect(result).to.be.true;
    });
  });
  describe('isValidFile', () => {
    it('should validate file for size and type', () => {
      const result = isValidFile({
        name: 'testing.jpg',
        size: 10,
      });

      expect(result).to.be.true;
    });
    it('should not validate empty file', () => {
      const result = isValidFile();

      expect(result).to.be.false;
    });
    it('should validate file for size and type', () => {
      const result = isValidFile({ name: 'testing.pdf', size: validPdfSize });

      expect(result).to.be.true;
    });
  });
  describe('isValidDocument', () => {
    it('should validate that docType is not blank', () => {
      const result = isValidDocument({
        file: {
          name: 'test.jpg',
          size: 10,
        },
        docType: {
          value: '',
        },
      });

      expect(result).to.be.false;
    });
    it('should validate that docType and file are valid', () => {
      const result = isValidDocument({
        file: {
          name: 'test.jpg',
          size: 10,
        },
        docType: {
          value: 'L101',
        },
      });

      expect(result).to.be.true;
    });
  });
});
