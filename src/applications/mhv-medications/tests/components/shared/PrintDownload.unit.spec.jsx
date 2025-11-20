import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
import PrintDownload from '../../../components/shared/PrintDownload';
import { DOWNLOAD_FORMAT } from '../../../util/constants';

describe('Medications Print/Download button component', () => {
  let handleExportListDownload;
  let handlePrintPage;

  const setGlobalNavigator = value => {
    if (!global.navigator) global.navigator = {};
    global.navigator.onLine = value;
  };

  const setup = (
    onDownload = handleExportListDownload,
    success = false,
    list = false,
    onPrint = undefined,
    isLoading = undefined,
  ) => {
    return renderWithStoreAndRouterV6(
      <PrintDownload
        onDownload={onDownload}
        onPrint={onPrint}
        isSuccess={success}
        list={list}
        isLoading={isLoading}
      />,
      {},
    );
  };

  beforeEach(() => {
    handleExportListDownload = sinon.spy();
    handlePrintPage = sinon.spy();
  });

  it('renders without errors', () => {
    const screen = setup();
    const printButton = screen.getByText('Print this page');
    fireEvent.click(printButton);
    expect(screen);
  });

  it('renders without errors', () => {
    const screen = setup();
    const printButton = screen.getByText('Print this page');
    fireEvent.click(printButton);
    expect(screen);
  });

  it('displays error modal if error occurs ', async () => {
    const handleDownloadPDFError = () => {
      throw new Error('error');
    };
    const screen = setup(handleDownloadPDFError);
    const downloadButton = screen.getByText('Download a PDF of this page');
    fireEvent.click(downloadButton);

    const errorMessage = await screen.getByText(
      'We can’t download your records right now',
    );
    expect(errorMessage).to.exist;
  });

  it('displays success message ', () => {
    const screen = setup(handleExportListDownload, true);

    const sucessMessage = screen.getByText('Download started');
    expect(sucessMessage).to.exist;
  });

  it('displays spinner when loading ', () => {
    const screen = setup(
      handleExportListDownload,
      false,
      false,
      undefined,
      true,
    );

    expect(screen.getByTestId('print-download-loading-indicator')).to.exist;
  });

  it('button displays different text for list', () => {
    const screen = setup(handleExportListDownload, true, true);

    const printButton = screen.getByText('Print');
    const pdfDownloadButton = screen.getByText('Download a PDF');
    const textDownloadButton = screen.getByText('Download a text file (.txt)');
    expect(printButton).to.exist;
    expect(pdfDownloadButton).to.exist;
    expect(textDownloadButton).to.exist;
  });

  it('should start downloading PDF on PDF button click', () => {
    setGlobalNavigator(true);
    const screen = setup(handleExportListDownload, false, true);
    const downloadButton = screen.getByText('Download a PDF');
    fireEvent.click(downloadButton);
    expect(handleExportListDownload.getCalls().length).to.equal(1);
    expect(handleExportListDownload.calledWith(DOWNLOAD_FORMAT.TXT)).to.be
      .false;
    expect(handleExportListDownload.calledWith(DOWNLOAD_FORMAT.PDF)).to.be.true;
  });

  it('should start downloading TXT on TXT button click', () => {
    setGlobalNavigator(true);
    const screen = setup(handleExportListDownload, false, true);
    const downloadButton = screen.getByText('Download a text file (.txt)');
    fireEvent.click(downloadButton);
    expect(handleExportListDownload.getCalls().length).to.equal(1);
    expect(handleExportListDownload.calledWith(DOWNLOAD_FORMAT.PDF)).to.be
      .false;
    expect(handleExportListDownload.calledWith(DOWNLOAD_FORMAT.TXT)).to.be.true;
  });

  it('should start print page using custom fn on print button click', () => {
    const screen = setup(undefined, false, false, handlePrintPage);
    const printBtn = screen.getByText('Print this page');
    fireEvent.click(printBtn);
    expect(handlePrintPage.getCalls().length).to.equal(1);
  });

  it('user keyboard events: upArrow, downArrow, and esc keys', () => {
    const screen = setup(handleExportListDownload, false, true);
    const printDownloadDropdownList = screen.getByTestId('print-download-list');
    fireEvent.keyDown(printDownloadDropdownList, { charCode: 38 });
    fireEvent.keyDown(printDownloadDropdownList, { charCode: 40 });
    fireEvent.keyDown(printDownloadDropdownList, { charCode: 27 });

    expect(screen);
  });

  it('on mousedown, click user events ', () => {
    const screen = setup(handleExportListDownload, false, true);
    const printRecordsButton = screen.getByTestId('print-records-button');
    fireEvent.mouseDown(printRecordsButton);
    fireEvent.click(printRecordsButton);
    expect(screen);
  });
});
