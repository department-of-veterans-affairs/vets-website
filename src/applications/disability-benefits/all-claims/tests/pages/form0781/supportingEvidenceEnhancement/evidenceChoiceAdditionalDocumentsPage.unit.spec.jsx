import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';

import formConfig from '../../../../config/form';

describe('evidenceChoiceAdditionalDocumentsPage', () => {
  const errorClass = '.usa-input-error-message';
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceChoiceAdditionalDocuments;

  it('should render', () => {
    const form = mount(
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

    expect(form.text()).to.contain(
      'Upload supporting documents and additional forms',
    );
    expect(form.find('input[type="file"]').length).to.equal(1);
    expect(
      form.find('#root_evidenceChoiceAdditionalDocuments_add_label').length,
    ).to.equal(1);

    form.unmount();
  });

  it('should not submit without an upload', async () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      expect(form.find(errorClass).length).to.equal(1);
    });

    form.unmount();
  });

  it('should display the accordion and mental health support alert', () => {
    const form = mount(
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

    const accordionItems = form.find('va-accordion-item');
    expect(accordionItems.length).to.be.greaterThan(0);
    expect(accordionItems.at(0).prop('header')).to.equal(
      'Where supporting documents may come from and additional forms',
    );

    const mhSupportAlert = form.find('va-alert-expandable');
    expect(mhSupportAlert.length).to.equal(1);
    expect(mhSupportAlert.at(0).prop('trigger')).to.equal(
      'Get mental health and military sexual trauma support anytime',
    );

    form.unmount();
  });

  it('should correctly display uploaded file names for confirmation field', () => {
    const confirmationField =
      uiSchema.evidenceChoiceAdditionalDocuments['ui:confirmationField'];

    const result = confirmationField({
      formData: [
        {
          name: 'Form526.pdf',
          confirmationCode: 'testing',
          attachmentId: 'L015',
        },
        {
          fileName: 'BuddyStatement.pdf',
          confirmationCode: 'testing2',
          attachmentId: 'L015',
        },
      ],
    });

    expect(result).to.deep.equal({
      data: ['Form526.pdf', 'BuddyStatement.pdf'],
      label: 'Uploaded file(s)',
    });
  });
});
