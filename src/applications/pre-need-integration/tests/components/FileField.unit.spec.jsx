import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { FileField } from '../../components/FileField';

// Mock store for testing
const mockStore = {
  getState: () => ({
    featureToggles: {
      fileUploadShortWorkflowEnabled: false,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const formContext = {
  setTouched: sinon.spy(),
  uploadFile: sinon.spy(),
  trackingPrefix: 'test',
};

const requiredSchema = {};

// Simple schema field mock component
const MockSchemaField = () => React.createElement('div');

describe('Pre-need FileField', () => {
  let mockScrollToFirstError;
  let mockFocusElement;
  let mockScrollTo;
  let mockDollarSign;
  let scrollToFirstErrorStub;
  let focusElementStub;
  let scrollToStub;
  let dollarSignStub;

  beforeEach(() => {
    // Reset mocks
    mockScrollToFirstError = sinon.spy();
    mockFocusElement = sinon.spy();
    mockScrollTo = sinon.spy();
    mockDollarSign = sinon.stub().returns({
      shadowRoot: {},
      focus: sinon.spy(),
    });

    // Mock modules using direct function replacement
    scrollToFirstErrorStub = sinon
      .stub(require('platform/utilities/scroll'), 'scrollToFirstError')
      .callsFake(mockScrollToFirstError);
    focusElementStub = sinon
      .stub(require('platform/utilities/ui/focus'), 'focusElement')
      .callsFake(mockFocusElement);
    scrollToStub = sinon
      .stub(require('platform/utilities/scroll'), 'scrollTo')
      .callsFake(mockScrollTo);
    dollarSignStub = sinon
      .stub(require('platform/forms-system/src/js/utilities/ui'), '$')
      .callsFake(mockDollarSign);
  });

  afterEach(() => {
    scrollToFirstErrorStub.restore();
    focusElementStub.restore();
    scrollToStub.restore();
    dollarSignStub.restore();
  });
  it('should render without crashing', () => {
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
          maxSize: 20971520,
          minSize: 1024,
        },
      },
      idSchema: { $id: 'field' },
      formData: [],
      formContext,
      onChange: () => {},
      requiredSchema,
      enableShortWorkflow: true,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render file with error and display error message', () => {
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
          maxSize: 20971520,
          minSize: 1024,
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          errorMessage: 'File upload failed',
          uploading: false,
        },
      ],
      errorSchema: {
        0: {
          __errors: ['File upload failed'],
        },
      },
      formContext: {
        ...formContext,
        reviewMode: false,
      },
      onChange: () => {},
      requiredSchema,
      enableShortWorkflow: true,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    // Check that component renders the file and error
    expect(wrapper.text()).to.contain('test-file.pdf');
    expect(wrapper.text()).to.contain('File upload failed');

    // Check file list exists
    expect(wrapper.find('.schemaform-file-list')).to.have.lengthOf(1);

    // Check that retry button exists when enableShortWorkflow is true and there's an error
    expect(wrapper.find('va-button[name="retry_upload_0"]')).to.have.lengthOf(
      1,
    );

    wrapper.unmount();
  });

  it('should render encrypted file with password input', () => {
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
          maxSize: 20971520,
          minSize: 1024,
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'encrypted-file.pdf',
          isEncrypted: true,
          uploading: false,
          file: { name: 'encrypted-file.pdf' },
        },
      ],
      formContext: {
        ...formContext,
        reviewMode: false,
      },
      onChange: () => {},
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    // Check that component renders the encrypted file
    expect(wrapper.find('li')).to.have.lengthOf(1);
    expect(wrapper.text()).to.contain('encrypted-file.pdf');

    wrapper.unmount();
  });

  it('should render file with error and display error message when enableShortWorkflow is false', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {
        properties: {
          attachmentId: { type: 'string' },
        },
      },
      items: [
        {
          properties: {
            attachmentId: { type: 'string' },
          },
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        name: 'test-file.pdf',
        errorMessage: 'Test error message',
        isEncrypted: true,
        file: { name: 'test-file.pdf' },
      },
    ];
    const errorSchema = {
      0: {
        __errors: ['Test error'],
      },
    };
    const registry = {
      fields: {
        SchemaField: MockSchemaField,
      },
      formContext: {},
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, {
          registry,
          schema,
          uiSchema,
          idSchema,
          formData,
          errorSchema,
          formContext,
          onChange: () => {},
          requiredSchema,
          enableShortWorkflow: false,
        }),
      ),
    );

    // Check that component renders the file and error
    expect(wrapper.text()).to.contain('test-file.pdf');
    expect(wrapper.text()).to.contain('Test error');
    expect(wrapper.find('.schemaform-file-list')).to.have.lengthOf(1);

    wrapper.unmount();
  });

  it('should render encrypted file without error', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      additionalItems: {
        properties: {
          attachmentId: { type: 'string' },
        },
      },
      items: [
        {
          properties: {
            attachmentId: { type: 'string' },
          },
        },
      ],
    };
    const uiSchema = fileUploadUI('Files');
    const formData = [
      {
        name: 'test-file.pdf',
        isEncrypted: true,
        file: { name: 'test-file.pdf' },
      },
    ];
    const registry = {
      fields: {
        SchemaField: MockSchemaField,
      },
      formContext: {},
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, {
          registry,
          schema,
          uiSchema,
          idSchema,
          formData,
          formContext,
          onChange: () => {},
          requiredSchema,
        }),
      ),
    );

    // Check that component renders the encrypted file
    expect(wrapper.text()).to.contain('test-file.pdf');
    expect(wrapper.find('.schemaform-file-list')).to.have.lengthOf(1);

    wrapper.unmount();
  });

  it('should render file without errors', () => {
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
        name: 'test-file.pdf',
      },
    ];
    const registry = {
      fields: {
        SchemaField: MockSchemaField,
      },
      formContext: {},
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, {
          registry,
          schema,
          uiSchema,
          idSchema,
          formData,
          formContext,
          onChange: () => {},
          requiredSchema,
        }),
      ),
    );

    expect(wrapper.find('li')).to.have.lengthOf(1);
    expect(wrapper.text()).to.contain('test-file.pdf');
    wrapper.unmount();
  });

  it('should handle file upload with onAddFile function', () => {
    const onChange = sinon.spy();
    const uploadFile = sinon.stub().returns({ abort: sinon.spy() });
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
          maxSize: 20971520,
          minSize: 1024,
          mockReadAndCheckFile: () => ({
            checkTypeAndExtensionMatches: true,
            checkIsEncryptedPdf: false,
          }),
        },
      },
      idSchema: { $id: 'field' },
      formData: [],
      formContext: {
        ...formContext,
        uploadFile,
      },
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const fileInput = wrapper.find('input[type="file"]');
    const mockFile = {
      name: 'test-file.pdf',
      type: 'application/pdf',
      size: 1024,
    };

    // Simulate file selection
    fileInput.prop('onChange')({
      target: {
        files: [mockFile],
      },
    });

    expect(uploadFile.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should handle encrypted PDF file detection', () => {
    const onChange = sinon.spy();
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
          mockReadAndCheckFile: () => ({
            checkTypeAndExtensionMatches: true,
            checkIsEncryptedPdf: true,
          }),
        },
      },
      idSchema: { $id: 'field' },
      formData: [],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const fileInput = wrapper.find('input[type="file"]');
    const mockFile = {
      name: 'encrypted-file.pdf',
      type: 'application/pdf',
      size: 1024,
    };

    // Simulate file selection
    fileInput.prop('onChange')({
      target: {
        files: [mockFile],
      },
    });

    expect(onChange.calledOnce).to.be.true;
    const callArgs = onChange.getCall(0).args[0];
    expect(callArgs[0]).to.have.property('errorMessage');
    expect(callArgs[0].errorMessage).to.contain('We weren');
    wrapper.unmount();
  });

  it('should handle file type mismatch error', () => {
    const onChange = sinon.spy();
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
          mockReadAndCheckFile: () => ({
            checkTypeAndExtensionMatches: false,
            checkIsEncryptedPdf: false,
          }),
        },
      },
      idSchema: { $id: 'field' },
      formData: [],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const fileInput = wrapper.find('input[type="file"]');
    const mockFile = {
      name: 'test-file.txt',
      type: 'text/plain',
      size: 1024,
    };

    // Simulate file selection
    fileInput.prop('onChange')({
      target: {
        files: [mockFile],
      },
    });

    expect(onChange.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should handle testing file type', () => {
    const onChange = sinon.spy();
    const uploadFile = sinon.stub().returns({ abort: sinon.spy() });
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
        },
      },
      idSchema: { $id: 'field' },
      formData: [],
      formContext: {
        ...formContext,
        uploadFile,
      },
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const fileInput = wrapper.find('input[type="file"]');
    const mockFile = {
      name: 'test-file.pdf',
      type: 'testing',
      size: 1024,
    };

    // Simulate file selection
    fileInput.prop('onChange')({
      target: {
        files: [mockFile],
      },
    });

    expect(uploadFile.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should handle onAttachmentIdChange with value', () => {
    const onChange = sinon.spy();
    const props = {
      registry: {
        fields: {
          SchemaField: ({ onChange: fieldOnChange }) =>
            React.createElement('input', {
              onChange: e => fieldOnChange(e.target.value),
              'data-testid': 'attachment-id-field',
            }),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {
          properties: {
            attachmentId: { type: 'string' },
          },
        },
        items: [
          {
            properties: {
              attachmentId: { type: 'string' },
            },
          },
        ],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
          attachmentSchema: {
            'ui:title': 'Attachment ID',
          },
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          confirmationCode: 'abc123',
        },
      ],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const attachmentField = wrapper.find('[data-testid="attachment-id-field"]');
    if (attachmentField.length > 0) {
      attachmentField.prop('onChange')({
        target: { value: 'test-attachment-id' },
      });
      expect(onChange.called).to.be.true;
    }

    wrapper.unmount();
  });

  it('should handle onAttachmentIdChange without value', () => {
    const onChange = sinon.spy();
    const props = {
      registry: {
        fields: {
          SchemaField: ({ onChange: fieldOnChange }) =>
            React.createElement('input', {
              onChange: e => fieldOnChange(e.target.value),
              'data-testid': 'attachment-id-field',
            }),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {
          properties: {
            attachmentId: { type: 'string' },
          },
        },
        items: [
          {
            properties: {
              attachmentId: { type: 'string' },
            },
          },
        ],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
          attachmentSchema: {
            'ui:title': 'Attachment ID',
          },
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          confirmationCode: 'abc123',
          attachmentId: 'existing-id',
        },
      ],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const attachmentField = wrapper.find('[data-testid="attachment-id-field"]');
    if (attachmentField.length > 0) {
      attachmentField.prop('onChange')({ target: { value: '' } });
      expect(onChange.called).to.be.true;
    }

    wrapper.unmount();
  });

  it('should handle removeFile function', () => {
    const onChange = sinon.spy();
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          confirmationCode: 'abc123',
        },
        {
          name: 'test-file2.pdf',
          confirmationCode: 'def456',
        },
      ],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const deleteButtons = wrapper.find('va-button.delete-upload');
    if (deleteButtons.length > 0) {
      deleteButtons.first().prop('onClick')();
      expect(onChange.called).to.be.true;
    }

    wrapper.unmount();
  });

  it('should handle removeFile with empty file list', () => {
    const onChange = sinon.spy();
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          confirmationCode: 'abc123',
        },
      ],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const deleteButtons = wrapper.find('va-button.delete-upload');
    if (deleteButtons.length > 0) {
      deleteButtons.prop('onClick')();
      expect(onChange.called).to.be.true;
    }

    wrapper.unmount();
  });

  it('should handle modal close without removal', () => {
    const onChange = sinon.spy();
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          confirmationCode: 'abc123',
        },
      ],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    // First open the modal
    const deleteButtons = wrapper.find('va-button.delete-upload');
    if (deleteButtons.length > 0) {
      deleteButtons.prop('onClick')();

      // Then close it without removing
      const modal = wrapper.find('VaModal');
      if (modal.length > 0) {
        modal.prop('onSecondaryButtonClick')();
      }
    }

    wrapper.unmount();
  });

  it('should handle modal close with removal', () => {
    const onChange = sinon.spy();
    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          confirmationCode: 'abc123',
        },
      ],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    // First open the modal
    const deleteButtons = wrapper.find('va-button.delete-upload');
    if (deleteButtons.length > 0) {
      deleteButtons.prop('onClick')();

      // Then confirm removal
      const modal = wrapper.find('VaModal');
      if (modal.length > 0) {
        modal.prop('onPrimaryButtonClick')();
        expect(onChange.called).to.be.true;
      }
    }
    wrapper.unmount();
  });

  it('should handle cancelUpload function', () => {
    const onChange = sinon.spy();

    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          uploading: true,
        },
      ],
      formContext,
      onChange,
      requiredSchema,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const cancelButtons = wrapper.find('va-button.cancel-upload');
    if (cancelButtons.length > 0) {
      cancelButtons.prop('onClick')();
      expect(onChange.called).to.be.true;
    }
    wrapper.unmount();
  });

  it('should handle retryLastUpload function', () => {
    const onChange = sinon.spy();
    const uploadFile = sinon.stub().returns({ abort: sinon.spy() });

    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
          mockReadAndCheckFile: () => ({
            checkTypeAndExtensionMatches: true,
            checkIsEncryptedPdf: false,
          }),
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          errorMessage:
            'We\u2019re sorry. We had a connection problem. Please try again.',
          file: { name: 'test-file.pdf', type: 'application/pdf' },
        },
      ],
      errorSchema: {
        0: {
          __errors: [
            'We\u2019re sorry. We had a connection problem. Please try again.',
          ],
        },
      },
      formContext: {
        ...formContext,
        uploadFile,
      },
      onChange,
      requiredSchema,
      enableShortWorkflow: true,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    const retryButtons = wrapper.find('va-button[name="retry_upload_0"]');
    expect(retryButtons.length).to.be.greaterThan(0);
    retryButtons.prop('onClick')();
    expect(uploadFile.called).to.be.true;
    wrapper.unmount();
  });

  it('should handle getRetryFunction with allowRetry false', () => {
    const onChange = sinon.spy();
    const mockClick = sinon.spy();

    const props = {
      registry: {
        fields: {
          SchemaField: () => React.createElement('div'),
        },
        formContext: {},
      },
      schema: {
        additionalItems: {},
        items: [{ properties: {} }],
      },
      uiSchema: {
        'ui:title': 'Files',
        'ui:field': 'file',
        'ui:options': {
          fileTypes: ['pdf'],
        },
      },
      idSchema: { $id: 'field' },
      formData: [
        {
          name: 'test-file.pdf',
          errorMessage: 'Some other error',
          file: { name: 'test-file.pdf', type: 'application/pdf' },
        },
      ],
      errorSchema: {
        0: {
          __errors: ['Some other error'],
        },
      },
      formContext,
      onChange,
      requiredSchema,
      enableShortWorkflow: true,
    };

    const wrapper = mount(
      React.createElement(
        Provider,
        { store: mockStore },
        React.createElement(FileField, props),
      ),
    );

    // Mock the file input click
    const instance = wrapper.find(FileField).instance();
    if (instance && instance.fileInputRef) {
      instance.fileInputRef.current = { click: mockClick };
    }

    const retryButton = wrapper.find('va-button[name="retry_upload_0"]');
    retryButton.prop('onClick')();

    expect(onChange.called).to.be.true;
    wrapper.unmount();
  });
});
