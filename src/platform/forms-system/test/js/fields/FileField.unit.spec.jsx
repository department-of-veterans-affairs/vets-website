import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils.jsx';

import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from 'platform/forms-system/src/js/constants';
import { fileTypeSignatures } from 'platform/forms-system/src/js/utilities/file';
import { FileField } from '../../../src/js/fields/FileField';
import fileUploadUI, { fileSchema } from '../../../src/js/definitions/file';

const formContext = {
  setTouched: sinon.spy(),
};
const requiredSchema = {};

describe('Schemaform <FileField>', () => {
  it('should render', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(
      tree
        .find('label')
        .first()
        .text(),
    ).to.contain('Upload');
    expect(tree.find('span[role="button"]').props()['aria-label']).to.contain(
      'Upload Files',
    );
    tree.unmount();
  });
  it('should render files', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name',
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.find('li').text()).to.contain('Test file name');
    tree.unmount();
  });

  it('should remove files with empty file object when initializing', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test1',
      },
      {
        file: {},
        name: 'Test2',
      },
      {
        file: {
          name: 'fake', // should never happen
        },
        name: 'Test3',
      },
      {
        file: new File([1, 2, 3], 'Test3'),
        name: 'Test4',
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const onChange = sinon.spy();
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={onChange}
        requiredSchema={requiredSchema}
      />,
    );

    expect(onChange.calledOnce).to.be.true;
    expect(onChange.firstCall.args[0].length).to.equal(3);
    // empty file object was removed;
    expect(onChange.firstCall.args[0][1].name).to.equal('Test3');

    tree.unmount();
  });

  it('should call onChange once when deleting files', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name',
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const onChange = sinon.spy();

    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={onChange}
        requiredSchema={requiredSchema}
      />,
    );

    tree.instance().removeFile(0);

    expect(onChange.calledOnce).to.be.true;
    expect(onChange.firstCall.args.length).to.equal(0);
    tree.unmount();
  });

  it('should render uploading', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        uploading: true,
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.find('va-progress-bar').exists()).to.be.true;
    const button = tree.find('button');
    expect(button.text()).to.equal('Cancel');
    expect(button.prop('aria-describedby')).to.eq('field_file_name_0');
    tree.unmount();
  });

  it('should update progress', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        uploading: true,
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.find('va-progress-bar').props().percent).to.equal(0);

    tree.instance().updateProgress(20);
    tree.update();

    expect(tree.find('va-progress-bar').props().percent).to.equal(20);
    tree.unmount();
  });
  it('should render error', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        errorMessage: 'asdfas',
      },
    ];
    const errorSchema = {
      0: {
        __errors: ['Bad error'],
      },
    };
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        errorSchema={errorSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    // Prepend 'Error' for screenreader
    expect(tree.find('.va-growable-background').text()).to.contain(
      'Error Bad error',
    );
    expect(tree.find('span[role="alert"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should not render upload button if over max items', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      maxItems: 1,
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name',
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.find('label').exists()).to.be.false;
    tree.unmount();
  });
  it('should not render upload or delete button on review & submit page while in review mode', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name',
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={{ reviewMode: true }}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.find('label').exists()).to.be.false;
    expect(tree.find('button.usa-button-secondary').exists()).to.be.false;
    tree.unmount();
  });
  it('should render upload or delete button on review & submit page while in edit mode', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name',
        size: 12345678,
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={{ reviewMode: false }}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.find('label').exists()).to.be.true;
    expect(tree.find('button.usa-button-secondary').exists()).to.be.true;

    const text = tree.text();
    expect(text).to.include('Test file name');
    expect(text).to.include('12MB');
    tree.unmount();
  });

  it('should delete file', () => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema,
      },
    };
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{
            fileField: [
              {
                confirmationCode: 'asdfasfd',
              },
            ],
          }}
          uiSchema={{
            fileField: uiSchema,
          }}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('li')).not.to.be.empty;

    formDOM.click('.va-growable-background button');

    expect(formDOM.querySelectorAll('li')).to.be.empty;
  });

  it('should upload png file', () => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema,
      },
    };
    const mockFile = {
      name: 'test.png',
      type: fileTypeSignatures.png.mime,
    };
    const uiOptions = {
      ...uiSchema['ui:options'],
      mockReadAndCheckFile: () => ({
        checkIsEncryptedPdf: false,
        checkTypeAndExtensionMatches: true,
      }),
    };
    const uploadFile = sinon.spy();
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{
            fileField: [],
          }}
          uploadFile={uploadFile}
          uiSchema={{
            fileField: { ...uiSchema, 'ui:options': uiOptions },
          }}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.files('input[type=file]', [mockFile]);

    expect(uploadFile.firstCall.args[0]).to.eql(mockFile);
    expect(uploadFile.firstCall.args[1]).to.eql(uiOptions);
    expect(uploadFile.firstCall.args[2]).to.be.a('function');
    expect(uploadFile.firstCall.args[3]).to.be.a('function');
    expect(uploadFile.firstCall.args[4]).to.be.a('function');
  });

  it('should upload unencrypted pdf file', done => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema,
      },
    };
    const uploadFile = sinon.spy();
    const mockPDFFile = {
      name: 'test.PDF',
      type: fileTypeSignatures.pdf.mime,
    };
    const uiOptions = {
      ...uiSchema['ui:options'],
      mockReadAndCheckFile: () => ({
        checkIsEncryptedPdf: false,
        checkTypeAndExtensionMatches: true,
      }),
    };
    const fileField = {
      ...uiSchema,
      'ui:options': uiOptions,
    };

    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{ fileField: [] }}
          uploadFile={uploadFile}
          uiSchema={{ fileField }}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.files('input[type=file]', [mockPDFFile]);

    setTimeout(() => {
      expect(uploadFile.firstCall.args[0]).to.eql(mockPDFFile);
      expect(uploadFile.firstCall.args[1]).to.eql(uiOptions);
      expect(uploadFile.firstCall.args[2]).to.be.a('function');
      expect(uploadFile.firstCall.args[3]).to.be.a('function');
      expect(uploadFile.firstCall.args[4]).to.be.a('function');
      done();
    });
  });
  it('should not call uploadFile when initially adding an encrypted PDF', done => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema,
      },
    };
    const uploadFile = sinon.spy();
    const isFileEncrypted = () => Promise.resolve(true);
    const fileField = {
      ...uiSchema,
      'ui:options': {
        ...uiSchema['ui:options'],
        isFileEncrypted,
      },
    };

    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{ fileField: [] }}
          uploadFile={uploadFile}
          uiSchema={{ fileField }}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.files('input[type=file]', [{ name: 'test-pw.pdf' }]);

    setTimeout(() => {
      expect(uploadFile.notCalled).to.be.true;
      done();
    });
  });

  it('should render file with attachment type', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {
        type: 'object',
        properties: {
          attachmentId: {
            type: 'string',
          },
        },
      },
      items: [
        {
          type: 'object',
          properties: {
            attachmentId: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name.pdf',
        size: 54321,
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    const text = tree.find('li').text();
    expect(text).to.contain('Test file name.pdf');
    expect(text).to.contain('53KB');
    expect(tree.find('SchemaField').prop('schema')).to.equal(
      schema.items[0].properties.attachmentId,
    );
    tree.unmount();
  });

  it('should render file with attachmentName', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {
        type: 'object',
        properties: {
          attachmentId: {
            type: 'string',
          },
        },
      },
      items: [
        {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = fileUploadUI('Files', {
      attachmentName: ({ fileId, index }) => ({
        'ui:title': 'Document name',
        'ui:options': {
          widgetProps: {
            'aria-describedby': fileId,
            'data-index': index,
          },
        },
      }),
    });
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name',
        size: 987654,
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    const text = tree.find('li').text();
    expect(text).to.contain('Test file name');
    expect(text).to.contain('965KB');
    expect(tree.find('button').prop('aria-describedby')).to.eq(
      'field_file_name_0',
    );

    // check ids & index passed into SchemaField
    const schemaProps = tree.find('SchemaField').props();
    const { widgetProps } = schemaProps.uiSchema['ui:options'];
    expect(schemaProps.schema).to.equal(schema.items[0].properties.name);
    expect(schemaProps.registry.formContext.pagePerItemIndex).to.eq(0);
    expect(widgetProps['aria-describedby']).to.eq('field_file_name_0');
    expect(widgetProps['data-index']).to.eq(0);

    tree.unmount();
  });
  it('should render file with attachmentSchema', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      type: 'array',
      additionalItems: {
        type: 'object',
        properties: {
          attachmentId: {
            type: 'string',
          },
        },
      },
      items: [
        {
          type: 'object',
          properties: {
            attachmentId: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = fileUploadUI('Files', {
      attachmentName: false,
      attachmentSchema: ({ fileId, index }) => ({
        'ui:title': 'Document type',
        'ui:options': {
          widgetProps: {
            'aria-describedby': fileId,
            'data-index': index,
          },
        },
      }),
    });
    const formData = [
      {
        attachmentId: '1234',
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.find('button').prop('aria-describedby')).to.eq(
      'field_file_name_0',
    );

    // check ids & index passed into SchemaField
    const schemaProps = tree.find('SchemaField').props();
    const { widgetProps } = schemaProps.uiSchema['ui:options'];
    expect(schemaProps.schema).to.equal(
      schema.items[0].properties.attachmentId,
    );
    expect(schemaProps.registry.formContext.pagePerItemIndex).to.eq(0);
    expect(widgetProps['aria-describedby']).to.eq('field_file_name_0');
    expect(widgetProps['data-index']).to.eq(0);

    tree.unmount();
  });

  // Accessibility checks
  it('should render a div wrapper when not on the review page', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {
        type: 'object',
        properties: {
          attachmentId: {
            type: 'string',
          },
        },
      },
      items: [
        {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = fileUploadUI('Files', {
      attachmentSchema: {
        'ui:title': 'Document ID',
      },
      attachmentName: {
        'ui:title': 'Document name',
      },
    });
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name',
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={{ onReviewPage: false }}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    // expect dl wrapper on review page
    expect(tree.find('div.review').exists()).to.be.true;
    tree.unmount();
  });
  it('should render a dl wrapper when on the review page', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {
        type: 'object',
        properties: {
          attachmentId: {
            type: 'string',
          },
        },
      },
      items: [
        {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = fileUploadUI('Files', {
      attachmentName: {
        'ui:title': 'Document name',
      },
    });
    const formData = [
      {
        confirmationCode: 'asdfds',
        name: 'Test file name',
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={{ onReviewPage: true, reviewMode: true }}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    // expect dl wrapper on review page
    expect(tree.find('dl.review').exists()).to.be.true;
    tree.unmount();
  });

  it('should render schema title', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      title: 'schema title',
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI(<p>uiSchema title</p>);
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.find('span[role="button"]').props()['aria-label']).to.contain(
      'schema title',
    );
    tree.unmount();
  });

  it('should render cancel button with secondary class', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        uploading: true,
      },
    ];
    const registry = {
      fields: {
        SchemaField: f => f,
      },
    };
    const tree = shallow(
      <FileField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    const cancelButton = tree.find('button.usa-button-secondary');
    expect(cancelButton.text()).to.equal('Cancel');
    tree.unmount();
  });

  describe('enableShortWorkflow is true', () => {
    const mockIdSchema = {
      $id: 'field',
    };
    const mockSchema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
      maxItems: 4,
    };
    const mockUiSchema = fileUploadUI('Files');
    const mockFormDataWithError = [
      {
        errorMessage: 'some error message',
      },
    ];
    const mockErrorSchemaWithError = {
      0: {
        __errors: ['ERROR-123'],
      },
    };
    const mockRegistry = {
      fields: {
        SchemaField: f => f,
      },
    };

    it('should not render main upload button while file has error', () => {
      const idSchema = {
        $id: 'myIdSchemaId',
      };
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={idSchema}
          errorSchema={mockErrorSchemaWithError}
          formData={mockFormDataWithError}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
          enableShortWorkflow
        />,
      );

      // id for main upload button is interpolated {idSchema.$id}_add_label
      const mainUploadButton = tree.find('#myIdSchemaId_add_label');
      expect(mainUploadButton.exists()).to.be.false;
      tree.unmount();
    });

    it('should render Upload a new file button for file with error', () => {
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={mockIdSchema}
          errorSchema={mockErrorSchemaWithError}
          formData={mockFormDataWithError}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
          enableShortWorkflow
        />,
      );

      // This button is specific to the file that has the error
      const errorFileUploadButton = tree.find('button.usa-button-primary');
      expect(errorFileUploadButton.text()).to.equal('Upload a new file');
      tree.unmount();
    });

    it('should render Try again button for file with error', () => {
      const errorSchema = {
        0: {
          __errors: [FILE_UPLOAD_NETWORK_ERROR_MESSAGE],
        },
      };
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={mockIdSchema}
          errorSchema={errorSchema}
          formData={mockFormDataWithError}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
          enableShortWorkflow
        />,
      );

      // This button is specific to the file that has the error
      const individualFileTryAgainButton = tree.find(
        'button.usa-button-primary',
      );
      expect(individualFileTryAgainButton.text()).to.equal('Try again');
      tree.unmount();
    });

    it('should render remove file button as cancel', () => {
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={mockIdSchema}
          errorSchema={mockErrorSchemaWithError}
          formData={mockFormDataWithError}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
          enableShortWorkflow
        />,
      );

      // This button is specific to the file that has the error
      const cancelButton = tree.find('button.usa-button-secondary');
      expect(cancelButton.text()).to.equal('Cancel');
      tree.unmount();
    });

    it('should render delete button for successfully uploaded file', () => {
      const formData = [
        {
          uploading: false,
        },
      ];
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={mockIdSchema}
          formData={formData}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
          enableShortWorkflow
        />,
      );

      // This button is specific to the file that was uploaded
      const deleteButton = tree.find('button.usa-button-secondary');
      expect(deleteButton.text()).to.equal('Delete file');
      tree.unmount();
    });
  });

  describe('enableShortWorkflow is false', () => {
    const mockIdSchema = {
      $id: 'field',
    };
    const mockSchema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
      maxItems: 4,
    };
    const mockUiSchema = fileUploadUI('Files');
    const mockFormDataWithError = [
      {
        errorMessage: 'some error message',
      },
    ];
    const mockErrorSchemaWithError = {
      0: {
        __errors: ['ERROR-123'],
      },
    };
    const mockRegistry = {
      fields: {
        SchemaField: f => f,
      },
    };

    it('should render main upload button while any file has error', () => {
      const idSchema = {
        $id: 'myIdSchemaId',
      };
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={idSchema}
          errorSchema={mockErrorSchemaWithError}
          formData={mockFormDataWithError}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
        />,
      );

      // id for main upload button is interpolated {idSchema.$id}_add_label
      const mainUploadButton = tree.find('#myIdSchemaId_add_label');
      expect(mainUploadButton.exists()).to.be.true;
      tree.unmount();
    });

    it('should render remove file button as Delete file', () => {
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={mockIdSchema}
          errorSchema={mockErrorSchemaWithError}
          formData={mockFormDataWithError}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
        />,
      );

      // This button is specific to the file that has the error
      const deleteFileButton = tree.find('button.usa-button-secondary');
      expect(deleteFileButton.text()).to.equal('Delete file');
      tree.unmount();
    });

    it('should render delete button for successfully uploaded file', () => {
      const formData = [
        {
          uploading: false,
        },
      ];
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={mockIdSchema}
          formData={formData}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
        />,
      );

      // This button is specific to the file that was uploaded
      const deleteButton = tree.find('button.usa-button-secondary');
      expect(deleteButton.text()).to.equal('Delete file');
      tree.unmount();
    });

    it('should not render individual file Try again button', () => {
      const errorSchema = {
        0: {
          __errors: [FILE_UPLOAD_NETWORK_ERROR_MESSAGE],
        },
      };
      const tree = shallow(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={mockIdSchema}
          errorSchema={errorSchema}
          formData={mockFormDataWithError}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
        />,
      );

      // The retry button should be the only primary button. Should not be present
      // with enableShortWorkflow not enabled
      const individualFileTryAgainButton = tree.find(
        'button.usa-button-primary',
      );
      expect(individualFileTryAgainButton.exists()).to.be.false;
      tree.unmount();
    });
  });
});
