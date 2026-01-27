import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import {
  uiSchema,
  schema,
  legacyUiSchema,
  legacySchema,
  enhancedUiSchema,
  enhancedSchema,
} from '../../pages/additionalDocuments';
import {
  FILE_TYPES,
  HINT_TEXT,
  LABEL_TEXT,
  ATTACHMENTS_TYPE,
  ADDITIONAL_ATTACHMENT_LABEL,
} from '../../components/supportingEvidenceUpload/constants';
import { evidenceChoiceUploadContent } from '../../pages/form0781/supportingEvidenceEnhancement/evidenceChoiceUploadPage';
import { standardTitle } from '../../content/form0781';

describe('additionalDocuments page', () => {
  describe('default exports (backwards compatibility)', () => {
    it('should export uiSchema as legacyUiSchema', () => {
      expect(uiSchema).to.equal(legacyUiSchema);
    });

    it('should export schema as legacySchema', () => {
      expect(schema).to.equal(legacySchema);
    });
  });

  describe('legacyUiSchema (feature toggle OFF)', () => {
    it('should export legacyUiSchema with correct structure', () => {
      expect(legacyUiSchema).to.be.an('object');
      expect(legacyUiSchema).to.have.property('view:evidenceChoiceUpload');
      expect(legacyUiSchema).to.have.property('uploadedFiles');
    });

    it('should have correct view:evidenceChoiceUpload configuration', () => {
      const viewSchema = legacyUiSchema['view:evidenceChoiceUpload'];
      expect(viewSchema).to.have.property('ui:title');
      expect(viewSchema['ui:description']).to.equal(
        evidenceChoiceUploadContent,
      );
    });

    it('should use standardTitle for the page title', () => {
      const viewSchema = legacyUiSchema['view:evidenceChoiceUpload'];
      const expectedTitle = standardTitle(
        'Upload supporting documents and additional forms',
      );
      expect(viewSchema['ui:title']).to.deep.equal(expectedTitle);
    });

    it('should use UploadFiles as ui:field', () => {
      expect(legacyUiSchema.uploadedFiles['ui:field']).to.be.a('function');
    });

    it('should have ui:required function that returns true', () => {
      expect(legacyUiSchema.uploadedFiles['ui:required']).to.be.a('function');
      expect(legacyUiSchema.uploadedFiles['ui:required']()).to.equal(true);
    });

    it('should have correct error messages', () => {
      expect(
        legacyUiSchema.uploadedFiles['ui:errorMessages'].required,
      ).to.equal('Please upload at least one supporting document');
    });
  });

  describe('legacySchema (feature toggle OFF)', () => {
    it('should export legacySchema with correct structure', () => {
      expect(legacySchema).to.be.an('object');
      expect(legacySchema.type).to.equal('object');
    });

    it('should require uploadedFiles', () => {
      expect(legacySchema.required).to.include('uploadedFiles');
    });

    it('should have uploadedFiles as array with minItems 1', () => {
      expect(legacySchema.properties.uploadedFiles.type).to.equal('array');
      expect(legacySchema.properties.uploadedFiles.minItems).to.equal(1);
    });
  });

  describe('enhancedUiSchema (feature toggle ON)', () => {
    it('should export enhancedUiSchema with correct structure', () => {
      expect(enhancedUiSchema).to.be.an('object');
      expect(enhancedUiSchema).to.have.property('view:evidenceChoiceUpload');
      expect(enhancedUiSchema).to.have.property('uploadedFiles');
    });

    it('should have correct view:evidenceChoiceUpload configuration', () => {
      const viewSchema = enhancedUiSchema['view:evidenceChoiceUpload'];
      expect(viewSchema).to.have.property('ui:title');
      expect(viewSchema['ui:description']).to.equal(
        evidenceChoiceUploadContent,
      );
    });

    describe('uploadedFiles configuration', () => {
      const uploadedFilesSchema = enhancedUiSchema.uploadedFiles;

      it('should have correct ui:title', () => {
        expect(uploadedFilesSchema['ui:title']).to.equal(LABEL_TEXT);
      });

      it('should have ui:webComponentField defined', () => {
        expect(uploadedFilesSchema).to.have.property('ui:webComponentField');
      });

      it('should have ui:required function that returns true', () => {
        expect(uploadedFilesSchema['ui:required']).to.be.a('function');
        expect(uploadedFilesSchema['ui:required']()).to.equal(true);
      });

      it('should have correct error messages', () => {
        expect(uploadedFilesSchema['ui:errorMessages']).to.have.property(
          'required',
        );
        expect(uploadedFilesSchema['ui:errorMessages'].required).to.equal(
          'Please upload at least one supporting document',
        );
      });

      it('should have ui:options with correct accept file types', () => {
        const options = uploadedFilesSchema['ui:options'];
        expect(options).to.have.property('accept');
        const expectedAccept = FILE_TYPES.map(type => `.${type}`).join(',');
        expect(options.accept).to.equal(expectedAccept);
      });

      it('should have ui:options with correct formNumber', () => {
        const options = uploadedFilesSchema['ui:options'];
        expect(options.formNumber).to.equal('21-526EZ');
      });

      it('should have ui:options with correct maxFileSize (99 MB)', () => {
        const options = uploadedFilesSchema['ui:options'];
        expect(options.maxFileSize).to.equal(99 * 1024 * 1024);
      });

      it('should have ui:options with hint text', () => {
        const options = uploadedFilesSchema['ui:options'];
        expect(options.hint).to.equal(HINT_TEXT);
      });

      it('should have additionalInputRequired set to true', () => {
        const options = uploadedFilesSchema['ui:options'];
        expect(options.additionalInputRequired).to.equal(true);
      });
    });

    describe('additionalInput callback', () => {
      it('should be a function', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        expect(options.additionalInput).to.be.a('function');
      });

      it('should render VaSelect with correct label', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        const { container } = render(options.additionalInput());

        const select = container.querySelector('va-select');
        expect(select).to.exist;
        expect(select.getAttribute('label')).to.equal(
          ADDITIONAL_ATTACHMENT_LABEL,
        );
        expect(select.hasAttribute('required')).to.be.true;
      });

      it('should render all ATTACHMENTS_TYPE options', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        const { container } = render(options.additionalInput());

        const optionElements = container.querySelectorAll('option');
        expect(optionElements.length).to.equal(ATTACHMENTS_TYPE.length);

        ATTACHMENTS_TYPE.forEach((attachmentType, index) => {
          expect(optionElements[index].value).to.equal(attachmentType.value);
          expect(optionElements[index].textContent).to.equal(
            attachmentType.label,
          );
        });
      });
    });

    describe('additionalInputUpdate callback', () => {
      it('should be a function', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        expect(options.additionalInputUpdate).to.be.a('function');
      });

      it('should set error attribute on instance', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        const mockInstance = {
          setAttribute: sinon.spy(),
        };
        const error = 'Test error message';

        options.additionalInputUpdate(mockInstance, error, null);

        expect(mockInstance.setAttribute.calledWith('error', error)).to.be.true;
      });

      it('should set value attribute when data is provided', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        const mockInstance = {
          setAttribute: sinon.spy(),
        };
        const data = { docType: 'L015' };

        options.additionalInputUpdate(mockInstance, '', data);

        expect(mockInstance.setAttribute.calledWith('error', '')).to.be.true;
        expect(mockInstance.setAttribute.calledWith('value', 'L015')).to.be
          .true;
      });

      it('should not set value attribute when data is null', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        const mockInstance = {
          setAttribute: sinon.spy(),
        };

        options.additionalInputUpdate(mockInstance, '', null);

        expect(mockInstance.setAttribute.calledOnce).to.be.true;
        expect(mockInstance.setAttribute.calledWith('error', '')).to.be.true;
      });
    });

    describe('handleAdditionalInput callback', () => {
      it('should be a function', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        expect(options.handleAdditionalInput).to.be.a('function');
      });

      it('should return docType payload when value is provided', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        const event = {
          detail: { value: 'L015' },
        };

        const result = options.handleAdditionalInput(event);

        expect(result).to.deep.equal({ docType: 'L015' });
      });

      it('should return null when value is empty string', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];
        const event = {
          detail: { value: '' },
        };

        const result = options.handleAdditionalInput(event);

        expect(result).to.be.null;
      });

      it('should handle different document types correctly', () => {
        const options = enhancedUiSchema.uploadedFiles['ui:options'];

        ATTACHMENTS_TYPE.forEach(attachmentType => {
          const event = {
            detail: { value: attachmentType.value },
          };
          const result = options.handleAdditionalInput(event);
          expect(result).to.deep.equal({ docType: attachmentType.value });
        });
      });
    });
  });

  describe('enhancedSchema (feature toggle ON)', () => {
    it('should export enhancedSchema with correct structure', () => {
      expect(enhancedSchema).to.be.an('object');
      expect(enhancedSchema.type).to.equal('object');
    });

    it('should require uploadedFiles', () => {
      expect(enhancedSchema.required).to.include('uploadedFiles');
    });

    it('should have view:evidenceChoiceUpload property', () => {
      expect(enhancedSchema.properties).to.have.property(
        'view:evidenceChoiceUpload',
      );
      expect(
        enhancedSchema.properties['view:evidenceChoiceUpload'].type,
      ).to.equal('object');
    });

    it('should have uploadedFiles property with correct schema', () => {
      expect(enhancedSchema.properties).to.have.property('uploadedFiles');
      expect(enhancedSchema.properties.uploadedFiles.type).to.equal('array');
      expect(enhancedSchema.properties.uploadedFiles.default).to.deep.equal([]);
    });

    it('should have uploadedFiles items with correct properties', () => {
      const { items } = enhancedSchema.properties.uploadedFiles;
      expect(items.type).to.equal('object');
      expect(items.properties).to.have.property('confirmationCode');
      expect(items.properties).to.have.property('name');
      expect(items.properties).to.have.property('size');
      expect(items.properties).to.have.property('type');
      expect(items.properties).to.have.property('additionalData');
    });
  });
});
