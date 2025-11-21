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
    expect(screen).to.exist;
  });

  it('shows toggle menu button text', () => {
    const screen = setup();
    expect(screen.getByText(/Print or download/, { selector: 'span' })).to
      .exist;
  });

  it('displays print/download buttons for list context', () => {
    const screen = setup(handleExportListDownload, false, true);
    expect(screen.getByText('Print')).to.exist;
    expect(screen.getByText('Download a PDF')).to.exist;
    expect(screen.getByText('Download a text file (.txt)')).to.exist;
  });

  // it('displays error modal if error occurs ', async () => {
  //   const handleDownloadPDFError = () => {
  //     throw new Error('error');
  //   };
  //   const screen = setup(handleDownloadPDFError);
  //   const errorMessage = screen.getByText('error');
  //   expect(errorMessage).to.exist;
  // });

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

  // New tests copied from mhv-medical-records/tests/components/PrintDownload.unit.spec.jsx
  it('should toggle aria-expanded when menu opens and closes', () => {
    const screen = setup(handleExportListDownload, false, true);
    const toggle = screen.getByTestId('print-records-button');
    expect(toggle).to.have.attribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).to.have.attribute('aria-expanded', 'true');
    fireEvent.click(toggle);
    expect(toggle).to.have.attribute('aria-expanded', 'false');
  });

  it('closes menu and returns focus to toggle on Escape key', () => {
    const screen = setup(handleExportListDownload, false, true);
    const toggle = screen.getByTestId('print-records-button');
    fireEvent.click(toggle); // open
    expect(toggle).to.have.attribute('aria-expanded', 'true');
    fireEvent.keyDown(screen.container.querySelector('.print-download'), {
      keyCode: 27,
    });
    expect(toggle).to.have.attribute('aria-expanded', 'false');
    expect(document.activeElement).to.equal(toggle);
  });

  // it('closes menu when focus leaves menu container (blur)', () => {
  // This test fails in jsdom due to focus/blur limitations, but works in real browsers.
  // Moving to e2e test -
  it.skip('closes menu when focus leaves menu container (blur)', () => {
    const screen = setup(handleExportListDownload, false, true);
    const toggle = screen.getByTestId('print-records-button');

    const outsideDiv = document.createElement('div');
    outsideDiv.textContent = 'Outside';
    outsideDiv.setAttribute('data-testid', 'outside-area');
    screen.container.appendChild(outsideDiv);

    fireEvent.click(toggle); // open
    expect(toggle).to.have.attribute('aria-expanded', 'true');

    // Focus on the last menu item
    const lastMenuItem = screen.container.querySelector('#printButton-2');
    fireEvent.focus(lastMenuItem);

    // Blur from the menu container to outside element
    fireEvent.focus(outsideDiv);
    fireEvent.blur(screen.container.querySelector('#printButton-2'), {
      relatedTarget: outsideDiv,
    });

    // Menu should be closed
    expect(toggle).to.have.attribute('aria-expanded', 'false');
  });

  it('closes menu when clicking outside', () => {
    const screen = setup(handleExportListDownload, false, true);
    const toggle = screen.getByTestId('print-records-button');

    const outsideDiv = document.createElement('div');
    outsideDiv.textContent = 'Outside';
    outsideDiv.setAttribute('data-testid', 'outside-area');
    screen.container.appendChild(outsideDiv);

    fireEvent.click(toggle); // open
    expect(toggle).to.have.attribute('aria-expanded', 'true');

    // Click outside the menu
    fireEvent.mouseDown(outsideDiv);

    // Menu should be closed
    expect(toggle).to.have.attribute('aria-expanded', 'false');
  });
});
