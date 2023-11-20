import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import DocumentUploader from '../../../components/DocumentUploader/DocumentUploader';

describe('DocumentUploader', () => {
  it('should render with the expected fields', () => {
    const { container } = render(<DocumentUploader />);
    expect($('va-select', container)).to.exist;
    expect($('va-file-input', container)).to.exist;
  });

  it('should not submit with no documents', () => {
    const { container } = render(<DocumentUploader />);
    $('va-select', container).value = 'Discharge or separation papers (DD214)';
    userEvent.click($('va-button', container));

    const fileInput = document.querySelector('va-file-input');
    expect(fileInput.getAttribute('error')).to.equal(
      'Choose a file to upload.',
    );
  });

  it('should uploaded file', () => {
    const file = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });
    const { container } = render(<DocumentUploader />);

    const input = $('va-file-input', container);
    expect(input).to.exist;
    $('va-select', container).value = 'Discharge or separation papers (DD214)';

    userEvent.upload(input, file);
    expect(input.files[0]).to.equal(file);
    expect(input.files.item(0)).to.equal(file);
    expect(input.files).to.have.lengthOf(1);
  });

  it('should upload multiple files', () => {
    const file1 = new File(['hello'], 'hello.png', { type: 'image/png' });
    const file2 = new File(['there'], 'there.png', { type: 'image/png' });
    const { container } = render(<DocumentUploader />);

    const input = $('va-file-input', container);
    expect(input).to.exist;
    $('va-select', container).value = 'Discharge or separation papers (DD214)';
    userEvent.upload(input, file1);
    userEvent.upload(input, file2);
    expect(input.files[0]).to.equal(file2);
    expect(input.files.item(0)).to.equal(file2);
    expect(input.files).to.have.lengthOf(1);
  });
});
