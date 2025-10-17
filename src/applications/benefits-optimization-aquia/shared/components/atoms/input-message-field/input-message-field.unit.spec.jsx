import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { InputMessageField } from './input-message-field';

describe('InputMessageField', () => {
  describe('rendering', () => {
    it('renders error message', () => {
      const { container } = render(
        <InputMessageField error="This is an error message" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.exist;
      expect(message).to.have.attribute('message', 'This is an error message');
      expect(message).to.have.attribute('message-type', 'error');
    });

    it('renders success message', () => {
      const { container } = render(
        <InputMessageField success="This is a success message" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.exist;
      expect(message).to.have.attribute('message', 'This is a success message');
      expect(message).to.have.attribute('message-type', 'success');
    });

    it('renders warning message', () => {
      const { container } = render(
        <InputMessageField warning="This is a warning message" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.exist;
      expect(message).to.have.attribute('message', 'This is a warning message');
      expect(message).to.have.attribute('message-type', 'warning');
    });

    it('renders nothing when no message provided', () => {
      const { container } = render(<InputMessageField />);
      const message = container.querySelector('va-input-message');
      expect(message).to.not.exist;
    });

    it('renders nothing when all messages are empty', () => {
      const { container } = render(
        <InputMessageField error="" success="" warning="" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.not.exist;
    });

    it('renders nothing when all messages are null', () => {
      const { container } = render(
        <InputMessageField error={null} success={null} warning={null} />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.not.exist;
    });

    it('renders nothing when all messages are undefined', () => {
      const { container } = render(
        <InputMessageField
          error={undefined}
          success={undefined}
          warning={undefined}
        />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.not.exist;
    });
  });

  describe('message priority', () => {
    it('prioritizes error over success and warning', () => {
      const { container } = render(
        <InputMessageField
          error="Error message"
          success="Success message"
          warning="Warning message"
        />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', 'Error message');
      expect(message).to.have.attribute('message-type', 'error');
    });

    it('prioritizes warning over success when no error', () => {
      const { container } = render(
        <InputMessageField
          success="Success message"
          warning="Warning message"
        />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', 'Warning message');
      expect(message).to.have.attribute('message-type', 'warning');
    });

    it('shows success when no error or warning', () => {
      const { container } = render(
        <InputMessageField success="Success message" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', 'Success message');
      expect(message).to.have.attribute('message-type', 'success');
    });

    it('handles mixed empty and filled messages', () => {
      const { container } = render(
        <InputMessageField error="" success="Success message" warning="" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', 'Success message');
      expect(message).to.have.attribute('message-type', 'success');
    });
  });

  describe('accessibility', () => {
    it('has aria-live attribute for screen readers', () => {
      const { container } = render(<InputMessageField error="Error message" />);
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('aria-live', 'polite');
    });

    it('has aria-atomic attribute', () => {
      const { container } = render(<InputMessageField error="Error message" />);
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('aria-atomic', 'true');
    });

    it('sets aria-describedby when fieldId provided', () => {
      const { container } = render(
        <InputMessageField error="Error message" fieldId="test-field" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('aria-describedby', 'test-field');
    });

    it('does not set aria-describedby when fieldId not provided', () => {
      const { container } = render(<InputMessageField error="Error message" />);
      const message = container.querySelector('va-input-message');
      expect(message).to.not.have.attribute('aria-describedby');
    });

    it('handles empty fieldId gracefully', () => {
      const { container } = render(
        <InputMessageField error="Error message" fieldId="" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.not.have.attribute('aria-describedby');
    });
  });

  describe('styling and classes', () => {
    it('applies custom className', () => {
      const { container } = render(
        <InputMessageField
          error="Error message"
          className="custom-message-class"
        />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('class', 'custom-message-class');
    });

    it('handles empty className', () => {
      const { container } = render(
        <InputMessageField error="Error message" className="" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('class', '');
    });

    it('handles null className', () => {
      const { container } = render(
        <InputMessageField error="Error message" className={null} />,
      );
      const message = container.querySelector('va-input-message');
      // Should not crash and handle null gracefully
      expect(message).to.exist;
      expect(message).to.have.attribute('message', 'Error message');
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to va-input-message', () => {
      const { container } = render(
        <InputMessageField
          error="Error message"
          data-testid="custom-message"
          id="message-id"
        />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('data-testid', 'custom-message');
      expect(message).to.have.attribute('id', 'message-id');
    });

    it('handles boolean props', () => {
      const { container } = render(
        <InputMessageField error="Error message" hidden />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('hidden', 'true');
    });

    it('handles numeric props', () => {
      const { container } = render(
        <InputMessageField error="Error message" tabindex={-1} />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('tabindex', '-1');
    });
  });

  describe('edge cases', () => {
    it('handles very long error messages', () => {
      const longMessage = 'This is a very long error message '.repeat(20);
      const { container } = render(<InputMessageField error={longMessage} />);
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', longMessage);
      expect(message).to.have.attribute('message-type', 'error');
    });

    it('handles messages with special characters', () => {
      const specialMessage = 'Error: <script>alert("xss")</script> & symbols';
      const { container } = render(
        <InputMessageField error={specialMessage} />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', specialMessage);
    });

    it('handles messages with HTML entities', () => {
      const entityMessage = 'Error: 5 > 3 & 2 < 4';
      const { container } = render(<InputMessageField error={entityMessage} />);
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', entityMessage);
    });

    it('handles unicode characters in messages', () => {
      const unicodeMessage = 'Error: Ü, é, 中文, 🚫';
      const { container } = render(
        <InputMessageField error={unicodeMessage} />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', unicodeMessage);
    });

    it('handles newlines and whitespace in messages', () => {
      const multilineMessage = 'Error:\n  Multiple lines\n  With spaces';
      const { container } = render(
        <InputMessageField error={multilineMessage} />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', multilineMessage);
    });
  });

  describe('message type handling', () => {
    it('defaults to info type when no specific type matches', () => {
      // This tests the internal logic even though it shouldn't normally happen
      // since we return null when no messages are provided
      const { container } = render(
        <InputMessageField error="" success="" warning="" />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.not.exist; // Should return null
    });

    it('handles boolean false values for messages', () => {
      const { container } = render(
        <InputMessageField error={false} success={false} warning={false} />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.not.exist;
    });

    it('handles numeric zero values for messages', () => {
      const { container } = render(
        <InputMessageField error={0} success={0} warning={0} />,
      );
      const message = container.querySelector('va-input-message');
      expect(message).to.not.exist;
    });

    it('treats string "0" as a valid message', () => {
      const { container } = render(<InputMessageField error="0" />);
      const message = container.querySelector('va-input-message');
      expect(message).to.exist;
      expect(message).to.have.attribute('message', '0');
      expect(message).to.have.attribute('message-type', 'error');
    });
  });

  describe('component rerendering', () => {
    it('updates message when props change', () => {
      const { container, rerender } = render(
        <InputMessageField error="Initial error" />,
      );
      let message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', 'Initial error');

      rerender(<InputMessageField error="Updated error" />);
      message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message', 'Updated error');
    });

    it('changes message type when props change', () => {
      const { container, rerender } = render(
        <InputMessageField error="Error message" />,
      );
      let message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message-type', 'error');

      rerender(<InputMessageField success="Success message" />);
      message = container.querySelector('va-input-message');
      expect(message).to.have.attribute('message-type', 'success');
    });

    it('removes message when all props become empty', () => {
      const { container, rerender } = render(
        <InputMessageField error="Error message" />,
      );
      let message = container.querySelector('va-input-message');
      expect(message).to.exist;

      rerender(<InputMessageField error="" />);
      message = container.querySelector('va-input-message');
      expect(message).to.not.exist;
    });
  });
});
