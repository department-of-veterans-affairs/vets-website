import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import formConfig from '../../config/form';

describe('Secondary Upload Sources', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.secondaryUploadSources0;

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
      form.find('#root_secondaryUploadSources0_add_label').length,
    ).to.equal(1);
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

      const result = uiSchema.secondaryUploadSources0['ui:confirmationField']({
        formData: testData,
      });

      expect(result).to.deep.equal({
        data: ['Test.pdf', 'Test2.pdf'],
        label: 'Uploaded file(s)',
      });
    });
  });
});
