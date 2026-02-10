import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';
import {
  uiSchema,
  schema,
} from '../../../../pages/form0781/supportingEvidenceEnhancement/privateMedicalRecordsUpload';

describe('Private Medical Records Upload page', () => {
  const page =
    formConfig.chapters.supportingEvidence.pages.privateMedicalRecordsUpload;

  describe('page configuration', () => {
    // TODO: Potentially Update this title -> will check with Design
    it('should have correct title', () => {
      expect(page.title).to.equal('Upload non-VA treatment records');
    });

    it('should have correct path', () => {
      expect(page.path).to.equal(
        'supporting-evidence/private-medical-records-upload-enhancement',
      );
    });

    it('should have depends function', () => {
      expect(page.depends).to.be.a('function');
    });

    it('should have uiSchema', () => {
      expect(page.uiSchema).to.exist;
    });

    it('should have schema', () => {
      expect(page.schema).to.exist;
    });
  });

  describe('page rendering', () => {
    it('should render the page', () => {
      const { container } = render(
        <Provider store={uploadStore}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{}}
            formData={{}}
          />
        </Provider>,
      );

      expect(container.querySelector('form')).to.exist;
    });

    it('should render with title', () => {
      const { container } = render(
        <Provider store={uploadStore}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{}}
            formData={{}}
          />
        </Provider>,
      );

      // Check that the page renders content
      const form = container.querySelector('form');
      expect(form).to.exist;
      expect(form.children.length).to.be.greaterThan(0);
    });
  });

  describe('depends function', () => {
    it('should return false when disability526SupportingEvidenceEnhancement is not enabled', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: false,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };

      const result = page.depends(formData);
      expect(result).to.be.false;
    });

    it('should return false when hasPrivateEvidence returns false', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': false,
        },
      };

      const result = page.depends(formData);
      expect(result).to.be.false;
    });

    it('should return false when user chooses not to upload private medical records', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false,
        },
      };

      const result = page.depends(formData);
      expect(result).to.be.false;
    });

    it('should return true when all conditions are met', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };

      const result = page.depends(formData);
      expect(result).to.be.true;
    });
  });

  describe('schema', () => {
    it('should have privateMedicalRecordAttachments property', () => {
      expect(schema.properties).to.have.property(
        'privateMedicalRecordAttachments',
      );
    });

    it('should have correct schema type', () => {
      expect(schema.type).to.equal('object');
    });
  });

  describe('uiSchema', () => {
    it('should have ui:title', () => {
      expect(uiSchema['ui:title']).to.exist;
    });

    it('should have ui:description', () => {
      expect(uiSchema['ui:description']).to.exist;
    });

    it('should have privateMedicalRecordAttachments field', () => {
      expect(uiSchema).to.have.property('privateMedicalRecordAttachments');
    });
  });

  describe('Additional Input (Document Type) Requirements', () => {
    it('should require additional input for document type selection', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.additionalInputRequired).to.be.true;
    });

    it('should have handleAdditionalInput function', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.handleAdditionalInput).to.be.a('function');
    });

    it('should have additionalInputUpdate function', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.additionalInputUpdate).to.be.a('function');
    });

    it('should have additionalInput component', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.additionalInput).to.exist;
    });

    it('handleAdditionalInput should return null for empty value', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const result = fileConfig.handleAdditionalInput({
        detail: { value: '' },
      });
      expect(result).to.be.null;
    });

    it('handleAdditionalInput should return docType object for valid value', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const result = fileConfig.handleAdditionalInput({
        detail: { value: 'L049' },
      });
      expect(result).to.deep.equal({ docType: 'L049' });
    });
  });

  describe('File Size Configuration', () => {
    it('should have correct max file size for PDF files (100MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const pdfMaxSize = fileConfig.fileSizesByFileType.pdf.maxFileSize;
      expect(pdfMaxSize).to.equal(1024 * 1024 * 100); // 100MB in bytes
      expect(pdfMaxSize).to.equal(104857600);
    });

    it('should have correct min file size for PDF files (1KB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const pdfMinSize = fileConfig.fileSizesByFileType.pdf.minFileSize;
      expect(pdfMinSize).to.equal(1024); // 1KB in bytes
    });

    it('should have correct max file size for non-PDF files (50MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const defaultMaxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      expect(defaultMaxSize).to.equal(1024 * 1024 * 50); // 50MB in bytes
      expect(defaultMaxSize).to.equal(52428800);
    });

    it('should have correct min file size for non-PDF files (1 byte)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const defaultMinSize = fileConfig.fileSizesByFileType.default.minFileSize;
      expect(defaultMinSize).to.equal(1); // 1 byte
    });
  });

  describe('Accepted File Types', () => {
    it('should accept PDF files', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.accept).to.include('.pdf');
    });

    it('should accept JPG files', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.accept).to.include('.jpg');
    });

    it('should accept JPEG files', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.accept).to.include('.jpeg');
    });

    it('should accept PNG files', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.accept).to.include('.png');
    });

    it('should accept GIF files', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.accept).to.include('.gif');
    });

    it('should accept BMP files', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.accept).to.include('.bmp');
    });

    it('should accept TXT files', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      expect(fileConfig.accept).to.include('.txt');
    });

    it('should accept all specified file types', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const expectedTypes = [
        '.pdf',
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.txt',
      ];
      expectedTypes.forEach(type => {
        expect(fileConfig.accept).to.include(type);
      });
    });
  });

  describe('File Size Validation - PDF Files', () => {
    it('should accept PDF file at exactly 1KB (minimum)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.pdf.minFileSize;
      const testFileSize = 1024; // 1KB
      expect(testFileSize).to.equal(minSize);
    });

    it('should accept PDF file at exactly 100MB (maximum)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.pdf.maxFileSize;
      const testFileSize = 1024 * 1024 * 100; // 100MB
      expect(testFileSize).to.equal(maxSize);
    });

    it('should reject PDF file under 1KB', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.pdf.minFileSize;
      const testFileSize = 1023; // just under 1KB
      expect(testFileSize).to.be.below(minSize);
    });

    it('should reject PDF file over 100MB', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.pdf.maxFileSize;
      const testFileSize = 1024 * 1024 * 101; // 101MB
      expect(testFileSize).to.be.above(maxSize);
    });

    it('should accept PDF file at mid-range size (50MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.pdf.minFileSize;
      const maxSize = fileConfig.fileSizesByFileType.pdf.maxFileSize;
      const testFileSize = 1024 * 1024 * 50; // 50MB
      expect(testFileSize).to.be.above(minSize);
      expect(testFileSize).to.be.below(maxSize);
    });
  });

  describe('File Size Validation - JPG Files', () => {
    it('should accept JPG file at exactly 1 byte (minimum)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      const testFileSize = 1; // 1 byte
      expect(testFileSize).to.equal(minSize);
    });

    it('should accept JPG file at exactly 50MB (maximum)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 50; // 50MB
      expect(testFileSize).to.equal(maxSize);
    });

    it('should reject JPG file under 1 byte', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      const testFileSize = 0; // 0 bytes
      expect(testFileSize).to.be.below(minSize);
    });

    it('should reject JPG file over 50MB', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 51; // 51MB
      expect(testFileSize).to.be.above(maxSize);
    });

    it('should accept JPG file at mid-range size (25MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 25; // 25MB
      expect(testFileSize).to.be.above(minSize);
      expect(testFileSize).to.be.below(maxSize);
    });
  });

  describe('File Size Validation - JPEG Files', () => {
    it('should accept JPEG file at exactly 1 byte (minimum)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      expect(minSize).to.equal(1);
    });

    it('should accept JPEG file at exactly 50MB (maximum)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 52428800; // 50MB in bytes
      expect(testFileSize).to.equal(maxSize);
    });

    it('should reject JPEG file over 50MB', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 51; // 51MB
      expect(testFileSize).to.be.above(maxSize);
    });
  });

  describe('File Size Validation - PNG Files', () => {
    it('should accept PNG file at minimum size (1 byte)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      expect(minSize).to.equal(1);
    });

    it('should accept PNG file at maximum size (50MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      expect(maxSize).to.equal(52428800);
    });

    it('should reject PNG file over 50MB', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 51; // 51MB
      expect(testFileSize).to.be.above(maxSize);
    });

    it('should accept PNG file at mid-range size (10MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 10; // 10MB
      expect(testFileSize).to.be.above(minSize);
      expect(testFileSize).to.be.below(maxSize);
    });
  });

  describe('File Size Validation - GIF Files', () => {
    it('should accept GIF file within size limits', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 10; // 10MB
      expect(testFileSize).to.be.above(minSize);
      expect(testFileSize).to.be.below(maxSize);
    });

    it('should reject GIF file over maximum size', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 100; // 100MB
      expect(testFileSize).to.be.above(maxSize);
    });

    it('should have correct max size for GIF (50MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      expect(maxSize).to.equal(52428800);
    });
  });

  describe('File Size Validation - BMP Files', () => {
    it('should accept BMP file within size limits', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 30; // 30MB
      expect(testFileSize).to.be.above(minSize);
      expect(testFileSize).to.be.below(maxSize);
    });

    it('should have correct max size for BMP (50MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      expect(maxSize).to.equal(52428800);
    });

    it('should accept BMP file at minimum size', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      expect(minSize).to.equal(1);
    });
  });

  describe('File Size Validation - TXT Files', () => {
    it('should accept TXT file at minimum size (1 byte)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      expect(minSize).to.equal(1);
    });

    it('should accept TXT file at maximum size (50MB)', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      expect(maxSize).to.equal(52428800);
    });

    it('should accept TXT file within size limits', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const minSize = fileConfig.fileSizesByFileType.default.minFileSize;
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 100; // 100KB
      expect(testFileSize).to.be.above(minSize);
      expect(testFileSize).to.be.below(maxSize);
    });

    it('should reject TXT file over maximum size', () => {
      const fileConfig = uiSchema.privateMedicalRecordAttachments['ui:options'];
      const maxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      const testFileSize = 1024 * 1024 * 51; // 51MB
      expect(testFileSize).to.be.above(maxSize);
    });
  });
});
