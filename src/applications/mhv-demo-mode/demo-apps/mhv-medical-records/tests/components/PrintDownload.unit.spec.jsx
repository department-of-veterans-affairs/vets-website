import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import PrintDownload from '../../components/shared/PrintDownload';

describe('Print download menu component', () => {
  it('renders without errors', () => {
    const screen = render(<PrintDownload list />);
    expect(screen).to.exist;
  });

  it('should display a toggle menu button', () => {
    const screen = render(<PrintDownload list />);

    const printDownloadButton = screen.getByText('Print or download', {
      exact: true,
      selector: 'span',
    });
    expect(printDownloadButton).to.exist;
  });

  it('should display a print button for a list', () => {
    const screen = render(<PrintDownload list />);

    const printButton = screen.getByText('Print this list', {
      exact: true,
      selector: 'button',
    });
    expect(printButton).to.exist;
  });

  it('should display a print button for a single item', () => {
    const screen = render(<PrintDownload />);

    const printButton = screen.getByText('Print this page', {
      exact: true,
      selector: 'button',
    });
    expect(printButton).to.exist;
  });

  it('should display a download pdf file button', () => {
    const screen = render(<PrintDownload list />);

    const downloadButton = screen.getByText('Download PDF of this list', {
      exact: true,
      selector: 'button',
    });
    expect(downloadButton).to.exist;
  });

  it('should display a download pdf file button', () => {
    const screen = render(<PrintDownload />);

    const downloadButton = screen.getByText('Download PDF of this page', {
      exact: true,
      selector: 'button',
    });
    expect(downloadButton).to.exist;
  });

  it('should display a download text file button', () => {
    const screen = render(<PrintDownload list />);

    const downloadTextButton = screen.getByText(
      'Download a text file (.txt) of this list',
      {
        exact: true,
        selector: 'button',
      },
    );
    expect(downloadTextButton).to.exist;
  });

  it('should open', () => {
    const screen = render(<PrintDownload />);
    fireEvent.click(screen.getByTestId('print-download-menu'));
    const downloadPdfButton = screen.getByText('Download PDF of this page', {
      exact: true,
      selector: 'button',
    });
    expect(downloadPdfButton).to.exist;
  });

  it('should tab through the options', () => {
    const screen = render(<PrintDownload />);
    fireEvent.keyDown(screen.getByTestId('print-download-menu'), {
      keyCode: 40,
    });
    fireEvent.keyDown(screen.getByTestId('print-download-menu'), {
      keyCode: 38,
    });
    fireEvent.keyDown(screen.getByTestId('print-download-menu'), {
      keyCode: 27,
    });
    expect(screen).to.exist;
  });

  it('should close menu when Escape key is pressed, and focus on the toggle button', () => {
    const screen = render(<PrintDownload />);
    const toggleButton = screen.getByTestId('print-download-menu');

    // Open the menu
    fireEvent.click(toggleButton);
    expect(toggleButton).to.have.attribute('aria-expanded', 'true');

    // Press Escape
    fireEvent.keyDown(screen.container.querySelector('.print-download'), {
      keyCode: 27,
    });

    // Menu should be closed
    expect(toggleButton).to.have.attribute('aria-expanded', 'false');
    // Verify the toggle button is focused
    expect(document.activeElement).to.equal(toggleButton);
  });

  it('should close menu when focus leaves the menu container', () => {
    const screen = render(
      <div>
        <PrintDownload />
        <button data-testid="outside-button">Outside Button</button>
      </div>,
    );

    const toggleButton = screen.getByTestId('print-download-menu');
    const outsideButton = screen.getByTestId('outside-button');

    // Open the menu
    fireEvent.click(toggleButton);
    expect(toggleButton).to.have.attribute('aria-expanded', 'true');

    // Focus on the last menu item
    const lastMenuItem = screen.getByTestId('printButton-2');
    fireEvent.focus(lastMenuItem);

    // Blur from the menu container to outside element
    fireEvent.blur(screen.container.querySelector('.print-download'), {
      relatedTarget: outsideButton,
    });

    // Menu should be closed
    expect(toggleButton).to.have.attribute('aria-expanded', 'false');
  });

  it('should close menu when clicking outside the menu', () => {
    const screen = render(
      <div>
        <PrintDownload />
        <div data-testid="outside-area">Outside Area</div>
      </div>,
    );

    const toggleButton = screen.getByTestId('print-download-menu');
    const outsideArea = screen.getByTestId('outside-area');

    // Open the menu
    fireEvent.click(toggleButton);
    expect(toggleButton).to.have.attribute('aria-expanded', 'true');

    // Click outside the menu
    fireEvent.mouseDown(outsideArea);

    // Menu should be closed
    expect(toggleButton).to.have.attribute('aria-expanded', 'false');
  });
});
