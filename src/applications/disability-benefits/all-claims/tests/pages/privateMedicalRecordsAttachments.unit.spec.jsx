import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';

describe('526 All Claims Private medical records', () => {
  const errorClass = '.usa-input-error-message';
  const page =
    formConfig.chapters.supportingEvidence.pages
      .privateMedicalRecordsAttachments;
  const { schema, uiSchema } = page;

  it('should render', async () => {
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

    expect(
      form.find('#root_privateMedicalRecordAttachments_add_label').length,
    ).to.equal(1);
    form.unmount();
  });

  it('should expand upload when "yes" option selected', async () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            'view:uploadPrivateRecordsQualifier': {
              'view:hasPrivateRecordsToUpload': true,
            },
          }}
          formData={{}}
        />
      </Provider>,
    );

    expect(
      form.find('#root_privateMedicalRecordAttachments_add_label').length,
    ).to.equal(1);
    form.unmount();
  });

  it('should not submit without an upload if one indicated', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            'view:uploadPrivateRecordsQualifier': {
              'view:hasPrivateRecordsToUpload': true,
            },
          }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      expect(form.find(errorClass).length).to.equal(1); // upload at least 1 doc
    });
    form.unmount();
  });

  it('should not submit without additional upload info', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            'view:uploadPrivateRecordsQualifier': {
              'view:hasPrivateRecordsToUpload': true,
            },
            privateMedicalRecordAttachments: [
              { confirmationCode: '123345asdf' },
            ],
          }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      expect(form.find(errorClass).length).to.equal(1); // name, doc type req'd
    });
    form.unmount();
  });

  it('should submit with all required info', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            'view:uploadPrivateRecordsQualifier': {
              'view:hasPrivateRecordsToUpload': true,
            },
            privateMedicalRecordAttachments: [
              {
                name: 'Test document.pdf',
                attachmentId: 'L107',
                confirmationCode: '123345asdf',
              },
            ],
          }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.calledOnce).to.be.true;
      expect(form.find(errorClass).length).to.equal(0); // name, doc type req'd
    });
    form.unmount();
  });

  describe('ui:confirmationField', () => {
    const confirmationField =
      uiSchema.privateMedicalRecordAttachments['ui:confirmationField'];

    it('should correctly display file names and label for confirmation field', () => {
      const testData = [
        { name: 'medical-record-1.pdf', attachmentId: 'L107' },
        { name: 'lab-results.jpg', attachmentId: 'L107' },
      ];

      const result = confirmationField({ formData: testData });

      expect(result).to.deep.equal({
        data: ['medical-record-1.pdf', 'lab-results.jpg'],
        label: 'Private medical records',
      });
    });

    it('should display "File name not available" when formData is null', () => {
      const result = confirmationField({ formData: null });

      expect(result).to.deep.equal({
        data: ['File name not available'],
        label: 'Private medical records',
      });
    });

    it('should display "File name not available" when formData is undefined', () => {
      const result = confirmationField({ formData: undefined });

      expect(result).to.deep.equal({
        data: ['File name not available'],
        label: 'Private medical records',
      });
    });

    it('should display "File name not available" when formData is an empty array', () => {
      const result = confirmationField({ formData: [] });

      expect(result).to.deep.equal({
        data: ['File name not available'],
        label: 'Private medical records',
      });
    });

    it('should use fileName when name is not available', () => {
      const result = confirmationField({
        formData: [
          {
            fileName: 'scan.pdf',
            attachmentId: 'L107',
          },
        ],
      });

      expect(result).to.deep.equal({
        data: ['scan.pdf'],
        label: 'Private medical records',
      });
    });

    it('should prefer name over fileName when both are available', () => {
      const result = confirmationField({
        formData: [
          {
            name: 'report.pdf',
            fileName: 'backup.pdf',
            attachmentId: 'L107',
          },
        ],
      });

      expect(result).to.deep.equal({
        data: ['report.pdf'],
        label: 'Private medical records',
      });
    });
  });
});
