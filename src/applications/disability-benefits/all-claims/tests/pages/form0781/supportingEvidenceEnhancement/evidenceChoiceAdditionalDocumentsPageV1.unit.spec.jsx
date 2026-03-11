import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../../../config/form';
import {
  uiSchema,
  schema,
} from '../../../../pages/form0781/supportingEvidenceEnhancement/evidenceChoiceAdditionalDocumentsPageV1';

describe('evidenceChoiceAdditionalDocumentsPageV1', () => {
  const page =
    formConfig.chapters.supportingEvidence.pages
      .evidenceChoiceAdditionalDocumentsV1;

  describe('page configuration', () => {
    it('should have correct title', () => {
      expect(page.title).to.equal(
        'Upload supporting documents and additional forms',
      );
    });

    it('should have correct path', () => {
      expect(page.path).to.equal(
        'supporting-evidence/additional-evidence-enhancement-v1',
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
    it('should return true when enhancement ON, v3 OFF, and has other evidence', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      };
      expect(page.depends(formData)).to.be.true;
    });

    it('should return false when v3 is ON', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        disability526SupportingEvidenceFileInputV3: true,
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should return false when enhancement is OFF', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: false,
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      };
      expect(page.depends(formData)).to.be.false;
    });

    it('should return false without other evidence', () => {
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': false,
        },
      };
      expect(page.depends(formData)).to.be.false;
    });
  });

  describe('schema', () => {
    it('should require additionalDocuments field', () => {
      expect(schema.required).to.deep.equal(['additionalDocuments']);
    });

    it('should have additionalDocuments property', () => {
      expect(schema.properties).to.have.property('additionalDocuments');
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

    it('should have additionalDocuments field', () => {
      expect(uiSchema).to.have.property('additionalDocuments');
    });
  });

  describe('page rendering', () => {
    it('should render the page with a form', () => {
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

    it('should display the accordion and mental health support alert', () => {
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

      const accordionItems = container.querySelectorAll('va-accordion-item');
      expect(accordionItems.length).to.be.greaterThan(0);
      expect(accordionItems[0].getAttribute('header')).to.equal(
        'Where supporting documents may come from and additional forms',
      );

      const mhSupportAlert = container.querySelectorAll('va-alert-expandable');
      expect(mhSupportAlert.length).to.equal(1);
      expect(mhSupportAlert[0].getAttribute('trigger')).to.equal(
        'Get mental health and military sexual trauma support anytime',
      );
    });

    it('should submit when supporting documents already exist', () => {
      const onSubmit = sinon.spy();
      const { getByText } = render(
        <Provider store={uploadStore}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{
              additionalDocuments: [
                {
                  name: 'supportingDoc.pdf',
                  size: 1024,
                  confirmationCode: 'CONFIRM123',
                  attachmentId: 'L015',
                },
              ],
            }}
            formData={{}}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      userEvent.click(getByText('Submit'));
      expect(onSubmit.calledOnce).to.be.true;
    });
  });
});
