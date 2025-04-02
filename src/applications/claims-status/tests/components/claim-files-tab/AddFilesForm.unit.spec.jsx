import React from 'react';
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
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AddFilesForm from '../../../components/claim-files-tab/AddFilesForm';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
} from '../../../utils/validations';

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
    type: fileTypeSignatures.jpg.mime,
  }),
  size: 40,
  name: 'hello.jpg',
  docType: { value: 'L029', dirty: true },
  password: { value: '', dirty: false },
  isEncrypted: false,
};
const pdfFile = {
  file: new File(['hello'], 'hello.pdf', {
    type: fileTypeSignatures.pdf.mime,
  }),
  size: MAX_FILE_SIZE_BYTES + (MAX_PDF_SIZE_BYTES - MAX_FILE_SIZE_BYTES) / 2,
  name: 'hello.pdf',
  docType: { value: 'L029', dirty: true },
  password: { value: '', dirty: false },
  isEncrypted: false,
};
const file2 = {
  file: new File(['hello2'], 'hello2.jpg', {
    type: fileTypeSignatures.jpg.mime,
  }),
  size: 40,
  name: 'hello2.jpg',
  docType: { value: 'L029', dirty: true },
  password: { value: '', dirty: false },
  isEncrypted: false,
};
const fileWithPassword = {
  file: new File(['hello'], 'hello.jpg', {
    type: fileTypeSignatures.jpg.mime,
  }),
  size: 40,
  name: 'hello.jpg',
  docType: { value: 'L029', dirty: true },
  password: { value: '1234', dirty: true },
  isEncrypted: true,
};
const invalidFile = {
  file: new File(['hello'], 'hello.exe', {
    type: 'exe',
  }),
  size: 40,
  name: 'hello.exe',
  docType: { value: '', dirty: false },
  password: { value: '', dirty: false },
  isEncrypted: false,
};
const zeroSizeFile = {
  file: new File(['hello'], 'hello.jpg', {
    type: fileTypeSignatures.jpg.mime,
  }),
  size: 0,
  name: 'hello.jpg',
  docType: { value: '', dirty: false },
  password: { value: '', dirty: false },
  isEncrypted: false,
};
const invalidSizeFile = {
  file: new File(['hello'], 'hello.jpg', {
    type: fileTypeSignatures.jpg.mime,
  }),
  size: MAX_FILE_SIZE_BYTES + 100,
  name: 'hello.jpg',
  docType: { value: '', dirty: false },
  password: { value: '', dirty: false },
  isEncrypted: false,
};
const invalidPdfSizeFile = {
  file: new File(['hello'], 'hello.jpg', {
    type: fileTypeSignatures.jpg.mime,
  }),
  size: MAX_PDF_SIZE_BYTES + 100,
  name: 'hello.jpg',
  docType: { value: '', dirty: false },
  password: { value: '', dirty: false },
  isEncrypted: false,
};
const invalidFileExtAndFormat = {
  file: new File(['hello'], 'hello.pdf', {
    type: fileTypeSignatures.pdf.mime,
  }),
  size: MAX_FILE_SIZE_BYTES + (MAX_PDF_SIZE_BYTES - MAX_FILE_SIZE_BYTES) / 2,
  name: 'hello.pdf',
  docType: { value: '', dirty: false },
  password: { value: '', dirty: false },
  isEncrypted: false,
};

