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

  describe('confirmation page file name display', () => {
    const confirmationField =
      uiSchema.privateMedicalRecordAttachments['ui:confirmationField'];

    it('displays uploaded file names for confirmation review', () => {
      const mockFormData = [
        { name: 'medical-record-1.pdf', attachmentId: 'L107' },
        { name: 'lab-results.jpg', attachmentId: 'L107' },
      ];
      const result = confirmationField({ formData: mockFormData });
      expect(result.data).to.deep.equal([
        'medical-record-1.pdf',
        'lab-results.jpg',
      ]);
      expect(result.label).to.equal('Private medical records');
    });

    it('uses fileName property as fallback when name is not available', () => {
      const mockFormData = [
        { fileName: 'scan.pdf', attachmentId: 'L107' },
        { name: 'report.pdf', attachmentId: 'L107' },
      ];
      const result = confirmationField({ formData: mockFormData });
      expect(result.data).to.deep.equal(['scan.pdf', 'report.pdf']);
      expect(result.label).to.equal('Private medical records');
    });

    it('handles files with missing or empty names gracefully', () => {
      const mockFormData = [
        { attachmentId: 'L107' }, // No name or fileName
        { name: '', attachmentId: 'L107' }, // Empty name
        { name: 'valid-file.pdf', attachmentId: 'L107' },
      ];
      const result = confirmationField({ formData: mockFormData });
      expect(result.data).to.deep.equal([
        undefined,
        undefined,
        'valid-file.pdf',
      ]);
      expect(result.label).to.equal('Private medical records');
    });

    it('handles empty file list', () => {
      const result = confirmationField({ formData: [] });
      expect(result.data).to.deep.equal([]);
      expect(result.label).to.equal('Private medical records');
    });

    it('handles missing file data safely', () => {
      expect(confirmationField({ formData: null }).data).to.be.undefined;
      expect(confirmationField({ formData: undefined }).data).to.be.undefined;
    });
  });
});
