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

  it('should require evidenceChoiceAdditionalDocuments field in schema', () => {
    expect(schema.required).to.deep.equal([
      'evidenceChoiceAdditionalDocuments',
    ]);
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

  it('should submit when supporting documents already exist', async () => {
    const onSubmit = sinon.spy();
    const { getByText, unmount } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            evidenceChoiceAdditionalDocuments: [
              {
                name: 'supportingDoc.pdf',
                size: 1024,
                confirmationCode: 'CONFIRM123',
                additionalData: { docType: 'L015' },
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

    unmount();
  });

  it('should have additionalInputTitle configured', () => {
    const { evidenceChoiceAdditionalDocuments } = uiSchema;
    expect(
      evidenceChoiceAdditionalDocuments['ui:options'].additionalInputTitle,
    ).to.equal('What type of document is this?');
  });

  it('should have additionalInputLabels configured with correct structure', () => {
    const { evidenceChoiceAdditionalDocuments } = uiSchema;
    const { additionalInputLabels } = evidenceChoiceAdditionalDocuments[
      'ui:options'
    ];

    expect(additionalInputLabels).to.exist;
    expect(additionalInputLabels).to.have.property('attachmentId');
    expect(additionalInputLabels.attachmentId).to.be.an('object');
  });

  it('should have all expected document types in additionalInputLabels', () => {
    const { evidenceChoiceAdditionalDocuments } = uiSchema;
    const { additionalInputLabels } = evidenceChoiceAdditionalDocuments[
      'ui:options'
    ];

    // Verify some key document types exist
    expect(additionalInputLabels.attachmentId).to.have.property('L015');
    expect(additionalInputLabels.attachmentId.L015).to.equal(
      'Buddy/Lay Statement',
    );

    expect(additionalInputLabels.attachmentId).to.have.property('L702');
    expect(additionalInputLabels.attachmentId.L702).to.equal(
      'Disability Benefits Questionnaire (DBQ)',
    );

    expect(additionalInputLabels.attachmentId).to.have.property('L107');
    expect(additionalInputLabels.attachmentId.L107).to.equal(
      'VA Form 21-4142 - Authorization To Disclose Information',
    );

    expect(additionalInputLabels.attachmentId).to.have.property('L023');
    expect(additionalInputLabels.attachmentId.L023).to.equal(
      'Other Correspondence',
    );
  });

  it('should use additionalInputLabels for review page label mapping', () => {
    const { evidenceChoiceAdditionalDocuments } = uiSchema;
    const { additionalInputLabels } = evidenceChoiceAdditionalDocuments[
      'ui:options'
    ];

    // Verify the structure matches what fileInputPattern expects
    // fileInputPattern.jsx line 202: {uiOptions.additionalInputLabels?.[key]?.[value] || value}
    const testValue = 'L702';
    const testKey = 'attachmentId';

    expect(additionalInputLabels[testKey][testValue]).to.equal(
      'Disability Benefits Questionnaire (DBQ)',
    );
  });
});
