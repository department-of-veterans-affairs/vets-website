import { expect } from 'chai';

import {
  validateFile,
  validateFiles,
  isPdf,
  FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
  FILE_SIZE_ERROR_PDF,
  FILE_SIZE_ERROR_NON_PDF,
} from '../../utils/validations';

// Helper to create mock files
const createMockFile = (name, size) => ({
  name,
  size,
  type: name.includes('.pdf') ? 'application/pdf' : 'image/jpeg',
});

describe('Claims status validation:', () => {
  describe('FILE_TYPES constant', () => {
    it('should contain expected file types', () => {
      expect(FILE_TYPES).to.deep.equal([
        'pdf',
        'gif',
        'jpeg',
        'jpg',
        'bmp',
        'txt',
      ]);
    });
  });

  describe('isPdf', () => {
    it('should return true for files with .pdf extension', () => {
      const file = createMockFile('document.pdf', 1024);
      expect(isPdf(file)).to.be.true;
    });

    it('should return true for mixed-case PDF extensions', () => {
      const file = createMockFile('DOCUMENT.PDF', 1024);
      expect(isPdf(file)).to.be.true;
    });

    it('should return false for non-PDF files', () => {
      const file = createMockFile('document.jpg', 1024);
      expect(isPdf(file)).to.be.false;
    });

    it('should return false for files containing "pdf" but not ending with it', () => {
      const file = createMockFile('pdf_document.txt', 1024);
      expect(isPdf(file)).to.be.false;
    });

    it('should return false for files ending with "pdf" without the dot', () => {
      const file = createMockFile('documentpdf', 1024);
      expect(isPdf(file)).to.be.false;
    });

    it('should handle null filename gracefully', () => {
      const file = { name: null, size: 1024 };
      const result = isPdf(file);
      // Optional chaining returns undefined, but || false converts to false
      expect(result).to.be.false;
    });

    it('should handle undefined filename gracefully', () => {
      const file = { name: undefined, size: 1024 };
      const result = isPdf(file);
      // Optional chaining returns undefined, but || false converts to false
      expect(result).to.be.false;
    });

    it('should handle files with no name property gracefully', () => {
      const file = { size: 1024 };
      const result = isPdf(file);
      // Optional chaining returns undefined, but || false converts to false
      expect(result).to.be.false;
    });
  });

  describe('validateFile', () => {
    describe('null/undefined file handling', () => {
      it('should return null for null file', async () => {
        const result = await validateFile(null);
        expect(result).to.be.null;
      });

      it('should return null for undefined file', async () => {
        const result = await validateFile(undefined);
        expect(result).to.be.null;
      });
    });

    describe('file size validation', () => {
      it('should return error for oversized non-PDF file', async () => {
        const file = createMockFile('test.jpg', MAX_FILE_SIZE_BYTES + 1);

        const result = await validateFile(file);
        expect(result).to.equal(FILE_SIZE_ERROR_NON_PDF);
      });

      it('should return error for oversized PDF file', async () => {
        const file = createMockFile('test.pdf', MAX_PDF_SIZE_BYTES + 1);

        const result = await validateFile(file);
        expect(result).to.equal(FILE_SIZE_ERROR_PDF);
      });
    });

    describe('boundary size tests - will pass type check or fail gracefully', () => {
      it('should not fail size validation for non-PDF file exactly at MAX_FILE_SIZE_BYTES', async () => {
        const file = createMockFile('test.jpg', MAX_FILE_SIZE_BYTES);

        const result = await validateFile(file);
        // Result should be null (passes size check) or a type mismatch error, but not a size error
        expect(result).to.not.equal(FILE_SIZE_ERROR_NON_PDF);
      });

      it('should not fail size validation for PDF file exactly at MAX_PDF_SIZE_BYTES', async () => {
        const file = createMockFile('test.pdf', MAX_PDF_SIZE_BYTES);

        const result = await validateFile(file);
        // Result should be null (passes size check) or a type mismatch error, but not a size error
        expect(result).to.not.equal(FILE_SIZE_ERROR_PDF);
      });

      it('should not fail size validation for PDF file larger than non-PDF limit but within PDF limit', async () => {
        const file = createMockFile('test.pdf', MAX_FILE_SIZE_BYTES + 1024);

        const result = await validateFile(file);
        // Should use PDF size limit, so should not fail size validation
        expect(result).to.not.equal(FILE_SIZE_ERROR_PDF);
        expect(result).to.not.equal(FILE_SIZE_ERROR_NON_PDF);
      });
    });

    describe('mixed-case extension handling', () => {
      it('should handle mixed-case PDF extensions correctly', async () => {
        // Should use PDF size limit for mixed-case extension
        const withinPdfLimit = createMockFile(
          'TEST.PDF',
          MAX_FILE_SIZE_BYTES + 1024,
        );
        const withinResult = await validateFile(withinPdfLimit);
        expect(withinResult).to.not.equal(FILE_SIZE_ERROR_PDF);
        expect(withinResult).to.not.equal(FILE_SIZE_ERROR_NON_PDF);

        // Should fail when exceeding PDF limit
        const exceedsPdfLimit = createMockFile(
          'HUGE.PDF',
          MAX_PDF_SIZE_BYTES + 1,
        );
        const exceedsResult = await validateFile(exceedsPdfLimit);
        expect(exceedsResult).to.equal(FILE_SIZE_ERROR_PDF);
      });
    });
  });

  describe('validateFiles', () => {
    describe('empty and null inputs', () => {
      it('should return empty array for empty file list', async () => {
        const result = await validateFiles([]);
        expect(result).to.deep.equal([]);
      });

      it('should skip null file info objects', async () => {
        const fileInfos = [null, undefined, { file: null }];
        const result = await validateFiles(fileInfos);
        expect(result).to.deep.equal([]);
      });

      it('should skip fileInfo objects missing the file key', async () => {
        const fileInfos = [
          {}, // Missing file key
          { someOtherProperty: 'value' }, // Missing file key
          { file: createMockFile('oversized.pdf', MAX_PDF_SIZE_BYTES + 1) }, // Invalid file to test filtering
        ];

        const result = await validateFiles(fileInfos);
        // Should only have 1 error from the oversized file
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          index: 2,
          error: FILE_SIZE_ERROR_PDF,
        });
      });
    });

    describe('single file validation', () => {
      it('should return error object when single file is invalid', async () => {
        const fileInfos = [
          { file: createMockFile('test.pdf', MAX_PDF_SIZE_BYTES + 1) },
        ];

        const result = await validateFiles(fileInfos);
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          index: 0,
          error: FILE_SIZE_ERROR_PDF,
        });
      });
    });

    describe('multiple file validation', () => {
      it('should handle mixed scenarios with correct indices and parallel processing', async () => {
        const fileInfos = [
          { file: createMockFile('valid.pdf', 1024) }, // Index 0: Valid size
          { file: createMockFile('oversized.pdf', MAX_PDF_SIZE_BYTES + 1) }, // Index 1: Size error
          { file: createMockFile('valid.jpg', 2048) }, // Index 2: Valid size
          {}, // Index 3: Missing file key (skipped)
          { file: createMockFile('oversized.jpg', MAX_FILE_SIZE_BYTES + 1) }, // Index 4: Size error
          { file: createMockFile('valid2.txt', 512) }, // Index 5: Valid size
        ];

        const result = await validateFiles(fileInfos);

        // Filter to only size errors for reliable testing
        const sizeErrors = result.filter(
          r =>
            r.error === FILE_SIZE_ERROR_PDF ||
            r.error === FILE_SIZE_ERROR_NON_PDF,
        );

        // Should have 2 size errors: at indices 1 and 4
        expect(sizeErrors).to.have.length(2);

        // Verify each error maintains correct original index despite parallel processing
        const errorByIndex = sizeErrors.reduce((acc, error) => {
          acc[error.index] = error.error;
          return acc;
        }, {});

        expect(errorByIndex[1]).to.equal(FILE_SIZE_ERROR_PDF);
        expect(errorByIndex[4]).to.equal(FILE_SIZE_ERROR_NON_PDF);
      });
    });
  });
});
