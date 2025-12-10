import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('781 record upload', () => {
  const page = formConfig.chapters.disabilities.pages.uploadPtsdDocuments781;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', async () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            'view:selectablePtsdTypes': {
              'view:combatPtsdType': true,
            },
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should not submit without required upload', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            'view:selectablePtsdTypes': {
              'view:combatPtsdType': true,
            },
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should submit with uploaded form', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            form781Upload: [
              {
                confirmationCode: 'testing',
                name: '781.pdf',
                attachmentId: 'L228',
              },
            ],
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
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

      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: testData,
      });

      expect(result).to.deep.equal({
        data: ['Test.pdf', 'Test2.pdf'],
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
            fileName: 'scan.pdf',
            attachmentId: 'L228',
          },
        ],
      });

      expect(result).to.deep.equal({
        data: ['scan.pdf'],
        label: 'Uploaded file(s)',
      });
    });

    it('should prefer name over fileName when both are available', () => {
      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: [
          {
            name: 'records.pdf',
            fileName: 'backup.pdf',
            attachmentId: 'L228',
          },
        ],
      });

      expect(result).to.deep.equal({
        data: ['records.pdf'],
        label: 'Uploaded file(s)',
      });
    });

    it('should handle items with neither name nor fileName', () => {
      const result = uiSchema.form781Upload['ui:confirmationField']({
        formData: [
          {
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
