import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';

describe('serviceTreatmentRecords', () => {
  const errorClass = '.usa-input-error-message';
  const {
    uiSchema,
    schema,
  } = formConfig.chapters.supportingEvidence.pages.serviceTreatmentRecordsAttachments;

  it('should render', async () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          schema={schema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    expect(form.find('input[type="file"]').length).to.equal(1);
    expect(
      form.find('#root_serviceTreatmentRecordsAttachments_add_label').length,
    ).to.equal(1);
    form.unmount();
  });

  it('should not submit without an upload if one indicated', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          schema={schema}
          data={{
            'view:uploadServiceTreatmentRecordsQualifier': {
              'view:hasServiceTreatmentRecordsToUpload': true,
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
      expect(form.find(errorClass).length).to.equal(1); // upload at least 1 document
    });
    form.unmount();
  });

  it('should not submit without additional upload info', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          schema={schema}
          data={{
            'view:uploadServiceTreatmentRecordsQualifier': {
              'view:hasServiceTreatmentRecordsToUpload': true,
            },
            serviceTreatmentRecordsAttachments: [{ confirmationCode: '1234' }],
          }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      expect(form.find(errorClass).length).to.equal(1); // name and attachment ID required
    });
    form.unmount();
  });

  it('should submit with all required info', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          schema={schema}
          data={{
            'view:uploadServiceTreatmentRecordsQualifier': {
              'view:hasServiceTreatmentRecordsToUpload': true,
            },
            serviceTreatmentRecordsAttachments: [
              {
                name: 'Test.pdf',
                attachmentId: 'L450',
                confirmationCode: '1234',
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
      expect(form.find(errorClass).length).to.equal(0);
    });
    form.unmount();
  });

  describe('ui:confirmationField', () => {
    it('should correctly display file names and label for confirmation field', () => {
      const testData = [
        {
          name: 'Test.pdf',
          attachmentId: 'L450',
          confirmationCode: '1234',
        },
        {
          name: 'Test2.pdf',
          confirmationCode: 'L451',
          attachmentId: '4321',
        },
      ];

      const result = uiSchema.serviceTreatmentRecordsAttachments[
        'ui:confirmationField'
      ]({
        formData: testData,
      });

      expect(result).to.deep.equal({
        data: ['Test.pdf', 'Test2.pdf'],
        label: 'Uploaded file(s)',
      });
    });
  });
});
