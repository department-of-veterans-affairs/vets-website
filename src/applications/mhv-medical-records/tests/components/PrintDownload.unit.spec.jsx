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
    const screen = render(<PrintDownload list allowTxtDownloads />);

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
    fireEvent.click(screen.getByTestId('print-records-button'));
    const downloadPdfButton = screen.getByText('Download PDF of this page', {
      exact: true,
      selector: 'button',
    });
    expect(downloadPdfButton).to.exist;
  });

  it('should tab through the options', () => {
    const screen = render(<PrintDownload />);
    fireEvent.keyDown(screen.getByTestId('print-records-button'), {
      keyCode: 40,
    });
    fireEvent.keyDown(screen.getByTestId('print-records-button'), {
      keyCode: 38,
    });
    fireEvent.keyDown(screen.getByTestId('print-records-button'), {
      keyCode: 27,
    });
    expect(screen).to.exist;
  });
});