describe('<AddFilesForm>', () => {
  const getStore = (cstFriendlyEvidenceRequests = true) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_friendly_evidence_requests: cstFriendlyEvidenceRequests,
      },
    }));
  context('tests using render()', () => {
    it('should render component', () => {
      const { container, getAllByRole } = render(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} />
        </Provider>,
      );

      expect($('.add-files-form', container)).to.exist;
      getAllByRole('link', {
        text: 'How to File a Claim page (opens in a new tab)',
      });
      expect($('#file-upload', container)).to.exist;
    });

    it('uploading modal should not be visible', () => {
      const { container } = render(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} uploading />
        </Provider>,
      );
      expect($('#upload-status', container).visible).to.be.false;
    });

    it('remove files modal should not be visible', () => {
      const { container } = render(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} />
        </Provider>,
      );
      expect($('#remove-file', container).visible).to.be.false;
    });

    it('should include mail info additional info', () => {
      const { getByText, getAllByRole } = render(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} />
        </Provider>,
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
        <Provider store={getStore(false)}>
          <AddFilesForm
            {...fileFormProps}
            onSubmit={onSubmit}
            onDirtyFields={onDirtyFields}
          />
        </Provider>,
      );

      fireEvent.click($('#submit', container));

      expect(onSubmit.called).to.be.false;
      expect(onDirtyFields.called).to.be.true;
    });

    it('should add a valid file and submit', async () => {
      const onSubmit = sinon.spy();
      const onDirtyFields = sinon.spy();

      const { container, rerender } = render(
        <Provider store={getStore(false)}>
          <AddFilesForm
            {...fileFormProps}
            onSubmit={onSubmit}
            onDirtyFields={onDirtyFields}
          />
        </Provider>,
      );

      // Rerender component with new props and submit the file upload
      rerender(
        <Provider store={getStore(false)}>
          <AddFilesForm
            {...fileFormProps}
            files={[file]}
            onSubmit={onSubmit}
            onDirtyFields={onDirtyFields}
            uploading
          />
        </Provider>,
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
        <Provider store={getStore(false)}>
          <AddFilesForm
            {...fileFormProps}
            onSubmit={onSubmit}
            onDirtyFields={onDirtyFields}
          />
        </Provider>,
      );

      // Rerender component with new props and submit the file upload
      rerender(
        <Provider store={getStore(false)}>
          <AddFilesForm
            {...fileFormProps}
            files={[fileWithPassword]}
            onSubmit={onSubmit}
            onDirtyFields={onDirtyFields}
            uploading
          />
        </Provider>,
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
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} files={[file]} />
        </Provider>,
      );
      expect(
        $('.document-title', container).getAttribute('data-dd-privacy'),
      ).to.equal('mask');
    });

    it('should add a valid file', () => {
      const { container, rerender, getByText } = render(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} />
        </Provider>,
      );
      const fileInput = $('#file-upload', container);

      // Add a file to the va-file-input component
      userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).to.equal(file);
      expect(fileInput.files.length).to.equal(1);
      rerender(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} files={[file]} uploading />
        </Provider>,
      );
      getByText('hello.jpg');
    });

    it('should add a valid file and change it', () => {
      const { container, rerender, getByText } = render(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} />
        </Provider>,
      );

      const fileInput = $('#file-upload', container);

      // Add a file to the va-file-input component
      userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).to.equal(file);
      expect(fileInput.files.length).to.equal(1);
      rerender(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} files={[file]} uploading />
        </Provider>,
      );
      getByText('hello.jpg');
      // Change the file
      userEvent.upload(fileInput, file2);
      expect(fileInput.files[0]).to.equal(file2);
      expect(fileInput.files.length).to.equal(1);
      rerender(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} files={[file2]} uploading />
        </Provider>,
      );
      getByText('hello2.jpg');
    });

    it('should add multiple valid files', () => {
      const files = [];
      const { container, getByText, rerender } = render(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} files={files} />
        </Provider>,
      );
      const fileInput = $('#file-upload', container);

      // Add multiple files to the va-file-input component
      userEvent.upload(fileInput, [file, file2]);
      expect(fileInput.files[0].length).to.equal(2);
      expect(fileInput.files[0][0]).to.equal(file);
      expect(fileInput.files[0][1]).to.equal(file2);
      rerender(
        <Provider store={getStore(false)}>
          <AddFilesForm {...fileFormProps} files={[file, file2]} uploading />
        </Provider>,
      );
      getByText('hello.jpg');
      getByText('hello2.jpg');
    });
  });

  context('when cstFriendlyEvidenceRequests is true', () => {
    it('should render updated file input section ui', () => {
      const { getByText } = render(
        <Provider store={getStore()}>
          <AddFilesForm {...fileFormProps} />
        </Provider>,
      );
      getByText('Upload Documents');
      getByText('If you have a document to upload, you can do that here.');
    });
  });

  it('should not add an invalid file type', () => {
    const spyOnAddFile = sinon.spy();

    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} onAddFile={spyOnAddFile} />
      </Provider>,
    );

    const fileUpload = $('#file-upload', container);
    fileUpload.__events.vaChange({
      detail: { files: [invalidFile] },
      srcElement: {
        'data-testid': fileUpload.getAttribute('data-testid'),
      },
    });
    expect(spyOnAddFile.called).to.be.false;
    expect(fileUpload.getAttribute('error')).to.equal(
      'Please choose a file from one of the accepted types.',
    );
  });

  it('should not add file of zero size', () => {
    const spyOnAddFile = sinon.spy();

    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} onAddFile={spyOnAddFile} />
      </Provider>,
    );

    const fileUpload = $('#file-upload', container);
    fileUpload.__events.vaChange({
      detail: { files: [zeroSizeFile] },
      srcElement: {
        'data-testid': fileUpload.getAttribute('data-testid'),
      },
    });
    expect(spyOnAddFile.called).to.be.false;
    expect(fileUpload.getAttribute('error')).to.equal(
      'The file you selected is empty. Files uploaded must be larger than 0B.',
    );
  });

  it('should not add an invalid file size', () => {
    const spyOnAddFile = sinon.spy();

    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} onAddFile={spyOnAddFile} />
      </Provider>,
    );

    const fileUpload = $('#file-upload', container);
    fileUpload.__events.vaChange({
      detail: { files: [invalidSizeFile] },
      srcElement: {
        'data-testid': fileUpload.getAttribute('data-testid'),
      },
    });
    expect(spyOnAddFile.called).to.be.false;
    expect(fileUpload.getAttribute('error')).to.equal(
      'The file you selected is larger than the 50MB maximum file size and could not be added.',
    );
  });

  it('should not add an invalid PDF file size', () => {
    const spyOnAddFile = sinon.spy();

    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} onAddFile={spyOnAddFile} />
      </Provider>,
    );

    const fileUpload = $('#file-upload', container);
    fileUpload.__events.vaChange({
      detail: { files: [invalidPdfSizeFile] },
      srcElement: {
        'data-testid': fileUpload.getAttribute('data-testid'),
      },
    });
    expect(spyOnAddFile.called).to.be.false;
    expect(fileUpload.getAttribute('error')).to.equal(
      'The file you selected is larger than the 50MB maximum file size and could not be added.',
    );
  });

  it('should add a valid jpg file', () => {
    const spyOnAddFile = sinon.spy();
    const mockReadAndCheckFile = () => ({
      checkIsEncryptedPdf: false,
      checkTypeAndExtensionMatches: true,
    });
    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm
          {...fileFormProps}
          onAddFile={spyOnAddFile}
          mockReadAndCheckFile={mockReadAndCheckFile}
        />
      </Provider>,
    );

    const fileUpload = $('#file-upload', container);
    fileUpload.__events.vaChange({
      detail: { files: [file] },
      srcElement: {
        'data-testid': fileUpload.getAttribute('data-testid'),
      },
    });
    expect(fileUpload.getAttribute('error')).to.not.exist;
  });

  it('should add a valid pdf file', () => {
    const spyOnAddFile = sinon.spy();
    const mockReadAndCheckFile = () => ({
      checkIsEncryptedPdf: false,
      checkTypeAndExtensionMatches: true,
    });
    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm
          {...fileFormProps}
          onAddFile={spyOnAddFile}
          mockReadAndCheckFile={mockReadAndCheckFile}
        />
      </Provider>,
    );

    const fileUpload = $('#file-upload', container);
    fileUpload.__events.vaChange({
      detail: { files: [pdfFile] },
      srcElement: {
        'data-testid': fileUpload.getAttribute('data-testid'),
      },
    });
    expect(fileUpload.getAttribute('error')).to.not.exist;
  });

  it('should return an error when the file extension & format do not match', () => {
    const spyOnAddFile = sinon.spy();
    const mockReadAndCheckFile = () => ({
      checkIsEncryptedPdf: false,
      checkTypeAndExtensionMatches: false,
    });
    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm
          {...fileFormProps}
          onAddFile={spyOnAddFile}
          mockReadAndCheckFile={mockReadAndCheckFile}
        />
      </Provider>,
    );

    const fileUpload = $('#file-upload', container);
    fileUpload.__events.vaChange({
      detail: { files: [invalidFileExtAndFormat] },
      srcElement: {
        'data-testid': fileUpload.getAttribute('data-testid'),
      },
    });
    expect(spyOnAddFile.called).to.be.false;
    expect(fileUpload.getAttribute('error')).to.equal(FILE_TYPE_MISMATCH_ERROR);
  });

  it('should return an error message when no files present and field is dirty', () => {
    const spyOnAddFile = sinon.spy();
    const field = { value: '', dirty: true };

    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm
          {...fileFormProps}
          onAddFile={spyOnAddFile}
          field={field}
        />
      </Provider>,
    );

    const fileUpload = $('#file-upload', container);
    expect(spyOnAddFile.called).to.be.false;
    expect(fileUpload.getAttribute('error')).to.equal(
      'Please select a file first',
    );
  });

  it('should show password input', () => {
    const spyOnAddFile = sinon.spy();
    const mockReadAndCheckFile = () => ({
      checkIsEncryptedPdf: false,
      checkTypeAndExtensionMatches: true,
    });
    const onFieldChange = sinon.spy();

    const { container, rerender } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm
          {...fileFormProps}
          onAddFile={spyOnAddFile}
          mockReadAndCheckFile={mockReadAndCheckFile}
        />
      </Provider>,
    );
    // Add File
    const fileUpload = $('#file-upload', container);
    fileUpload.__events.vaChange({
      detail: { files: [fileWithPassword] },
      srcElement: {
        'data-testid': fileUpload.getAttribute('data-testid'),
      },
    });

    expect(spyOnAddFile.called).to.be.true;

    rerender(
      <Provider store={getStore(false)}>
        <AddFilesForm
          {...fileFormProps}
          onFieldChange={onFieldChange}
          files={[fileWithPassword]}
          mockReadAndCheckFile={mockReadAndCheckFile}
        />
      </Provider>,
    );
    // Input password
    const passwordInput = $('va-text-input', container);
    expect(passwordInput).to.exist;
    passwordInput.value = '1234';
    fireEvent.input(passwordInput, {
      target: { name: 'password' },
    });
    expect(onFieldChange.called).to.be.true;
  });
});
