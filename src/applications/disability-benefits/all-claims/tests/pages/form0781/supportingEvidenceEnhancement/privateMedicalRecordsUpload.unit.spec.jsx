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
    it('should have privateMedicalRecordAttachmentsV3 property', () => {
      expect(schema.properties).to.have.property(
        'privateMedicalRecordAttachmentsV3',
      );
    });

    it('should have privateMedicalRecordAttachmentsV1 property', () => {
      expect(schema.properties).to.have.property(
        'privateMedicalRecordAttachmentsV1',
      );
    });

    it('should have correct schema type', () => {
      expect(schema.type).to.equal('object');
    });

    it('should require privateMedicalRecordAttachmentsV3 when feature flag is enabled', () => {
      const formData = { disability526SupportingEvidenceFileInputV3: true };
      const updatedSchema = uiSchema['ui:options'].updateSchema(
        formData,
        schema,
      );
      expect(updatedSchema.required).to.deep.equal([
        'privateMedicalRecordAttachmentsV3',
      ]);
    });

    it('should require privateMedicalRecordAttachmentsV1 when feature flag is disabled', () => {
      const formData = { disability526SupportingEvidenceFileInputV3: false };
      const updatedSchema = uiSchema['ui:options'].updateSchema(
        formData,
        schema,
      );
      expect(updatedSchema.required).to.deep.equal([
        'privateMedicalRecordAttachmentsV1',
      ]);
      expect(updatedSchema.properties).to.not.have.property(
        'privateMedicalRecordAttachmentsV3',
      );
    });
  });

  describe('uiSchema', () => {
    it('should have ui:title', () => {
      expect(uiSchema['ui:title']).to.exist;
    });

    it('should have ui:description', () => {
      expect(uiSchema['ui:description']).to.exist;
    });

    it('should have privateMedicalRecordAttachmentsV3 field', () => {
      expect(uiSchema).to.have.property('privateMedicalRecordAttachmentsV3');
    });

    it('should have privateMedicalRecordAttachmentsV1 field', () => {
      expect(uiSchema).to.have.property('privateMedicalRecordAttachmentsV1');
    });
  });

  describe('Additional Input (Document Type) Requirements', () => {
    it('should require additional input for document type selection', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.additionalInputRequired).to.be.true;
    });

    it('should have handleAdditionalInput function', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.handleAdditionalInput).to.be.a('function');
    });

    it('should have additionalInputUpdate function', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.additionalInputUpdate).to.be.a('function');
    });

    it('should have additionalInput component', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.additionalInput).to.exist;
    });

    it('handleAdditionalInput should return null for empty value', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      const result = fileConfig.handleAdditionalInput({
        detail: { value: '' },
      });
      expect(result).to.be.null;
    });

    it('handleAdditionalInput should return attachmentId object for valid value', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      const result = fileConfig.handleAdditionalInput({
        detail: { value: 'L107' },
      });
      expect(result).to.deep.equal({ attachmentId: 'L107' });
    });
  });

  describe('File Size Configuration', () => {
    it('should have correct max file size for PDF files (100MB)', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      const pdfMaxSize = fileConfig.fileSizesByFileType.pdf.maxFileSize;
      expect(pdfMaxSize).to.equal(1024 * 1024 * 100); // 100MB in bytes
      expect(pdfMaxSize).to.equal(104857600);
    });

    it('should have correct min file size for PDF files (1KB)', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      const pdfMinSize = fileConfig.fileSizesByFileType.pdf.minFileSize;
      expect(pdfMinSize).to.equal(1024); // 1KB in bytes
    });

    it('should have correct max file size for non-PDF files (50MB)', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      const defaultMaxSize = fileConfig.fileSizesByFileType.default.maxFileSize;
      expect(defaultMaxSize).to.equal(1024 * 1024 * 50); // 50MB in bytes
      expect(defaultMaxSize).to.equal(52428800);
    });

    it('should have correct min file size for non-PDF files (1 byte)', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      const defaultMinSize = fileConfig.fileSizesByFileType.default.minFileSize;
      expect(defaultMinSize).to.equal(1); // 1 byte
    });
  });

  describe('Accepted File Types', () => {
    it('should accept PDF files', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.accept).to.include('.pdf');
    });

    it('should accept JPG files', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.accept).to.include('.jpg');
    });

    it('should accept JPEG files', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.accept).to.include('.jpeg');
    });

    it('should accept PNG files', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.accept).to.include('.png');
    });

    it('should accept GIF files', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.accept).to.include('.gif');
    });

    it('should accept BMP files', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.accept).to.include('.bmp');
    });

    it('should accept TXT files', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      expect(fileConfig.accept).to.include('.txt');
    });

    it('should accept all specified file types', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
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
  describe('File Size Validation - non-PDF files (default)', () => {
    it('should use the same default limits for all non-PDF types', () => {
      const fileConfig =
        uiSchema.privateMedicalRecordAttachmentsV3['ui:options'];
      const {
        minFileSize,
        maxFileSize,
      } = fileConfig.fileSizesByFileType.default;
      expect(minFileSize).to.equal(1);
      expect(maxFileSize).to.equal(52428800);
    });
  });
});
