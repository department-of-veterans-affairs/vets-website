import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { uploadStore } from '~/platform/forms-system/test/config/helpers';
import {
  DefinitionTester,
  getFormDOM,
} from '~/platform/testing/unit/schemaform-utils';

import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from '~/platform/forms-system/src/js/constants';
import { fileTypeSignatures } from '~/platform/forms-system/src/js/utilities/file';
import fileUploadUI, {
  fileSchema,
} from '~/platform/forms-system/src/js/definitions/file';
import FileField from '../../components/FileField';

import {
  errormessageMaps,
  FILE_NAME_TOO_LONG_ERROR,
  MAX_FILE_NAME_LENGTH,
  MISSING_PASSWORD_ERROR,
  INCORRECT_PASSWORD_ERROR,
} from '../../utils/upload';

const formContext = {
  setTouched: sinon.spy(),
};
const requiredSchema = {};

describe('Schemaform <FileField>', () => {
  const idSchema = {
    $id: 'field',
  };
  it('should render', () => {
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

  it('should render components', () => {
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
        size: 100000,
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

    expect($('.delete-upload', container)).to.exist;
    expect($('#upload-button', container)).to.exist;
    const content = $('.schemaform-file-list li', container).textContent;
    expect(content).to.contain('Test file name.pdf');
    expect(content).to.contain('98KB');
  });

  it('should remove files with empty file object when initializing', async () => {
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const test4 = new File([1, 2, 3], 'Test4.jpg');
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
        file: test4,
        name: 'Test4.jpg',
      },
      {
        file: {},
        errorMessage: 'error!',
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

    const result = [
      { confirmationCode: 'abcdef', name: 'Test1.png' },
      { file: { name: 'fake' }, name: 'Test3.txt' },
      { file: test4, name: 'Test4.jpg' },
    ];
    await waitFor(() => {
      expect(onChange.callCount).to.eq(2);
      expect(onChange.firstCall.args[0]).to.deep.equal(result);
      // empty file object was removed;
      expect(onChange.firstCall.args[0][1].name).to.equal('Test3.txt');
      expect(onChange.secondCall.args[0]).to.deep.equal(result);
    });
  });

  it('should not initially show the password input if the file is encrypted', async () => {
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Evidence');
    const data = [
      {
        file: new File(
          [`${fileTypeSignatures.pdf.sig} /Encrypt test`],
          'test.pdf',
          { type: fileTypeSignatures.pdf.mime },
        ),
        name: 'test.pdf',
        isEncrypted: true,
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
        formData={data}
        formContext={formContext}
        onChange={onChange}
        requiredSchema={requiredSchema}
      />,
    );

    await waitFor(() => {
      const passwordInput = $('va-text-input[label="PDF password"]', container);
      expect(passwordInput).to.not.exist;
    });
  });

  it('should show the password input if the file is encrypted after the server returns a password error', async () => {
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Evidence');
    const data = [
      {
        file: new File(
          [`${fileTypeSignatures.pdf.sig} /Encrypt test`],
          'test.pdf',
          { type: fileTypeSignatures.pdf.mime },
        ),
        name: 'test.pdf',
        isEncrypted: true,
        errorMessage: MISSING_PASSWORD_ERROR[1],
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
        formData={data}
        formContext={formContext}
        onChange={onChange}
        requiredSchema={requiredSchema}
      />,
    );

    await waitFor(() => {
      const passwordInput = $('va-text-input[label="PDF password"]', container);
      expect(passwordInput).to.exist;
    });
  });

  it('should still show the password input if the file is encrypted after the server returns an incorrect password error', async () => {
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Evidence');
    const data = [
      {
        file: new File(
          [`${fileTypeSignatures.pdf.sig} /Encrypt test`],
          'test.pdf',
          { type: fileTypeSignatures.pdf.mime },
        ),
        name: 'test.pdf',
        isEncrypted: true,
        errorMessage: INCORRECT_PASSWORD_ERROR,
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
        formData={data}
        formContext={formContext}
        onChange={onChange}
        requiredSchema={requiredSchema}
      />,
    );

    await waitFor(() => {
      const passwordInput = $('va-text-input[label="PDF password"]', container);
      expect(passwordInput).to.exist;
    });
  });

  it('should call onChange once when deleting files', async () => {
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
    expect($('div.usa-input-error-message', container)).to.exist;
  });

  it('should render file name too long error', async () => {
    const onChangeSpy = sinon.spy();
    const schema = {
      additionalItems: {},
      items: [
        {
          properties: {},
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const fileWithLongName = new File(
      ['test 123'],
      'a'.repeat(MAX_FILE_NAME_LENGTH + 1),
      {
        type: fileTypeSignatures.pdf.mime,
      },
    );
    const errorSchema = {};
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
        formData={[]}
        formContext={formContext}
        onChange={onChangeSpy}
        requiredSchema={requiredSchema}
      />,
    );

    fireEvent.change($('input[type="file"]', container), {
      target: { files: [fileWithLongName] },
    });

    expect(onChangeSpy.calledOnce).to.be.true;
    expect(onChangeSpy.args[0][0][0].errorMessage).to.eq(
      FILE_NAME_TOO_LONG_ERROR,
    );
  });

  it('should remap PDF dimension error', () => {
    const error = 'exceeds the page size limit';
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
        errorMessage: error,
      },
    ];
    const errorSchema = {
      0: {
        __errors: [error],
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

    const errorMsg = $('div.usa-input-error-message', container);
    expect(errorMsg).to.exist;
    expect(errorMsg.textContent).to.contain(errormessageMaps[error]);
  });

  it('should not render upload button if over max items', () => {
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

    expect($('.upload-wrap', container).className).to.include('display--none');
  });

  it('should not render upload or delete button on review & submit page while in review mode', () => {
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
      attachmentSchema: ({ fileId, index, fileName }) => ({
        'ui:title': 'Document type',
        'ui:options': {
          messageAriaDescribedby: `test with ${fileName}`,
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
    const options = testProps.uiSchema['ui:options'];
    expect(testProps.schema).to.equal(schema.items[0].properties.attachmentId);
    expect(testProps.registry.formContext.pagePerItemIndex).to.eq(0);
    expect(options.widgetProps['aria-describedby']).to.eq('field_file_name_0');
    expect(options.widgetProps['data-index']).to.eq(0);
    expect(options.messageAriaDescribedby).to.contain(
      'test with Test file name.pdf',
    );
  });

  // Accessibility checks
  it('should render a div wrapper when not on the review page', () => {
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

  it('should render secondary cancel button', () => {
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

    const cancelButton = $('.cancel-upload[secondary]', container);
    expect(cancelButton.getAttribute('text')).to.equal('Cancel');
  });

  describe('errors & delete', () => {
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
          idSchema={idSchema}
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
          idSchema={idSchema}
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
      const onChangeSpy = sinon.spy();
      const { container } = render(
        <FileField
          registry={mockRegistry}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          idSchema={idSchema}
          errorSchema={mockErrorSchemaWithError}
          formData={mockFormDataWithError}
          formContext={formContext}
          onChange={onChangeSpy}
          requiredSchema={requiredSchema}
          enableShortWorkflow
        />,
      );

      // This button is specific to the file that has the error
      const cancelButton = $('.delete-upload', container);
      expect(cancelButton.getAttribute('text')).to.equal('Cancel');
      fireEvent.click(cancelButton);
      // clicking cancel should remove errored upload without showing delete
      // modal
      expect(onChangeSpy.called).to.be.true;
      expect($('va-modal[visible="false"]', container)).to.exist;
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
          idSchema={idSchema}
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
});
