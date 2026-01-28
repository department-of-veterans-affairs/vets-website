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
    // TODO: Remove and add new test with V3 File Input Component
    it('should have ui:required function for privateMedicalRecordAttachments', () => {
      expect(uiSchema.privateMedicalRecordAttachments['ui:required']).to.be.a(
        'function',
      );
    });
    // TODO: Remove and add new test with V3 File Input Component
    it('should return true when hasPrivateRecordsToUpload is true', () => {
      const formData = {
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };

      const isRequired = uiSchema.privateMedicalRecordAttachments[
        'ui:required'
      ](formData);
      expect(isRequired).to.be.true;
    });
    // TODO: Remove and add new test with V3 File Input Component
    it('should return false when hasPrivateRecordsToUpload is false', () => {
      const formData = {
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false,
        },
      };

      const isRequired = uiSchema.privateMedicalRecordAttachments[
        'ui:required'
      ](formData);
      expect(isRequired).to.be.false;
    });
    // TODO: Remove and add new test with V3 File Input Component
    it('should have ui:confirmationField', () => {
      expect(
        uiSchema.privateMedicalRecordAttachments['ui:confirmationField'],
      ).to.be.a('function');
    });
    // TODO: Remove and add new test with V3 File Input Component
    it('should return correct confirmation field data', () => {
      const mockFormData = [{ name: 'file1.pdf' }, { fileName: 'file2.pdf' }];

      const confirmationField = uiSchema.privateMedicalRecordAttachments[
        'ui:confirmationField'
      ]({
        formData: mockFormData,
      });

      expect(confirmationField.data).to.deep.equal(['file1.pdf', 'file2.pdf']);
      expect(confirmationField.label).to.equal('Private medical records');
    });
  });
});
