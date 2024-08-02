import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import {
  uploadWithInfoComponent,
  acceptableFiles,
} from '../../../components/Sponsor/sponsorFileUploads';
import {
  createPayload,
  findAndFocusLastSelect,
} from '../../../../shared/components/fileUploads/upload';

describe('uploadWithInfoComponent', () => {
  it('should accept resource links', async () => {
    const upload = uploadWithInfoComponent(undefined, '', [
      { href: 'www.test.gov', text: 'Test' },
    ]);
    expect(upload.uiSchema).to.exist;
  });
});

describe('uploadWithInfoComponent', () => {
  it('should render list of acceptable files and links', async () => {
    const upload = uploadWithInfoComponent(acceptableFiles.va7959cCert, '');
    const { container } = render(
      <>{upload.uiSchema['view:acceptableFilesList']['ui:description']}</>,
    );
    expect(container.querySelector('va-link').getAttribute('text')).to.equal(
      acceptableFiles.va7959cCert[0].text,
    );
  });
  it('should render nested bulleted list of acceptable files with links if present', async () => {
    const upload = uploadWithInfoComponent(acceptableFiles.schoolCert, '');
    const { container } = render(
      <>{upload.uiSchema['view:acceptableFilesList']['ui:description']}</>,
    );
    expect(container.querySelector('va-link').getAttribute('text')).to.equal(
      acceptableFiles.schoolCert[0].bullets[0].text,
    );
  });
});

describe('fileUploadUI functions', () => {
  it('should create a formData containing the same file', async () => {
    const fileObj = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });
    const payload = createPayload(fileObj, '10-10d', 'password');
    expect(payload.get('file')).to.equal(fileObj);
  });
  it('should not add password to formData when missing', async () => {
    const fileObj = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });
    const payload = createPayload(fileObj, '10-10d');
    expect(payload.get('file')).to.equal(fileObj);
  });
  it('should not find any select elements when page is empty', async () => {
    expect(findAndFocusLastSelect().length).to.equal(0);
  });
});
