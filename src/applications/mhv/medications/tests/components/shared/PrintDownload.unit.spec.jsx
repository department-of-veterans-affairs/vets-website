import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
import PrintDownload, {
  DOWNLOAD_FORMAT,
} from '../../../components/shared/PrintDownload';

describe('Medicaitons Print/Download button component', () => {
  let handleFullListDownload;
  const setup = (
    download = handleFullListDownload,
    success = false,
    list = false,
  ) => {
    return renderWithStoreAndRouter(
      <PrintDownload download={download} isSuccess={success} list={list} />,
      {
        path: '/',
      },
    );
  };

  beforeEach(() => {
    handleFullListDownload = sinon.spy();
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
      'We can’t access your medications right now',
    );
    expect(errorMessage).to.exist;
  });

  it('displays success message ', () => {
    const screen = setup(handleFullListDownload, true);

    const sucessMessage = screen.getByText('Download complete');
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
});
