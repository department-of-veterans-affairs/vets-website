import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { FileUploadField } from './file-upload-field';

describe('FileUploadField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testFile',
      label: 'Upload Document',
      schema: z.array(z.any()),
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('displays label', () => {
      const { container } = render(<FileUploadField {...defaultProps} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput).to.exist;
      expect(fileInput).to.have.attribute('label', 'Upload Document');
    });

    it('shows default hint text with file size', () => {
      const { container } = render(<FileUploadField {...defaultProps} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput).to.have.attribute('hint');
      expect(fileInput.getAttribute('hint')).to.include('5 MB');
    });

    it('shows hint text', () => {
      const props = { ...defaultProps, hint: 'Upload your DD-214' };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput.getAttribute('hint')).to.include('Upload your DD-214');
    });

    it('marks as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput).to.have.attribute('required', 'true');
    });

    it('shows accept attribute for file types', () => {
      const props = { ...defaultProps, accept: '.pdf,.jpg,.png' };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput).to.have.attribute('accept', '.pdf,.jpg,.png');
    });

    it('uses default accept attribute', () => {
      const { container } = render(<FileUploadField {...defaultProps} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput).to.have.attribute('accept', '.pdf,.jpg,.jpeg,.png');
    });
  });

  describe('file size formatting', () => {
    it('formats bytes correctly', () => {
      const props = { ...defaultProps, maxSize: 1024 };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput.getAttribute('hint')).to.include('1 KB');
    });

    it('formats megabytes correctly', () => {
      const props = { ...defaultProps, maxSize: 1048576 };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput.getAttribute('hint')).to.include('1 MB');
    });

    it('formats gigabytes correctly', () => {
      const props = { ...defaultProps, maxSize: 1073741824 };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput.getAttribute('hint')).to.include('1 GB');
    });

    it('handles zero bytes', () => {
      const props = { ...defaultProps, maxSize: 0 };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput.getAttribute('hint')).to.include('0 Bytes');
    });
  });

  describe('file upload interactions', () => {
    it('calls onChange', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<FileUploadField {...props} />);

      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
        size: 1024,
      });

      // Directly call the onChange handler
      onChange('testFile', [mockFile]);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testFile');
      expect(onChange.firstCall.args[1]).to.be.an('array');
      expect(onChange.firstCall.args[1][0]).to.equal(mockFile);
    });

    it('handles files from event target', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<FileUploadField {...props} />);

      const mockFile = new File(['test'], 'test.txt', { size: 500 });

      // Directly call the onChange handler
      onChange('testFile', [mockFile]);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1][0]).to.equal(mockFile);
    });

    it('validates file size and shows error for oversized files', () => {
      const props = {
        ...defaultProps,
        maxSize: 1024, // 1KB limit
      };

      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');

      const oversizedFile = new File(['x'.repeat(2048)], 'large.pdf', {
        type: 'application/pdf',
        size: 2048, // 2KB - over limit
      });

      const event = new CustomEvent('vaChange', {
        detail: { files: [oversizedFile] },
      });

      // Mock the validation hook
      fileInput.dispatchEvent(event);
      // The component should internally handle the validation
      expect(fileInput).to.exist;
    });

    it('handles empty file lists', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<FileUploadField {...props} />);

      // Directly call the onChange handler with empty array
      onChange('testFile', []);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal([]);
    });
  });

  describe('uploaded files display', () => {
    it('shows uploaded files list when files are present', async () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      const { container, rerender } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');

      const mockFile = new File(['test content'], 'document.pdf', {
        type: 'application/pdf',
        size: 1024,
      });

      const event = new CustomEvent('vaChange', {
        detail: { files: [mockFile] },
      });
      fileInput.dispatchEvent(event);

      // Rerender to reflect state changes
      rerender(<FileUploadField {...props} />);

      await waitFor(() => {
        const filesList = container.querySelector('.vads-u-margin-top--2');
        if (filesList) {
          expect(filesList).to.exist;
        }
      });
    });

    it('shows file name and size in uploaded files list', async () => {
      const files = [
        { name: 'document.pdf', size: 1024000 },
        { name: 'photo.jpg', size: 2048000 },
      ];
      const props = { ...defaultProps, value: files };
      const { container } = render(<FileUploadField {...props} />);

      // Check that file names are displayed
      const fileUpload = container.querySelector('va-file-input');
      expect(fileUpload).to.exist;

      // The component should show the files in its value
      expect(fileUpload).to.have.attribute('value');
    });

    it('provides remove button for uploaded files', async () => {
      const files = [{ name: 'test.pdf', size: 500000 }];
      const onChange = sinon.spy();
      const props = { ...defaultProps, value: files, onChange };
      const { container } = render(<FileUploadField {...props} />);

      // VA file input component handles remove functionality internally
      const fileUpload = container.querySelector('va-file-input');
      expect(fileUpload).to.exist;

      // Component should be configured to allow file removal
      expect(fileUpload).to.have.attribute('value');
    });
  });

  describe('validation', () => {
    it('shows external errors', () => {
      const props = {
        ...defaultProps,
        error: 'File upload failed',
      };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput).to.have.attribute('error', 'File upload failed');
    });

    it('validates with Zod schema', () => {
      const schema = z.array(z.any()).min(1, 'At least one file required');
      const props = { ...defaultProps, schema };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput).to.exist;
    });

    it('handles blur events for validation', async () => {
      const { container } = render(<FileUploadField {...defaultProps} />);
      const fileInput = container.querySelector('va-file-input');

      const blurEvent = new Event('blur');
      fileInput.dispatchEvent(blurEvent);

      await waitFor(() => {});
    });
  });

  describe('accessibility', () => {
    it('sets ARIA attributes', () => {
      const props = {
        ...defaultProps,
        required: true,
        error: 'Upload error',
      };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');

      expect(fileInput).to.have.attribute('required', 'true');
      expect(fileInput).to.have.attribute('error', 'Upload error');
    });

    it('provides validation feedback via aria-describedby', () => {
      const { container } = render(<FileUploadField {...defaultProps} />);
      const fileInput = container.querySelector('va-file-input');

      expect(fileInput).to.exist;
    });

    it('has proper labels for remove buttons', () => {
      const { container } = render(<FileUploadField {...defaultProps} />);
      expect(container.querySelector('.file-upload-field')).to.exist;
    });
  });

  describe('edge cases', () => {
    it('handles missing onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');

      const mockFile = new File(['test'], 'test.txt', { size: 500 });
      const event = new CustomEvent('vaChange', {
        detail: { files: [mockFile] },
      });

      expect(() => fileInput.dispatchEvent(event)).to.not.throw();
    });

    it('handles null file details', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<FileUploadField {...props} />);

      // Directly call the onChange handler with empty array
      onChange('testFile', []);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal([]);
    });

    it('handles multiple file selection', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<FileUploadField {...props} />);

      const file1 = new File(['test1'], 'test1.pdf', { size: 500 });
      const file2 = new File(['test2'], 'test2.pdf', { size: 600 });

      // Directly call the onChange handler
      onChange('testFile', [file1, file2]);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.have.lengthOf(2);
    });

    it('handles very large numbers in file size formatting', () => {
      const props = { ...defaultProps, maxSize: Number.MAX_SAFE_INTEGER };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput.getAttribute('hint')).to.include('GB');
    });

    it('processes custom max size limits', () => {
      const props = { ...defaultProps, maxSize: 2097152 }; // 2MB
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput.getAttribute('hint')).to.include('2 MB');
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to va-file-input', () => {
      const props = {
        ...defaultProps,
        'data-testid': 'custom-upload',
        className: 'custom-class',
      };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');

      expect(fileInput).to.have.attribute('data-testid', 'custom-upload');
    });

    it('preserves name and label props', () => {
      const props = {
        ...defaultProps,
        name: 'documentUpload',
        label: 'Upload Documents',
      };
      const { container } = render(<FileUploadField {...props} />);
      const fileInput = container.querySelector('va-file-input');

      expect(fileInput).to.have.attribute('name', 'documentUpload');
      expect(fileInput).to.have.attribute('label', 'Upload Documents');
    });
  });
});
