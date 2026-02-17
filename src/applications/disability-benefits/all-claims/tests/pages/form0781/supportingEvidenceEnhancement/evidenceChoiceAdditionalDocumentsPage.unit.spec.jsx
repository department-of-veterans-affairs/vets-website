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
  const { schema, uiSchema } =
    formConfig.chapters.supportingEvidence.pages
      .evidenceChoiceAdditionalDocuments;

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
});
