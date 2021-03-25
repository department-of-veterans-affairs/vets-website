import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { AddFilesForm } from '../../components/AddFilesForm';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_PDF_SIZE_BYTES,
  MAX_PDF_SIZE_MB,
} from '../../utils/validations';

describe('<AddFilesForm>', () => {
  it('should render component', () => {
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
    expect(tree.everySubTree('FileInput')).not.to.be.empty;
    expect(tree.everySubTree('Modal')[0].props.visible).to.be.false;
    expect(tree.everySubTree('Modal')[1].props.visible).to.be.false;
  });

  it('should show uploading modal', () => {
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
        uploading
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
    expect(tree.everySubTree('Modal')[0].props.visible).to.be.true;
  });

  it('should show mail or fax modal', () => {
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
        showMailOrFax
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
    expect(tree.everySubTree('Modal')[1].props.visible).to.be.true;
  });

  it('should not submit if files empty', () => {
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
    tree.getMountedInstance().submit();
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
    tree.getMountedInstance().submit();
    expect(onSubmit.called).to.be.false;
    expect(onDirtyFields.called).to.be.true;
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
        pdfSizeFeature
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
        name: 'something.jpg',
        size: 9999,
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
        pdfSizeFeature
      />,
    );
    tree.getMountedInstance().add([
      {
        name: 'something.pdf',
        size: validPdfFileSize,
      },
    ]);
    expect(onAddFile.called).to.be.true;
    expect(tree.getMountedInstance().state.errorMessage).to.be.null;
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
        requestLockedPdfPassword
      />,
    );
    expect(tree.getMountedInstance().state.errorMessage).to.be.null;
    expect(tree.subTree('TextInput')).to.exist;
  });
});
