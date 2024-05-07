import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import {
  uploadWithInfoComponent,
  acceptableFiles,
} from '../../../components/Sponsor/sponsorFileUploads';

describe('uploadWithInfoComponent', () => {
  it('should accept resource links', async () => {
    const upload = uploadWithInfoComponent(undefined, '', false, [
      { href: 'www.test.gov', text: 'Test' },
    ]);
    expect(upload.uiSchema).to.exist;
  });
});

describe('uploadWithInfoComponent', () => {
  it('should render list of acceptable files and links', async () => {
    const upload = uploadWithInfoComponent(
      acceptableFiles.va7959cCert,
      '',
      false,
    );
    const { container } = render(
      <>{upload.uiSchema['view:acceptableFilesList']['ui:description']}</>,
    );
    expect(container.querySelector('va-link').getAttribute('text')).to.equal(
      acceptableFiles.va7959cCert[0].text,
    );
  });
  it('should render nested bulleted list of acceptable files with links if present', async () => {
    const upload = uploadWithInfoComponent(
      acceptableFiles.schoolCert,
      '',
      false,
    );
    const { container } = render(
      <>{upload.uiSchema['view:acceptableFilesList']['ui:description']}</>,
    );
    expect(container.querySelector('va-link').getAttribute('text')).to.equal(
      acceptableFiles.schoolCert[0].bullets[0].text,
    );
  });
});
