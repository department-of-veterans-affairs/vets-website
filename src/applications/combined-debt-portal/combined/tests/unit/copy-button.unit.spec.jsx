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
    const { container, getByRole } = render(
      <CopyButton value="Test Value" buttonText="Copy" {...props} />,
    );
    return {
      button: getByRole('button'),
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

    expect(button.textContent).to.include('Copy');
    fireEvent.click(button);

    // Should show "Copied!"
    await waitFor(() => {
      expect(button.textContent).to.include('Copied!');
    });

    // Advance 2 seconds
    clock.tick(2000);

    // Should show "Copy" again
    await waitFor(() => {
      expect(button.textContent).to.include('Copy');
    });
    clock.restore();
  });

  it('should render with the correct button text', () => {
    const { button } = renderCopyButton({ buttonText: 'Copy Me' });
    expect(button.textContent).to.include('Copy Me');
  });
});
