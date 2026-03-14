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
} from '../../../../pages/form0781/supportingEvidenceEnhancement/privateMedicalRecordsUploadV1';

describe('Private Medical Records Upload V1 page', () => {
  const page =
    formConfig.chapters.supportingEvidence.pages.privateMedicalRecordsUploadV1;

  describe('page configuration', () => {
    it('should have correct title', () => {
      expect(page.title).to.equal('Upload non-VA treatment records');
    });

    it('should have correct path', () => {
      expect(page.path).to.equal(
        'supporting-evidence/private-medical-records-upload-enhancement-v1',
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

  describe('depends function', () => {
    it('should return true when enhancement ON, v3 OFF, has private evidence, and uploading', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };
      expect(page.depends(formData)).to.be.true;
    });

    it('should return false when v3 is ON', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        disability526SupportingEvidenceFileInputV3: true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should return false when enhancement is OFF', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: false,
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should return false without private evidence', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': false,
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should return false when not uploading private records', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false,
        },
      };
      expect(page.depends(formData)).to.be.false;
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

  describe('page rendering', () => {
    it('should render the page with content', () => {
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

      const form = container.querySelector('form');
      expect(form).to.exist;
      expect(form.children.length).to.be.greaterThan(0);
    });
  });
});
