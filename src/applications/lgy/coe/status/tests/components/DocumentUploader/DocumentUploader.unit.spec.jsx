import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

import DocumentUploader from '../../../components/DocumentUploader/DocumentUploader';

describe('DocumentUploader', () => {
  it('should render with the expected fields', () => {
    const screen = render(<DocumentUploader />);
    expect(screen.baseElement.querySelector('va-file-input')).to.have.attribute(
      'button-text',
      'Upload your document',
    );
    expect(screen.getAllByRole('combobox').length).to.equal(1);
  });

  it('should not submit with no documents', () => {
    const screen = render(<DocumentUploader />);
    userEvent.selectOptions(screen.getByRole('combobox'), [
      'Discharge or separation papers (DD214)',
    ]);
    userEvent.click(screen.getByRole('button', { name: /Submit files/ }));
    expect(screen.baseElement.querySelector('va-file-input')).to.have.attribute(
      'error',
      'Please choose a file to upload.',
    );
  });

  it('should uploaded file', () => {
    const file = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });
    const screen = render(<DocumentUploader />);
    const input = screen.baseElement.querySelector(
      'va-file-input[button-text="Upload your document"]',
    );
    expect(input).to.exist;
    userEvent.selectOptions(screen.getByRole('combobox'), [
      'Discharge or separation papers (DD214)',
    ]);
    userEvent.upload(input, file);
    expect(input.files[0]).to.equal(file);
    expect(input.files.item(0)).to.equal(file);
    expect(input.files).to.have.lengthOf(1);
  });

  it('should upload multiple files', () => {
    const file1 = new File(['hello'], 'hello.png', { type: 'image/png' });
    const file2 = new File(['there'], 'there.png', { type: 'image/png' });
    const screen = render(<DocumentUploader />);
    const input = screen.getByLabelText(/Upload your document/i);
    expect(input).to.exist;
    userEvent.selectOptions(screen.getByRole('combobox'), [
      'Discharge or separation papers (DD214)',
    ]);
    userEvent.upload(input, file1);
    userEvent.upload(input, file2);
    expect(input.files[0]).to.equal(file2);
    expect(input.files.item(0)).to.equal(file2);
    expect(input.files).to.have.lengthOf(1);
  });
});
