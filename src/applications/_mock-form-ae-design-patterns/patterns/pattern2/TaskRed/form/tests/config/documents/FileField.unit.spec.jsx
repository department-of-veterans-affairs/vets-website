import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { fileTypeSignatures } from 'platform/forms-system/src/js/utilities/file';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import {
  uiSchema as fileUiSchema,
  schema as fileSchema,
} from '../../../config/chapters/documents/fileUpload';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

describe('FileField', () => {
  const files = [
    {
      attachmentType: 'Discharge or separation papers (DD214)',
      confirmationCode: 'asdfasfd',
      isEncrypted: false,
      name: 'Test.pdf',
      size: 33016,
    },
  ];
  it('should render', () => {
    const data = { files: [] };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );

    expect($$('li[id]', container).length).to.equal(0);
    expect($('#root_files_add_label', container).textContent).to.equal(
      'Upload document',
    );
  });
  it('should render files', () => {
    const data = { files };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );

    expect($$('li[id]', container).length).to.equal(1);
    expect($('#root_files_add_label', container).textContent).to.equal(
      'Upload another document',
    );
  });

  it('should remove files with empty file object when initializing', () => {
    const data = {
      files: [
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
      ],
    };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );

    expect($$('li[id]', container).length).to.equal(3);
  });

  it('should call onChange once when deleting files', () => {
    const data = { files };
    const { container, getByText } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );

    expect($$('li[id]', container).length).to.equal(1);

    fireEvent.click(getByText('Delete file'), mouseClick);
    expect($$('li[id]', container).length).to.equal(0);
  });

  it('should render uploading', () => {
    const data = { files: [{ uploading: true }] };
    const { container, getByText } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );
    expect($$('li[id]', container).length).to.equal(1);

    expect($('va-progress-bar', container)).to.exist;
    expect(getByText('Cancel').getAttribute('aria-describedby')).to.contain(
      'file_name_0',
    );
  });

  it('should render an error', () => {
    const data = { files: [{ errorMessage: 'Nope' }] };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );

    expect($$('li[id]', container).length).to.equal(1);

    // Prepend 'Error' for screenreader
    expect($('.va-growable-background', container).textContent).to.contain(
      'Error Nope',
    );
    expect($('span[role="alert"]')).to.exist;
  });

  it('should not render upload button if over max items', () => {
    const data = { files };
    const max1FileSchema = {
      type: 'object',
      properties: {
        files: {
          maxItems: 1,
          ...fileSchema.properties.files,
        },
      },
    };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={max1FileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );

    expect($$('li[id]', container).length).to.equal(1);
    expect($('#root_files_add_label', container)).to.not.exist;
  });
  it('should not render upload or delete button on review & submit page while in review mode', () => {
    const data = { files };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
          reviewMode
        />
      </Provider>,
    );

    expect($$('li[id]', container).length).to.equal(1);
    expect($('#root_files_add_label', container)).to.not.exist;
    expect($('button.usa-button-secondary', container)).to.not.exist;
  });

  it('should upload png file', () => {
    const uploadFile = sinon.spy();
    const mockFile = {
      name: 'test.png',
      type: fileTypeSignatures.png.mime,
    };
    const newUiSchema = {
      ...fileUiSchema,
      files: {
        ...fileUiSchema.files,
        'ui:options': {
          ...fileUiSchema.files['ui:options'],
          mockReadAndCheckFile: () => ({
            checkIsEncryptedPdf: false,
            checkTypeAndExtensionMatches: true,
          }),
        },
      },
    };
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={{}}
          uploadFile={uploadFile}
          uiSchema={newUiSchema}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.files('input[type=file]', [mockFile]);

    expect(uploadFile.firstCall.args[0]).to.eql(mockFile);
    expect(uploadFile.firstCall.args[1]).to.eql(
      newUiSchema.files['ui:options'],
    );
    expect(uploadFile.firstCall.args[2]).to.be.a('function');
    expect(uploadFile.firstCall.args[3]).to.be.a('function');
    expect(uploadFile.firstCall.args[4]).to.be.a('function');
  });

  it('should upload unencrypted pdf file', () => {
    const uploadFile = sinon.spy();
    const mockFile = {
      name: 'test.pdf',
      type: fileTypeSignatures.pdf.mime,
    };
    const newUiSchema = {
      ...fileUiSchema,
      files: {
        ...fileUiSchema.files,
        'ui:options': {
          ...fileUiSchema.files['ui:options'],
          mockReadAndCheckFile: () => ({
            checkIsEncryptedPdf: false,
            checkTypeAndExtensionMatches: true,
          }),
        },
      },
    };
    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={{}}
          uploadFile={uploadFile}
          uiSchema={newUiSchema}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.files('input[type=file]', [mockFile]);

    expect(uploadFile.firstCall.args[0]).to.eql(mockFile);
    expect(uploadFile.firstCall.args[1]).to.eql(
      newUiSchema.files['ui:options'],
    );
    expect(uploadFile.firstCall.args[2]).to.be.a('function');
    expect(uploadFile.firstCall.args[3]).to.be.a('function');
    expect(uploadFile.firstCall.args[4]).to.be.a('function');
  });
  it('should not call uploadFile when initially adding an encrypted PDF', () => {
    const uploadFile = sinon.spy();
    const isFileEncrypted = () => Promise.resolve(true);
    const newUiSchema = {
      ...fileUiSchema,
      files: {
        ...fileUiSchema.files,
        'ui:options': {
          ...fileUiSchema.files['ui:options'],
          isFileEncrypted,
        },
      },
    };

    const form = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={{}}
          uploadFile={uploadFile}
          uiSchema={newUiSchema}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    formDOM.files('input[type=file]', [{ name: 'test-pw.pdf' }]);

    expect(uploadFile.notCalled).to.be.true;
  });

  it('should render file with attachment type', () => {
    const data = { files };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );

    const fileText = $('li', container).textContent;
    expect(fileText).to.contain('Test.pdf');
    expect(fileText).to.contain('32KB');
    const label = $('label[id="root_files_0_attachmentType-label"]', container);
    expect(label.textContent).to.contain('Document type');
  });
  it('should render file with attachment type', () => {
    const data = { files: [{ ...files[0], attachmentType: 'Other' }] };
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={fileSchema}
          data={data}
          uiSchema={fileUiSchema}
        />
      </Provider>,
    );

    const fileText = $('li', container).textContent;
    expect(fileText).to.contain('Test.pdf');
    expect(fileText).to.contain('32KB');
    const labelType = $(
      'label[id="root_files_0_attachmentType-label"]',
      container,
    ).textContent;
    expect(labelType).to.contain('Document type');

    const labelDescription = $(
      'label[id="root_files_0_attachmentDescription-label"]',
      container,
    ).textContent;
    expect(labelDescription).to.contain('Document description');
  });
});
