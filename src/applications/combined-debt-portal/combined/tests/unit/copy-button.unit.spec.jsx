import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import CopyButton from '../../components/CopyButton';

describe('CopyButton helper: ', () => {
  let mockClipboard;

  beforeEach(() => {
    mockClipboard = {
      writeText: sinon.spy(),
    };

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });
  });

  afterEach(() => {
    delete navigator.clipboard;
  });

  const renderCopyButton = (props = {}) => {
    const { container } = render(
      <CopyButton value="Test Value" buttonText="Copy" {...props} />,
    );
    return {
      button: container.querySelector('va-button'),
      container,
    };
  };

  it('should copy text when button is clicked', async () => {
    const { button } = renderCopyButton();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockClipboard.writeText.calledWith('Test Value')).to.be.true;
    });
  });

  it('should reset to initial state after timeout', async () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
    const { button } = renderCopyButton();

    expect(button.getAttribute('text')).to.equal('Copy');
    fireEvent.click(button);

    // Should show "Copied!"
    await waitFor(() => {
      expect(button.getAttribute('text')).to.equal('Copied!');
    });

    // Advance 3 seconds
    clock.tick(3000);

    // Should show "Copy" again
    await waitFor(() => {
      expect(button.getAttribute('text')).to.equal('Copy');
    });
    clock.restore();
  });

  it('should render with the correct button text', () => {
    const { button } = renderCopyButton({ buttonText: 'Copy Me' });
    expect(button.getAttribute('text')).to.equal('Copy Me');
  });
});
