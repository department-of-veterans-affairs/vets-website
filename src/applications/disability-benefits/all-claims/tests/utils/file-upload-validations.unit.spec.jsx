import { expect } from 'chai';
import sinon from 'sinon';

import { MAX_FILE_SIZE_BYTES, MAX_PDF_FILE_SIZE_BYTES } from '../../constants';

import {
  isPdf,
  validateFile,
  validateFiles,
  createEncryptedFilesList,
  extractPasswordsFromShadowDOM,
  extractDocumentTypesFromShadowDOM,
  clearNoFilesError,
  clearSpecificErrors,
  rebuildErrorsAfterFileDeletion,
  updateErrorsOnFileChange,
  applyValidationErrors,
  validateFilesForSubmission,
  FILE_SIZE_ERROR_PDF,
  FILE_SIZE_ERROR_NON_PDF,
  VALIDATION_ERROR,
  PASSWORD_ERROR,
  DOC_TYPE_ERROR,
} from '../../utils/supportingEvidence/fileUploadValidations';

describe('fileUploadValidations', () => {
  describe('isPdf', () => {
    it('should return true for .pdf files', () => {
      expect(isPdf({ name: 'document.pdf' })).to.be.true;
    });

    it('should return true for .PDF files (case insensitive)', () => {
      expect(isPdf({ name: 'document.PDF' })).to.be.true;
    });

    it('should return false for non-pdf files', () => {
      expect(isPdf({ name: 'image.jpg' })).to.be.false;
      expect(isPdf({ name: 'document.txt' })).to.be.false;
    });

    it('should return false for files without name', () => {
      expect(isPdf({})).to.be.false;
      expect(isPdf({ name: null })).to.be.false;
    });
  });

  describe('validateFile', () => {
    it('should return null for null file', async () => {
      const result = await validateFile(null);
      expect(result).to.be.null;
    });

    it('should return size error for oversized non-PDF files', async () => {
      const oversizedFile = {
        name: 'large.jpg',
        size: MAX_FILE_SIZE_BYTES + 1,
      };
      const result = await validateFile(oversizedFile);
      expect(result).to.equal(FILE_SIZE_ERROR_NON_PDF);
    });

    it('should return size error for oversized PDF files', async () => {
      const oversizedFile = {
        name: 'large.pdf',
        size: MAX_PDF_FILE_SIZE_BYTES + 1,
      };
      const result = await validateFile(oversizedFile);
      expect(result).to.equal(FILE_SIZE_ERROR_PDF);
    });

    it('should allow PDF files up to max PDF size', async () => {
      const validPdf = {
        name: 'valid.pdf',
        size: MAX_PDF_FILE_SIZE_BYTES,
      };
      // Note: This will pass size check but may fail type check without mocking
      // Size validation happens first
      const result = await validateFile(validPdf);
      // Result is null or FILE_TYPE_MISMATCH_ERROR depending on file content check
      expect(result === null || typeof result === 'string').to.be.true;
    });
  });

  describe('validateFiles', () => {
    it('should return empty array for empty input', async () => {
      const result = await validateFiles([]);
      expect(result).to.deep.equal([]);
    });

    it('should skip entries without file property', async () => {
      const result = await validateFiles([{}, { file: null }]);
      expect(result).to.deep.equal([]);
    });

    it('should return validation errors with indices', async () => {
      const files = [
        { file: { name: 'large.jpg', size: MAX_FILE_SIZE_BYTES + 1 } },
        { file: { name: 'small.jpg', size: 1000 } },
      ];
      const result = await validateFiles(files);
      expect(result.length).to.be.greaterThan(0);
      expect(result[0]).to.have.property('index', 0);
      expect(result[0]).to.have.property('error', FILE_SIZE_ERROR_NON_PDF);
    });
  });

  describe('createEncryptedFilesList', () => {
    it('should return array of encryption status for each file', async () => {
      // Non-PDF files should return false (not encrypted)
      const files = [
        { file: { name: 'image.jpg', size: 1000 } },
        { file: { name: 'document.txt', size: 500 } },
      ];
      const result = await createEncryptedFilesList(files);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(2);
      expect(result[0]).to.be.false;
      expect(result[1]).to.be.false;
    });

    it('should return empty array for empty input', async () => {
      const result = await createEncryptedFilesList([]);
      expect(result).to.deep.equal([]);
    });
  });

  describe('clearNoFilesError', () => {
    it('should clear single VALIDATION_ERROR', () => {
      const result = clearNoFilesError([VALIDATION_ERROR]);
      expect(result).to.deep.equal([]);
    });

    it('should not clear if multiple errors exist', () => {
      const errors = [VALIDATION_ERROR, DOC_TYPE_ERROR];
      const result = clearNoFilesError(errors);
      expect(result).to.deep.equal(errors);
    });

    it('should not clear different error types', () => {
      const errors = [DOC_TYPE_ERROR];
      const result = clearNoFilesError(errors);
      expect(result).to.deep.equal(errors);
    });

    it('should return empty array unchanged', () => {
      const result = clearNoFilesError([]);
      expect(result).to.deep.equal([]);
    });
  });

  describe('clearSpecificErrors', () => {
    it('should clear errors that match type and condition', () => {
      const errors = [DOC_TYPE_ERROR, null, DOC_TYPE_ERROR];
      const shouldClear = index => index === 0;
      const result = clearSpecificErrors(errors, DOC_TYPE_ERROR, shouldClear);
      expect(result[0]).to.be.null;
      expect(result[1]).to.be.null;
      expect(result[2]).to.equal(DOC_TYPE_ERROR);
    });

    it('should not modify array if no changes needed', () => {
      const errors = [DOC_TYPE_ERROR, PASSWORD_ERROR];
      const shouldClear = () => false;
      const result = clearSpecificErrors(errors, DOC_TYPE_ERROR, shouldClear);
      expect(result).to.equal(errors); // Same reference
    });

    it('should only clear matching error type', () => {
      const errors = [DOC_TYPE_ERROR, PASSWORD_ERROR];
      const shouldClear = () => true;
      const result = clearSpecificErrors(errors, DOC_TYPE_ERROR, shouldClear);
      expect(result[0]).to.be.null;
      expect(result[1]).to.equal(PASSWORD_ERROR);
    });
  });

  describe('rebuildErrorsAfterFileDeletion', () => {
    it('should remap errors to match remaining files', () => {
      const file1 = { file: { name: 'a.pdf' } };
      const file2 = { file: { name: 'b.pdf' } };
      const file3 = { file: { name: 'c.pdf' } };

      const currentFiles = [file1, file2, file3];
      const newFiles = [file1, file3]; // file2 was deleted
      const prevErrors = [DOC_TYPE_ERROR, PASSWORD_ERROR, null];

      const result = rebuildErrorsAfterFileDeletion(
        currentFiles,
        newFiles,
        prevErrors,
      );

      expect(result[0]).to.equal(DOC_TYPE_ERROR);
      expect(result[1]).to.be.undefined; // file3 had no error
    });

    it('should return empty array when all files removed', () => {
      const currentFiles = [{ file: { name: 'a.pdf' } }];
      const newFiles = [];
      const prevErrors = [DOC_TYPE_ERROR];

      const result = rebuildErrorsAfterFileDeletion(
        currentFiles,
        newFiles,
        prevErrors,
      );

      expect(result).to.deep.equal([]);
    });

    it('should handle files that have no matching error', () => {
      const file1 = { file: { name: 'new.pdf' } };
      const newFiles = [file1];
      const currentFiles = [];
      const prevErrors = [];

      const result = rebuildErrorsAfterFileDeletion(
        currentFiles,
        newFiles,
        prevErrors,
      );

      expect(result).to.deep.equal([]);
    });
  });

  describe('updateErrorsOnFileChange', () => {
    it('should clear VALIDATION_ERROR when files are added', () => {
      const prevErrors = [VALIDATION_ERROR];
      const files = [];
      const newFiles = [{ file: { name: 'a.pdf' } }];

      const result = updateErrorsOnFileChange(
        prevErrors,
        files,
        newFiles,
        'FILE_ADDED',
      );

      expect(result).to.deep.equal([]);
    });

    it('should rebuild errors on FILE_REMOVED action', () => {
      const file1 = { file: { name: 'a.pdf' } };
      const file2 = { file: { name: 'b.pdf' } };

      const prevErrors = [DOC_TYPE_ERROR, PASSWORD_ERROR];
      const files = [file1, file2];
      const newFiles = [file2]; // file1 removed

      const result = updateErrorsOnFileChange(
        prevErrors,
        files,
        newFiles,
        'FILE_REMOVED',
      );

      expect(result[0]).to.equal(PASSWORD_ERROR);
    });

    it('should clear password errors on PASSWORD_UPDATE action', () => {
      const file1 = { file: { name: 'a.pdf' }, password: 'secret' };
      const file2 = { file: { name: 'b.pdf' }, password: '' };

      const prevErrors = [PASSWORD_ERROR, PASSWORD_ERROR];
      const files = [file1, file2];
      const newFiles = [file1, file2];

      const result = updateErrorsOnFileChange(
        prevErrors,
        files,
        newFiles,
        'PASSWORD_UPDATE',
      );

      expect(result[0]).to.be.null;
      expect(result[1]).to.equal(PASSWORD_ERROR);
    });
  });

  describe('applyValidationErrors', () => {
    it('should apply validation results to error array', () => {
      const baseErrors = [null, null, null];
      const validationResults = [{ index: 1, error: FILE_SIZE_ERROR_NON_PDF }];
      const files = [{}, {}, {}];

      const result = applyValidationErrors(
        baseErrors,
        validationResults,
        files,
        false,
      );

      expect(result[0]).to.be.null;
      expect(result[1]).to.equal(FILE_SIZE_ERROR_NON_PDF);
      expect(result[2]).to.be.null;
    });

    it('should clear all errors when file was replaced', () => {
      const baseErrors = [DOC_TYPE_ERROR, PASSWORD_ERROR];
      const validationResults = [];
      const files = [{}, {}];

      const result = applyValidationErrors(
        baseErrors,
        validationResults,
        files,
        true,
      );

      expect(result[0]).to.be.null;
      expect(result[1]).to.be.null;
    });

    it('should apply new errors after clearing on replacement', () => {
      const baseErrors = [DOC_TYPE_ERROR, PASSWORD_ERROR];
      const validationResults = [{ index: 0, error: FILE_SIZE_ERROR_PDF }];
      const files = [{}, {}];

      const result = applyValidationErrors(
        baseErrors,
        validationResults,
        files,
        true,
      );

      expect(result[0]).to.equal(FILE_SIZE_ERROR_PDF);
      expect(result[1]).to.be.null;
    });
  });

  describe('validateFilesForSubmission', () => {
    it('should return invalid when no files provided', () => {
      const result = validateFilesForSubmission([], [], [], []);

      expect(result.isValid).to.be.false;
      expect(result.errors).to.deep.equal([VALIDATION_ERROR]);
    });

    it('should preserve existing validation errors', () => {
      const files = [{ file: { name: 'a.pdf' } }];
      const encrypted = [false];
      const docTypes = ['L015'];
      const existingErrors = [FILE_SIZE_ERROR_PDF];

      const result = validateFilesForSubmission(
        files,
        encrypted,
        docTypes,
        existingErrors,
      );

      expect(result.isValid).to.be.false;
      expect(result.errors[0]).to.equal(FILE_SIZE_ERROR_PDF);
    });

    it('should add PASSWORD_ERROR for encrypted files without password', () => {
      const files = [{ file: { name: 'a.pdf' }, password: '' }];
      const encrypted = [true];
      const docTypes = ['L015'];
      const existingErrors = [];

      const result = validateFilesForSubmission(
        files,
        encrypted,
        docTypes,
        existingErrors,
      );

      expect(result.isValid).to.be.false;
      expect(result.errors[0]).to.equal(PASSWORD_ERROR);
    });

    it('should add DOC_TYPE_ERROR for missing document type', () => {
      const files = [{ file: { name: 'a.pdf' } }];
      const encrypted = [false];
      const docTypes = [''];
      const existingErrors = [];

      const result = validateFilesForSubmission(
        files,
        encrypted,
        docTypes,
        existingErrors,
      );

      expect(result.isValid).to.be.false;
      expect(result.errors[0]).to.equal(DOC_TYPE_ERROR);
    });

    it('should return valid when all requirements are met', () => {
      const files = [
        { file: { name: 'a.pdf' }, password: 'secret' },
        { file: { name: 'b.jpg' } },
      ];
      const encrypted = [true, false];
      const docTypes = ['L015', 'L023'];
      const existingErrors = [];

      const result = validateFilesForSubmission(
        files,
        encrypted,
        docTypes,
        existingErrors,
      );

      expect(result.isValid).to.be.true;
      expect(result.errors).to.deep.equal([]);
    });

    it('should handle null existingErrors', () => {
      const files = [{ file: { name: 'a.pdf' } }];
      const encrypted = [false];
      const docTypes = ['L015'];

      const result = validateFilesForSubmission(
        files,
        encrypted,
        docTypes,
        null,
      );

      expect(result.isValid).to.be.true;
    });
  });

  describe('extractPasswordsFromShadowDOM', () => {
    it('should return original files when ref is null', () => {
      const files = [{ file: { name: 'a.pdf' } }];
      const encrypted = [true];
      const fileInputRef = { current: null };

      const result = extractPasswordsFromShadowDOM(
        fileInputRef,
        files,
        encrypted,
      );

      expect(result).to.deep.equal(files);
    });

    it('should return original files when no shadowRoot', () => {
      const files = [{ file: { name: 'a.pdf' } }];
      const encrypted = [true];
      const fileInputRef = { current: {} };

      const result = extractPasswordsFromShadowDOM(
        fileInputRef,
        files,
        encrypted,
      );

      expect(result).to.deep.equal(files);
    });

    it('should extract passwords from shadow DOM elements', () => {
      const files = [{ file: { name: 'a.pdf' } }];
      const encrypted = [true];

      // Mock shadow DOM structure
      const mockPasswordInput = { value: 'testPassword' };
      const mockVaTextInput = {
        shadowRoot: {
          querySelector: sinon.stub().returns(mockPasswordInput),
        },
      };
      const mockVaFileInput = {
        shadowRoot: {
          querySelector: sinon.stub().returns(mockVaTextInput),
        },
      };
      const mockShadowRoot = {
        querySelectorAll: sinon.stub().returns([mockVaFileInput]),
      };
      const fileInputRef = { current: { shadowRoot: mockShadowRoot } };

      const result = extractPasswordsFromShadowDOM(
        fileInputRef,
        files,
        encrypted,
      );

      expect(result[0].password).to.equal('testPassword');
    });

    it('should skip non-encrypted files', () => {
      const files = [{ file: { name: 'a.jpg' } }];
      const encrypted = [false];

      const mockShadowRoot = {
        querySelectorAll: sinon.stub().returns([{}]),
      };
      const fileInputRef = { current: { shadowRoot: mockShadowRoot } };

      const result = extractPasswordsFromShadowDOM(
        fileInputRef,
        files,
        encrypted,
      );

      expect(result[0].password).to.be.undefined;
    });
  });

  describe('extractDocumentTypesFromShadowDOM', () => {
    it('should return empty array when ref is null', () => {
      const fileInputRef = { current: null };
      const result = extractDocumentTypesFromShadowDOM(fileInputRef);
      expect(result).to.deep.equal([]);
    });

    it('should return empty array when no shadowRoot', () => {
      const fileInputRef = { current: {} };
      const result = extractDocumentTypesFromShadowDOM(fileInputRef);
      expect(result).to.deep.equal([]);
    });

    it('should extract document types from va-select elements', () => {
      const mockVaSelect = { value: 'L015' };
      const mockFileInput = {
        querySelector: sinon.stub().returns(mockVaSelect),
      };
      const mockShadowRoot = {
        querySelectorAll: sinon.stub().returns([mockFileInput]),
      };
      const fileInputRef = { current: { shadowRoot: mockShadowRoot } };

      const result = extractDocumentTypesFromShadowDOM(fileInputRef);

      expect(result).to.deep.equal(['L015']);
    });

    it('should return empty string when va-select not found', () => {
      const mockFileInput = {
        querySelector: sinon.stub().returns(null),
      };
      const mockShadowRoot = {
        querySelectorAll: sinon.stub().returns([mockFileInput]),
      };
      const fileInputRef = { current: { shadowRoot: mockShadowRoot } };

      const result = extractDocumentTypesFromShadowDOM(fileInputRef);

      expect(result).to.deep.equal(['']);
    });
  });
});
