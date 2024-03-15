import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from 'platform/forms-system/src/js/constants';
import { fileTypeSignatures } from 'platform/forms-system/src/js/utilities/file';
import fileUploadUI, {
  fileSchema,
} from 'platform/forms-system/src/js/definitions/file';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { MISSING_PASSWORD_ERROR } from 'platform/forms-system/src/js/validation';
import { FileField } from '../../../components/FileField';

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
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    const uploadButton = $('#upload-button', container);
    expect(uploadButton).to.have.attribute('text', 'Upload');
    const fileInput = $('input[type="file"]', container);
    expect(fileInput).to.have.attribute('accept', '.pdf,.jpg,.jpeg,.png');
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    expect($('li', container).textContent).to.contain('Test file name.pdf');
    expect($('strong.dd-privacy-hidden[data-dd-action-name]', container)).to
      .exist;
  });

  it('should render uswds components', () => {
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
    const uiSchema = fileUploadUI('Files', { uswds: true });
    const formData = [
      {
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    expect($('.delete-upload[uswds]', container)).to.exist;
    expect($('#upload-button[uswds]', container)).to.exist;
  });

  it('should remove files with empty file object when initializing', async () => {
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
        confirmationCode: 'abcdef',
        name: 'Test1.png',
      },
      {
        file: {},
        name: 'Test2.pdf',
      },
      {
        file: {
          name: 'fake', // should never happen
        },
        name: 'Test3.txt',
      },
      {
        file: new File([1, 2, 3], 'Test4.jpg'),
        name: 'Test4.jpg',
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const onChange = sinon.spy();
    render(
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

    await waitFor(() => {
      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0].length).to.equal(3);
      // empty file object was removed;
      expect(onChange.firstCall.args[0][1].name).to.equal('Test3.txt');
    });
  });

  it('should call onChange once when deleting files', async () => {
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const onChange = sinon.spy();

    const { container } = render(
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

    const modal = $('va-modal', container);
    expect(modal.getAttribute('visible')).to.eq('false');

    fireEvent.click($('.delete-upload', container));
    expect(modal.getAttribute('visible')).to.eq('true');

    // click yes in modal
    $('va-modal', container).__events.primaryButtonClick();

    await waitFor(() => {
      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args.length).to.equal(0);
    });
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
        name: 'Test.pdf',
        uploading: true,
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    expect($('va-progress-bar', container)).to.exist;
    const button = $('.cancel-upload', container);
    expect(button).to.exist;
    expect(button.getAttribute('text')).to.eq('Cancel');
    expect(button.getAttribute('label')).to.eq('Cancel upload of Test.pdf');
  });

  it('should show progress', () => {
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
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    const progressBar = $('va-progress-bar', container);
    expect(progressBar.getAttribute('percent')).to.equal('0');

    // How to call `updateProgress(20)`? This method doesn't work:
    // https://github.com/testing-library/react-testing-library/issues/638#issuecomment-615937561
    // expect(progressBar.getAttribute('percent')).to.equal('20');
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
        errorMessage: 'some error',
      },
    ];
    const errorSchema = {
      0: {
        __errors: ['Bad error'],
      },
    };
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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
    expect($('.va-growable-background', container).textContent).to.contain(
      'Error Bad error',
    );
    expect($('span[role="alert"]', container)).to.exist;
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    expect($('.upload-button-label', container)).to.not.exist;
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    expect($('.upload-button-label', container)).to.not.exist;
    expect($('.delete-upload', container)).to.not.exist;
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
        size: 12345678,
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    expect($('.upload-button-label', container)).to.exist;
    expect($('.delete-upload', container)).to.exist;

    const text = $('li', container).textContent;
    expect(text).to.include('Test file name.pdf');
    expect(text).to.include('12MB');
  });

  it('should delete file', async () => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema,
      },
    };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{
            fileField: [
              {
                confirmationCode: 'abcdef',
              },
            ],
          }}
          uiSchema={{
            fileField: uiSchema,
          }}
        />
      </Provider>,
    );

    const uploadButton = $('#upload-button', container);
    expect($$('li', container)).to.not.be.empty;

    const modal = $('va-modal', container);
    expect(modal.getAttribute('visible')).to.eq('false');

    fireEvent.click($('.delete-upload', container));
    expect(modal.getAttribute('visible')).to.eq('true');

    // click yes in modal
    $('va-modal', container).__events.primaryButtonClick();

    await waitFor(() => {
      expect($$('li', container)).to.be.empty;
      expect(document.activeElement).to.eq(uploadButton);
    });
  });

  it('should not delete file when "No" is selected in modal', async () => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema,
      },
    };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{
            fileField: [
              {
                confirmationCode: 'abcdef',
              },
            ],
          }}
          uiSchema={{
            fileField: uiSchema,
          }}
        />
      </Provider>,
    );

    expect($$('li', container)).to.not.be.empty;

    const modal = $('va-modal', container);
    expect(modal.getAttribute('visible')).to.eq('false');

    const deleteButton = $('.delete-upload', container);
    fireEvent.click(deleteButton);
    expect(modal.getAttribute('visible')).to.eq('true');

    // click no in modal
    $('va-modal', container).__events.secondaryButtonClick();

    await waitFor(() => {
      expect($$('li', container)).to.not.be.empty;
      expect(document.activeElement).to.eq(deleteButton);
    });
  });

  it('should upload png file', async () => {
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

    await waitFor(() => {
      expect(uploadFile.firstCall.args[0]).to.eql(mockFile);
      expect(uploadFile.firstCall.args[1]).to.eql(uiOptions);
      expect(uploadFile.firstCall.args[2]).to.be.a('function');
      expect(uploadFile.firstCall.args[3]).to.be.a('function');
      expect(uploadFile.firstCall.args[4]).to.be.a('function');
    });
  });

  it('should upload unencrypted pdf file', async () => {
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

    await waitFor(() => {
      expect(uploadFile.firstCall.args[0]).to.eql(mockPDFFile);
      expect(uploadFile.firstCall.args[1]).to.eql(uiOptions);
      expect(uploadFile.firstCall.args[2]).to.be.a('function');
      expect(uploadFile.firstCall.args[3]).to.be.a('function');
      expect(uploadFile.firstCall.args[4]).to.be.a('function');
    });
  });

  it('should upload test file using "testing" file type to bypass checks', async () => {
    const uiSchema = fileUploadUI('Files');
    const schema = {
      type: 'object',
      properties: {
        fileField: fileSchema,
      },
    };
    const mockFile = {
      name: 'test.pdf',
      type: 'testing',
    };
    const uploadFile = sinon.spy();
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          data={{ fileField: [] }}
          uploadFile={uploadFile}
          uiSchema={{ fileField: uiSchema }}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.files('input[type=file]', [mockFile]);

    await waitFor(() => {
      expect(uploadFile.firstCall.args[0]).to.eql(mockFile);
      expect(uploadFile.firstCall.args[1]).to.eql(uiSchema['ui:options']);
      expect(uploadFile.firstCall.args[2]).to.be.a('function');
      expect(uploadFile.firstCall.args[3]).to.be.a('function');
      expect(uploadFile.firstCall.args[4]).to.be.a('function');
    });
  });

  it('should not call uploadFile when initially adding an encrypted PDF', async () => {
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

    await waitFor(() => {
      expect(uploadFile.notCalled).to.be.true;
    });
  });

  it('should render file with attachment type', () => {
    let testProps = null;
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
        size: 54321,
      },
    ];
    const registry = {
      fields: {
        SchemaField: props => {
          testProps = props;
          return <div />;
        },
      },
    };
    const { container } = render(
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

    const text = $('li', container).textContent;
    expect(text).to.contain('Test file name.pdf');
    expect(text).to.contain('53KB');

    expect(testProps.schema.type).to.eq('string');
  });

  it('should render file with attachmentName', () => {
    let testProps = null;
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
        size: 987654,
      },
    ];
    const registry = {
      fields: {
        SchemaField: props => {
          testProps = props;
          return <div />;
        },
      },
    };
    const { container } = render(
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

    const text = $('li').textContent;
    expect(text).to.contain('Test file name.pdf');
    expect(text).to.contain('965KB');

    const deleteButton = $('.delete-upload', container);
    expect(deleteButton?.getAttribute('label')).to.eq(
      'Delete Test file name.pdf',
    );

    // check ids & index passed into SchemaField
    expect(testProps.schema).to.equal(schema.items[0].properties.name);
    expect(testProps.registry.formContext.pagePerItemIndex).to.eq(0);

    const { widgetProps } = testProps.uiSchema['ui:options'];
    expect(widgetProps['aria-describedby']).to.eq('field_file_name_0');
    expect(widgetProps['data-index']).to.eq(0);
  });

  it('should render file with attachmentSchema', () => {
    let testProps = null;
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
        name: 'Test file name.pdf',
        attachmentId: '1234',
      },
    ];
    const registry = {
      fields: {
        SchemaField: props => {
          testProps = props;
          return <div />;
        },
      },
    };
    const { container } = render(
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

    expect($('.delete-upload', container).getAttribute('label')).to.eq(
      'Delete Test file name.pdf',
    );

    // check ids & index passed into SchemaField
    const { widgetProps } = testProps.uiSchema['ui:options'];
    expect(testProps.schema).to.equal(schema.items[0].properties.attachmentId);
    expect(testProps.registry.formContext.pagePerItemIndex).to.eq(0);
    expect(widgetProps['aria-describedby']).to.eq('field_file_name_0');
    expect(widgetProps['data-index']).to.eq(0);
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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
    expect($('div.review', container)).to.exist;
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
        confirmationCode: 'abcdef',
        name: 'Test file name.pdf',
      },
    ];
    const registry = {
      fields: {
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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
    expect($('dl.review', container)).to.exist;
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
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    expect($('#upload-button', container).getAttribute('label')).to.contain(
      'schema title',
    );
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
        SchemaField: () => <div />,
      },
    };
    const { container } = render(
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

    const cancelButton = $('.cancel-upload', container);
    expect(cancelButton.getAttribute('text')).to.equal('Cancel');
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
        SchemaField: () => <div />,
      },
    };

    it('should not render main upload button while file has error', () => {
      const idSchema = {
        $id: 'myIdSchemaId',
      };
      const { container } = render(
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
      const mainUploadButton = $('#myIdSchemaId_add_label', container);
      expect(mainUploadButton).to.not.exist;
    });

    it('should render Upload a new file button for file with error', () => {
      const { container } = render(
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
      const errorFileUploadButton = $('.retry-upload', container);
      expect(errorFileUploadButton.getAttribute('text')).to.equal(
        'Upload a new file',
      );
    });

    it('should render Try again button for file with error', () => {
      const errorSchema = {
        0: {
          __errors: [FILE_UPLOAD_NETWORK_ERROR_MESSAGE],
        },
      };
      const { container } = render(
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
      const individualFileTryAgainButton = $('.retry-upload', container);
      expect(individualFileTryAgainButton.getAttribute('text')).to.equal(
        'Try again',
      );
    });

    it('should render remove file button as cancel', () => {
      const { container } = render(
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
      const cancelButton = $('.delete-upload', container);
      expect(cancelButton.getAttribute('text')).to.equal('Cancel');
    });

    it('should render delete button for successfully uploaded file', () => {
      const formData = [
        {
          uploading: false,
        },
      ];
      const { container } = render(
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
      const deleteButton = $('.delete-upload', container);
      expect(deleteButton.getAttribute('text')).to.equal('Delete file');
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
        SchemaField: () => <div />,
      },
    };

    it('should render main upload button while any file has error', () => {
      const idSchema = {
        $id: 'myIdSchemaId',
      };
      const { container } = render(
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
      const mainUploadButton = $('#myIdSchemaId_add_label', container);
      expect(mainUploadButton).to.exist;
      expect($('.usa-input-error-message', container).textContent).to.eq(
        'Error ERROR-123',
      );
    });

    it('should not render missing password error', () => {
      const idSchema = {
        $id: 'myIdSchemaId',
      };
      const mockFormDataWithPasswordError = [
        {
          errorMessage: MISSING_PASSWORD_ERROR,
        },
      ];
      const mockErrorSchemaWithPasswordError = [
        {
          __errors: [MISSING_PASSWORD_ERROR],
        },
      ];
      const { container } = render(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={idSchema}
          errorSchema={mockFormDataWithPasswordError}
          formData={mockErrorSchemaWithPasswordError}
          formContext={formContext}
          onChange={f => f}
          requiredSchema={requiredSchema}
        />,
      );

      expect($('.usa-input-error-message', container)).to.not.exist;
    });

    it('should render remove file button as Delete file', () => {
      const { container } = render(
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
      const deleteFileButton = $('.delete-upload', container);
      expect(deleteFileButton.getAttribute('text')).to.equal('Delete file');
    });

    it('should render delete button for successfully uploaded file', () => {
      const formData = [
        {
          uploading: false,
        },
      ];
      const { container } = render(
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
      const deleteButton = $('.delete-upload', container);
      expect(deleteButton.getAttribute('text')).to.equal('Delete file');
    });

    it('should not render individual file Try again button', () => {
      const errorSchema = {
        0: {
          __errors: [FILE_UPLOAD_NETWORK_ERROR_MESSAGE],
        },
      };
      const { container } = render(
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
      const individualFileTryAgainButton = $('.retry-upload', container);
      expect(individualFileTryAgainButton).to.not.exist;
    });
  });
});
