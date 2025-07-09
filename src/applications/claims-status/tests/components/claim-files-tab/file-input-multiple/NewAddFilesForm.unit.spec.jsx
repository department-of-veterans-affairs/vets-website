import React from 'react';
import { expect } from 'chai';
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
});
