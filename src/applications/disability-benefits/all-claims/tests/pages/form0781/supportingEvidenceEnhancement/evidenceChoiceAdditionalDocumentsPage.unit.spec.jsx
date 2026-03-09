import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../../../config/form';

describe('evidenceChoiceAdditionalDocumentsPage', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceChoiceAdditionalDocuments;

  it('should have additionalDocumentsV3 and additionalDocumentsV1 in schema properties', () => {
    expect(schema.properties).to.have.property('additionalDocumentsV3');
    expect(schema.properties).to.have.property('additionalDocumentsV1');
  });

  it('should require additionalDocumentsV3 when feature flag is enabled', () => {
    const formData = { disability526SupportingEvidenceFileInputV3: true };
    const updatedSchema = uiSchema['ui:options'].updateSchema(formData, schema);
    expect(updatedSchema.required).to.deep.equal(['additionalDocumentsV3']);
  });

  it('should require additionalDocumentsV1 when feature flag is disabled', () => {
    const formData = { disability526SupportingEvidenceFileInputV3: false };
    const updatedSchema = uiSchema['ui:options'].updateSchema(formData, schema);
    expect(updatedSchema.required).to.deep.equal(['additionalDocumentsV1']);
    expect(updatedSchema.properties).to.not.have.property(
      'additionalDocumentsV3',
    );
  });

  it('should display the accordion and mental health support alert', () => {
    const { container, unmount } = render(
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

    unmount();
  });

  it('should submit when supporting documents already exist (V3)', async () => {
    const onSubmit = sinon.spy();
    const { getByText, unmount } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            disability526SupportingEvidenceFileInputV3: true,
            additionalDocumentsV3: [
              {
                name: 'supportingDoc.pdf',
                size: 1024,
                confirmationCode: 'CONFIRM123',
                additionalData: { attachmentId: 'L015' },
              },
            ],
          }}
          formData={{
            disability526SupportingEvidenceFileInputV3: true,
          }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;

    unmount();
  });

  it('should submit when supporting documents already exist (V1)', async () => {
    const onSubmit = sinon.spy();
    const { getByText, unmount } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            disability526SupportingEvidenceFileInputV3: false,
            additionalDocumentsV1: [
              {
                name: 'supportingDoc.pdf',
                size: 1024,
                confirmationCode: 'CONFIRM123',
              },
            ],
          }}
          formData={{
            disability526SupportingEvidenceFileInputV3: false,
          }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;

    unmount();
  });
});
