import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import NewAddFilesForm from '../../../../components/claim-files-tab/file-input-multiple/NewAddFilesForm';

describe('NewAddFilesForm with va-file-input-multiple', () => {
  let container;
  let fileInputMultiple;

  beforeEach(() => {
    container = render(<NewAddFilesForm />).container;
    fileInputMultiple = $('va-file-input-multiple', container);
  });

  describe('User Story #1: Label and hint text', () => {
    it('should render va-file-input-multiple with correct label and hint text', () => {
      // Verify the component exists
      expect(fileInputMultiple).to.exist;

      // Check label attribute
      expect(fileInputMultiple.getAttribute('label')).to.equal(
        'Upload additional evidence',
      );

      // Check hint attribute
      expect(fileInputMultiple.getAttribute('hint')).to.equal(
        'You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only).',
      );
    });
  });

  describe('User Story #3: Adding files by clicking', () => {
    it('should call onChange when a file is added', () => {
      // This test will drive us to add an onChange prop to handle file changes
      const onChangeSpy = sinon.spy();

      // Re-render with onChange prop
      const { container: newContainer } = render(
        <NewAddFilesForm onChange={onChangeSpy} />,
      );
      const fileInput = $('va-file-input-multiple', newContainer);

      // Create a mock file
      const mockFile = new File(['test content'], 'test-file.pdf', {
        type: 'application/pdf',
      });

      // Simulate the vaMultipleChange event that the web component emits
      const changeEvent = new CustomEvent('vaMultipleChange', {
        detail: {
          action: 'FILE_ADDED',
          file: mockFile,
          state: [{ file: mockFile, changed: true }],
        },
      });

      fileInput.dispatchEvent(changeEvent);

      // Verify onChange was called with the event detail
      expect(onChangeSpy.called).to.be.true;
      expect(onChangeSpy.firstCall.args[0].detail.action).to.equal(
        'FILE_ADDED',
      );
      expect(onChangeSpy.firstCall.args[0].detail.file).to.equal(mockFile);
    });
  });
});
