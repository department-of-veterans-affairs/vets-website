import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { fireEvent, render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import Sinon from 'sinon';
import { wait } from '@testing-library/dom/dist/wait-for';
import * as manualUploadPage from '../../../pages/form0781/manualUploadPage';

describe('Form 0781 manual upload page', () => {
  const { uiSchema, schema } = manualUploadPage;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.an('object');
  });

  describe('File uploads', () => {
    it('should submit with an upload', () => {
      const onSubmit = Sinon.spy();
      const { container } = render(
        <Provider store={uploadStore}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={onSubmit}
            data={{
              form781Upload: [
                {
                  confirmationCode: 'testing',
                  name: '781.pdf',
                  attachmentId: 'L228',
                },
              ],
            }}
          />
        </Provider>,
      );

      fireEvent.submit($('form', container));
      expect(onSubmit.called).to.be.true;
    });

    it('should not submit without required upload', async () => {
      const onSubmit = Sinon.spy();
      const { container, getByText } = render(
        <Provider store={uploadStore}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      fireEvent.submit($('form', container));
      await wait(() => {
        getByText('You must upload a file');
        expect(onSubmit.called).to.be.false;
      });
    });
  });

  describe('ui:confirmationField', () => {
    it('should correctly display file names and label for confirmation field', () => {
      const testData = [
        {
          confirmationCode: 'testing',
          name: '781.pdf',
          attachmentId: 'L228',
        },
        {
          confirmationCode: 'testing2',
          name: 'Additional781.pdf',
          attachmentId: 'L228',
        },
      ];

      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: testData,
      });

      expect(result).to.deep.equal({
        data: ['781.pdf', 'Additional781.pdf'],
        label: 'Uploaded file(s)',
      });
    });

    it('should display "File name not available" when formData is null', () => {
      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: null,
      });

      expect(result).to.deep.equal({
        data: ['File name not available'],
        label: 'Uploaded file(s)',
      });
    });

    it('should display "File name not available" when formData is undefined', () => {
      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: undefined,
      });

      expect(result).to.deep.equal({
        data: ['File name not available'],
        label: 'Uploaded file(s)',
      });
    });

    it('should display "File name not available" when formData is an empty array', () => {
      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: [],
      });

      expect(result).to.deep.equal({
        data: ['File name not available'],
        label: 'Uploaded file(s)',
      });
    });

    it('should use fileName when name is not available', () => {
      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: [
          {
            fileName: 'BackupFile.pdf',
            confirmationCode: 'testing',
            attachmentId: 'L228',
          },
        ],
      });

      expect(result).to.deep.equal({
        data: ['BackupFile.pdf'],
        label: 'Uploaded file(s)',
      });
    });

    it('should prefer name over fileName when both are available', () => {
      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: [
          {
            name: 'PreferredName.pdf',
            fileName: 'BackupFile.pdf',
            confirmationCode: 'testing',
            attachmentId: 'L228',
          },
        ],
      });

      expect(result).to.deep.equal({
        data: ['PreferredName.pdf'],
        label: 'Uploaded file(s)',
      });
    });

    it('should handle items with neither name nor fileName', () => {
      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: [
          {
            confirmationCode: 'testing',
            attachmentId: 'L228',
          },
        ],
      });

      expect(result).to.deep.equal({
        data: ['File name not available'],
        label: 'Uploaded file(s)',
      });
    });
  });
});
