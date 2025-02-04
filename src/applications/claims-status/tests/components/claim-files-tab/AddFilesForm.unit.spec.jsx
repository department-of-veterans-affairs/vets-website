import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import userEvent from '@testing-library/user-event';

import sinon from 'sinon';

import {
  fileTypeSignatures,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';

import AddFilesForm from '../../../components/claim-files-tab/AddFilesForm';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_PDF_SIZE_BYTES,
  MAX_PDF_SIZE_MB,
} from '../../../utils/validations';

// NOTE: Trying to extract the web components that use React bindings with skin-deep is
// a nightmare. Normally you can use something like the name of the component
// as a selector, but because of the way that the React bindings are created, it seems
// that that doesn't work here. Some of the web components have a `name` prop, so I created
// this matcher to select nodes based on the `name` prop
const byName = name => {
  return node => node?.props?.name === name;
};

describe('<AddFilesForm>', () => {
  context('tests using render()', () => {
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

    const file = {
      file: new File(['hello'], 'hello.jpg', {
        name: 'hello.jpg',
        type: fileTypeSignatures.jpg.mime,
        size: 9999,
      }),
      docType: { value: 'L029', dirty: true },
      password: { value: '', dirty: false },
      isEncrypted: false,
    };
    const file2 = {
      file: new File(['hello2'], 'hello2.jpg', {
        name: 'hello2.jpg',
        type: fileTypeSignatures.jpg.mime,
        size: 9999,
      }),
      docType: { value: 'L029', dirty: true },
      password: { value: '', dirty: false },
      isEncrypted: false,
    };
    const fileWithPassword = {
      file: new File(['hello'], 'hello.jpg', {
        name: 'hello.jpg',
        type: fileTypeSignatures.jpg.mime,
        size: 9999,
      }),
      docType: { value: 'L029', dirty: true },
      password: { value: '1234', dirty: true },
      isEncrypted: true,
    };

    it('should render component', () => {
      const { container, getAllByRole } = render(
        <AddFilesForm {...fileFormProps} />,
      );

      expect($('.add-files-form', container)).to.exist;
      getAllByRole('link', {
        text: 'How to File a Claim page (opens in a new tab)',
      });
      expect($('#file-upload', container)).to.exist;
    });

    it('uploading modal should not be visible', () => {
      const { container } = render(
        <AddFilesForm {...fileFormProps} uploading />,
      );
      expect($('#upload-status', container).visible).to.be.false;
    });

    it('remove files modal should not be visible', () => {
      const { container } = render(<AddFilesForm {...fileFormProps} />);
      expect($('#remove-file', container).visible).to.be.false;
    });

    it('should include mail info additional info', () => {
      const { getByText, getAllByRole } = render(
        <AddFilesForm {...fileFormProps} />,
      );
      getByText(
        /Please upload your documents online here to help us process your claim quickly./i,
      );
      getByText(/If you can’t upload documents:/i);
      getAllByRole('listitem', { text: 'Make copies of the documents.' });
      getAllByRole('listitem', {
        text: 'Make sure you write your name and claim number on every page.',
      });
      getAllByRole('listitem', {
        text: 'Mail them to the VA Claims Intake Center (opens in a new tab).',
      });
    });

    it('should not submit if files empty', () => {
      const onSubmit = sinon.spy();
      const onDirtyFields = sinon.spy();

      const { container } = render(
        <AddFilesForm
          {...fileFormProps}
          onSubmit={onSubmit}
          onDirtyFields={onDirtyFields}
        />,
      );

      fireEvent.click($('#submit', container));

      expect(onSubmit.called).to.be.false;
      expect(onDirtyFields.called).to.be.true;
    });

    it('should add a valid file and submit', async () => {
      const onSubmit = sinon.spy();
      const onDirtyFields = sinon.spy();

      const { container, rerender } = render(
        <AddFilesForm
          {...fileFormProps}
          onSubmit={onSubmit}
          onDirtyFields={onDirtyFields}
        />,
      );

      // Rerender component with new props and submit the file upload
      rerender(
        <AddFilesForm
          {...fileFormProps}
          files={[file]}
          onSubmit={onSubmit}
          onDirtyFields={onDirtyFields}
          uploading
        />,
      );

      // select doc type
      $('va-select', container).__events.vaSelect({
        detail: { value: 'L029' },
      });

      fireEvent.click($('#submit', container));
      expect(onSubmit.called).to.be.true;
      expect($('#upload-status', container).visible).to.be.true;
    });

    it('should add a valid file with password and submit', async () => {
      const onSubmit = sinon.spy();
      const onDirtyFields = sinon.spy();

      const { container, rerender } = render(
        <AddFilesForm
          {...fileFormProps}
          onSubmit={onSubmit}
          onDirtyFields={onDirtyFields}
        />,
      );

      // Rerender component with new props and submit the file upload
      rerender(
        <AddFilesForm
          {...fileFormProps}
          files={[fileWithPassword]}
          onSubmit={onSubmit}
          onDirtyFields={onDirtyFields}
          uploading
        />,
      );

      // select doc type
      $('va-select', container).__events.vaSelect({
        detail: { value: 'L029' },
      });

      // enter password
      const input = $('va-text-input', container);
      input.value = '1234';
      fireEvent.input(input, {
        target: { name: 'password' },
      });

      fireEvent.click($('#submit', container));
      expect(onSubmit.called).to.be.true;
      expect($('#upload-status', container).visible).to.be.true;
    });

    it('should mask filenames from Datadog (no PII)', () => {
      const { container } = render(
        <AddFilesForm {...fileFormProps} files={[file]} />,
      );
      expect(
        $('.document-title', container).getAttribute('data-dd-privacy'),
      ).to.equal('mask');
    });

    it('should add a valid file', () => {
      const { container, rerender, getByText } = render(
        <AddFilesForm {...fileFormProps} />,
      );
      const fileInput = $('#file-upload', container);

      // Add a file to the va-file-input component
      userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).to.equal(file);
      expect(fileInput.files.length).to.equal(1);
      rerender(<AddFilesForm {...fileFormProps} files={[file]} uploading />);
      getByText('hello.jpg');
    });

    it('should add a valid file and change it', () => {
      const { container, rerender, getByText } = render(
        <AddFilesForm {...fileFormProps} />,
      );

      const fileInput = $('#file-upload', container);

      // Add a file to the va-file-input component
      userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).to.equal(file);
      expect(fileInput.files.length).to.equal(1);
      rerender(<AddFilesForm {...fileFormProps} files={[file]} uploading />);
      getByText('hello.jpg');
      // Change the file
      userEvent.upload(fileInput, file2);
      expect(fileInput.files[0]).to.equal(file2);
      expect(fileInput.files.length).to.equal(1);
      rerender(<AddFilesForm {...fileFormProps} files={[file2]} uploading />);
      getByText('hello2.jpg');
    });

    it('should add multiple valid files', () => {
      const files = [];
      const { container, getByText, rerender } = render(
        <AddFilesForm {...fileFormProps} files={files} />,
      );
      const fileInput = $('#file-upload', container);

      // Add multiple files to the va-file-input component
      userEvent.upload(fileInput, [file, file2]);
      expect(fileInput.files[0].length).to.equal(2);
      expect(fileInput.files[0][0]).to.equal(file);
      expect(fileInput.files[0][1]).to.equal(file2);
      rerender(
        <AddFilesForm {...fileFormProps} files={[file, file2]} uploading />,
      );
      getByText('hello.jpg');
      getByText('hello2.jpg');
    });
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
