import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { createStore } from 'redux';

import sinon from 'sinon';

import {
  fileTypeSignatures,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';

import AddFilesForm from '../../components/AddFilesForm';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_PDF_SIZE_BYTES,
  MAX_PDF_SIZE_MB,
} from '../../utils/validations';

// NOTE: Trying to extract the web components that use React bindings with skin-deep is
// a nightmare. Normally you can use something like the name of the component
// as a selector, but because of the way that the React bindings are created, it seems
// that that doesn't work here. Some of the web components have a `name` prop, so I created
// this matcher to select nodes based on the `name` prop
const byName = name => {
  return node => node?.props?.name === name;
};
const store = createStore(() => ({}));

describe('<AddFilesForm>', () => {
  context('renders component', () => {
    const fileFormProps = {
      field: { value: '', dirty: false },
      files: [],
      onSubmit: () => {},
      onAddFile: () => {},
      onRemoveFile: () => {},
      onFieldChange: () => {},
      onCancel: () => {},
      removeFile: () => {},
      onDirtyFields: () => {},
    };

    it('should render component', () => {
      const { container } = render(
        <Provider store={store}>
          <AddFilesForm {...fileFormProps} />,
        </Provider>,
      );

      expect($('.add-files-form', container)).to.exist;
    });

    it('should show uploading modal', () => {
      const { container } = render(
        <Provider store={store}>
          <AddFilesForm uploading {...fileFormProps} />,
        </Provider>,
      );
      // VaModal has an id of `upload-status` so we can use that as the selector here
      expect($('#upload-status', container)).to.exist;
    });

    it('should include mail info additional info', () => {
      const { container } = render(
        <Provider store={store}>
          <AddFilesForm {...fileFormProps} />,
        </Provider>,
      );

      expect($('va-additional-info', container)).to.exist;
    });

    it('should not submit if files empty', () => {
      const onSubmit = sinon.spy();
      const onDirtyFields = sinon.spy();

      const { container } = render(
        <Provider store={store}>
          <AddFilesForm
            {...fileFormProps}
            onSubmit={onSubmit}
            onDirtyFields={onDirtyFields}
          />
          ,
        </Provider>,
      );

      fireEvent.click($('#submit', container));

      expect(onSubmit.called).to.be.false;
      expect(onDirtyFields.called).to.be.true;
    });

    it('should not submit if files are valid and checkbox is not checked', () => {
      const files = [
        {
          file: {
            size: 20,
            name: 'something.jpeg',
          },
          docType: 'L501',
        },
      ];
      const onSubmit = sinon.spy();
      const onDirtyFields = sinon.spy();
      const { container } = render(
        <Provider store={store}>
          <AddFilesForm
            {...fileFormProps}
            files={files}
            onSubmit={onSubmit}
            onDirtyFields={onDirtyFields}
          />
          ,
        </Provider>,
      );
      fireEvent.click($('#submit', container));
      expect(onSubmit.called).to.be.false;
      expect(onDirtyFields.called).to.be.true;
    });

    // it('should not add an invalid file type', () => {
    //   const onAddFile = sinon.spy();

    //   const { container } = render(
    //     <Provider store={store}>
    //       <AddFilesForm {...fileFormProps} onAddFile={onAddFile} />,
    //     </Provider>,
    //   );
    //   const file = new File(['hello'], 'hello.exe', { type: 'image/png' });
    //   const input = screen.getByTestId('file-upload-button');
    //   await waitFor(() => fireEvent.change(input, { target: { files: [file] } }));

    //   fireEvent.click($('#file-upload', container));

    //   // tree.getMountedInstance().add([
    //   //   {
    //   //     name: 'something.exe',
    //   //     size: 200,
    //   //   },
    //   // ]);
    //   expect(onAddFile.called).to.be.false;
    //   // expect(tree.getMountedInstance().state.errorMessage).to.contain(
    //   //   'accepted types',
    //   // );
    // });
  });

  it('should not add an invalid file type', () => {
    const files = [];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'something.exe',
        size: 200,
      },
    ]);
    expect(onAddFile.called).to.be.false;
    expect(tree.getMountedInstance().state.errorMessage).to.contain(
      'accepted types',
    );
  });

  it('should not add file of zero size', () => {
    const files = [];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'something.txt',
        size: 0,
      },
    ]);
    expect(onAddFile.called).to.be.false;
    expect(tree.getMountedInstance().state.errorMessage).to.contain('is empty');
  });

  it('should not add an invalid file size', () => {
    const files = [];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'something.txt',
        size: 999999999999,
      },
    ]);
    expect(onAddFile.called).to.be.false;
    expect(tree.getMountedInstance().state.errorMessage).to.contain(
      `${MAX_FILE_SIZE_MB}MB maximum file size`,
    );
  });

  it('should not add an invalid PDF file size', () => {
    const files = [];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'something.pdf',
        size: MAX_PDF_SIZE_BYTES + 100,
      },
    ]);
    expect(onAddFile.called).to.be.false;
    expect(tree.getMountedInstance().state.errorMessage).to.contain(
      `${MAX_PDF_SIZE_MB}MB maximum file size`,
    );
  });

  it('should add a valid file', () => {
    const files = [];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();
    const mockReadAndCheckFile = () => ({
      checkIsEncryptedPdf: false,
      checkTypeAndExtensionMatches: true,
    });

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
        mockReadAndCheckFile={mockReadAndCheckFile}
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'something.jpg',
        type: fileTypeSignatures.jpg.mime,
        size: 9999,
      },
    ]);
    expect(onAddFile.called).to.be.true;
    expect(tree.getMountedInstance().state.errorMessage).to.be.null;
  });

  it('should add a valid file text file of valid size', () => {
    const files = [];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();
    const mockReadAndCheckFile = () => ({
      checkIsEncryptedPdf: false,
      checkTypeAndExtensionMatches: true,
    });

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
        mockReadAndCheckFile={mockReadAndCheckFile}
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'valid.txt',
        type: fileTypeSignatures.txt.mime,
        size: 95,
      },
    ]);
    expect(onAddFile.called).to.be.true;
    expect(tree.getMountedInstance().state.errorMessage).to.be.null;
  });

  it('should add a large PDF file', () => {
    const files = [];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();
    const mockReadAndCheckFile = () => ({
      checkIsEncryptedPdf: false,
      checkTypeAndExtensionMatches: true,
    });

    // valid size larger than max non-PDF size, but smaller than max PDF size
    const validPdfFileSize =
      MAX_FILE_SIZE_BYTES + (MAX_PDF_SIZE_BYTES - MAX_FILE_SIZE_BYTES) / 2;

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
        mockReadAndCheckFile={mockReadAndCheckFile}
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'something.pdf',
        type: fileTypeSignatures.pdf.mime,
        size: validPdfFileSize,
      },
    ]);
    expect(onAddFile.called).to.be.true;
    expect(tree.getMountedInstance().state.errorMessage).to.be.null;
  });

  it('should return an error when the file extension & format do not match', () => {
    const files = [];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();
    const mockReadAndCheckFile = () => ({
      checkIsEncryptedPdf: false,
      checkTypeAndExtensionMatches: false,
    });

    // valid size larger than max non-PDF size, but smaller than max PDF size
    const validPdfFileSize =
      MAX_FILE_SIZE_BYTES + (MAX_PDF_SIZE_BYTES - MAX_FILE_SIZE_BYTES) / 2;

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
        mockReadAndCheckFile={mockReadAndCheckFile}
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'something.pdf',
        type: fileTypeSignatures.pdf.mime,
        size: validPdfFileSize,
      },
    ]);
    expect(onAddFile.called).to.be.false;
    expect(tree.getMountedInstance().state.errorMessage).to.eq(
      FILE_TYPE_MISMATCH_ERROR,
    );
  });

  it('should return an error message when no files present and field is dirty', () => {
    const files = [];
    const field = { value: '', dirty: true };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
      />,
    );
    let message = tree.getMountedInstance().getErrorMessage();
    expect(message).to.equal('Please select a file first');
    tree.getMountedInstance().state.errorMessage = 'message';
    message = tree.getMountedInstance().getErrorMessage();
    expect(message).to.equal('message');
  });

  it('should show password input', () => {
    const files = [
      {
        file: {
          size: 20,
          name: 'something.pdf',
        },
        docType: {
          value: 'L501',
          dirty: false,
        },
        password: {
          value: 'password123',
          dirty: false,
        },
        isEncrypted: true,
      },
    ];
    const field = { value: '', dirty: false };
    const onSubmit = sinon.spy();
    const onAddFile = sinon.spy();
    const onRemoveFile = sinon.spy();
    const onFieldChange = sinon.spy();
    const onCancel = sinon.spy();
    const onDirtyFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AddFilesForm
        files={files}
        field={field}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
      />,
    );
    expect(tree.getMountedInstance().state.errorMessage).to.be.null;

    // VaTextInput has a name prop set to 'password'
    expect(tree.everySubTree('*', byName('password'))[0]).to.exist;
  });
});
