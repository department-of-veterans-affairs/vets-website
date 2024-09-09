import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
import PrintDownload from '../../../components/shared/PrintDownload';
import { DOWNLOAD_FORMAT } from '../../../util/constants';

describe('Medicaitons Print/Download button component', () => {
  let handleFullListDownload;
  let handlePrintPage;
  let handleTextDownload;
  const setup = (
    onDownload = handleFullListDownload,
    success = false,
    list = false,
    onText = undefined,
    onPrint = undefined,
  ) => {
    return renderWithStoreAndRouter(
      <PrintDownload
        onDownload={onDownload}
        onText={onText}
        onPrint={onPrint}
        isSuccess={success}
        list={list}
      />,
      {
        path: '/',
      },
    );
  };

  beforeEach(() => {
    handleFullListDownload = sinon.spy();
    handlePrintPage = sinon.spy();
    handleTextDownload = sinon.spy();
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
    const screen = setup(handleFullListDownload, true);

    const sucessMessage = screen.getByText('Download started');
    expect(sucessMessage).to.exist;
  });

  it('button displays different text for list', () => {
    const screen = setup(handleFullListDownload, true, true);

    const successMessage = screen.getByText('Download a PDF of this list');
    expect(successMessage).to.exist;
  });

  it('should start downloading PDF on PDF button click', () => {
    const screen = setup(handleFullListDownload, false, true);
    const downloadButton = screen.getByText('Download a PDF of this list');
    fireEvent.click(downloadButton);
    expect(handleFullListDownload.getCalls().length).to.equal(1);
    expect(handleFullListDownload.calledWith(DOWNLOAD_FORMAT.TXT)).to.be.false;
    expect(handleFullListDownload.calledWith(DOWNLOAD_FORMAT.PDF)).to.be.true;
  });

  it('should start downloading TXT on TXT button click', () => {
    const screen = setup(handleFullListDownload, false, true);
    const downloadButton = screen.getByText(
      'Download a text file (.txt) of this list',
    );
    fireEvent.click(downloadButton);
    expect(handleFullListDownload.getCalls().length).to.equal(1);
    expect(handleFullListDownload.calledWith(DOWNLOAD_FORMAT.PDF)).to.be.false;
    expect(handleFullListDownload.calledWith(DOWNLOAD_FORMAT.TXT)).to.be.true;
  });

  it('should start print page using custom fn on print button click', () => {
    const screen = setup(undefined, false, false, undefined, handlePrintPage);
    const printBtn = screen.getByText('Print this page');
    fireEvent.click(printBtn);
    expect(handlePrintPage.getCalls().length).to.equal(1);
  });

  it('should start txt download using custom fn on txt button click', () => {
    const screen = setup(
      undefined,
      false,
      false,
      handleTextDownload,
      undefined,
    );
    const txtBtn = screen.getByText('Download a text file (.txt) of this page');
    fireEvent.click(txtBtn);
    expect(handleTextDownload.getCalls().length).to.equal(1);
  });

  it('user keyboard events: upArrow, downArrow, and esc keys', () => {
    const screen = setup(handleFullListDownload, false, true);
    const printDownloadDropdownList = screen.getByTestId('print-download-list');
    fireEvent.keyDown(printDownloadDropdownList, { charCode: 38 });
    fireEvent.keyDown(printDownloadDropdownList, { charCode: 40 });
    fireEvent.keyDown(printDownloadDropdownList, { charCode: 27 });

    expect(screen);
  });

  it('on mousedown, click user events ', () => {
    const screen = setup(handleFullListDownload, false, true);
    const printRecordsButton = screen.getByTestId('print-records-button');
    fireEvent.mouseDown(printRecordsButton);
    fireEvent.click(printRecordsButton);
    expect(screen);
  });
});
