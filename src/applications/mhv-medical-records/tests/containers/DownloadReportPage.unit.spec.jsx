import { expect } from 'chai';
import React from 'react';
import { waitFor } from '@testing-library/react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { beforeEach, describe, it } from 'mocha';
import { fireEvent } from '@testing-library/dom';
import reducer from '../../reducers';
import DownloadReportPage from '../../containers/DownloadReportPage';
import user from '../fixtures/user.json';
import { ALERT_TYPE_BB_ERROR } from '../../util/constants';

describe('DownloadRecordsPage', () => {
  const baseState = {
    user,
    mr: {
      downloads: {
        generatingCCD: false,
        ccdError: false,
        bbDownloadSuccess: false,
      },
      blueButton: {
        failedDomains: [],
      },
    },
    featureToggles: {
      [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: true,
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: baseState,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
  });

  it('generates CCD (XML) on button click', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;

    fireEvent.click(ccdAccordion);
    const ccdGenerateButton = screen.getByTestId('generateCcdButtonXml');
    expect(ccdGenerateButton).to.exist;
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download XML (best for sharing with your provider)',
    );

    fireEvent.click(ccdGenerateButton);
    expect(screen.container.querySelector('#generating-ccd-indicator')).to
      .exist;
  });

  it('generates CCD (PDF) on button click', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;

    fireEvent.click(ccdAccordion);
    const ccdGenerateButton = screen.getByTestId('generateCcdButtonPdf');
    expect(ccdGenerateButton).to.exist;
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download PDF (best for printing)',
    );

    fireEvent.click(ccdGenerateButton);
    expect(screen.container.querySelector('#generating-ccd-indicator')).to
      .exist;
  });

  it('generates CCD (HTML) on button click', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;

    fireEvent.click(ccdAccordion);
    const ccdGenerateButton = screen.getByTestId('generateCcdButtonHtml');
    expect(ccdGenerateButton).to.exist;
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download HTML (best for screen readers, enlargers, and refreshable Braille displays)',
    );

    fireEvent.click(ccdGenerateButton);
    expect(screen.container.querySelector('#generating-ccd-indicator')).to
      .exist;
  });

  it('shows help section', () => {
    // Confirm the NeedHelpSection component is rendered
    expect(screen.getByText('Need help?')).to.exist;
  });
});

describe('DownloadRecordsPage with all SEI domains failed', () => {
  let screen;

  beforeEach(() => {
    // Mock the API to return an error, which will cause generateSEIPdf to fail
    mockApiRequest({}, false);

    screen = renderWithStoreAndRouter(<DownloadReportPage runningUnitTest />, {
      initialState: {
        user,
        mr: {
          downloads: {
            generatingCCD: false,
            ccdError: false,
            bbDownloadSuccess: false,
          },
          blueButton: { failedDomains: [] },
        },
      },
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('displays access trouble alert for SEI document on error', async () => {
    const seiAccordion = screen.getByTestId('selfEnteredAccordionItem');
    fireEvent.click(seiAccordion);

    const seiGenerateButton = screen.getByTestId('downloadSelfEnteredButton');
    fireEvent.click(seiGenerateButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "We can't download your self-entered information right now",
        ),
      ).to.exist;
    });
  });
});

describe('DownloadRecordsPage triggering SEI PDF download', () => {
  // Here we simulate a scenario where SEI data is readily available
  const stateWithSeiData = {
    user,
    mr: {
      downloads: {
        generatingCCD: false,
        ccdError: false,
        bbDownloadSuccess: false,
      },
      blueButton: {
        failedDomains: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithSeiData,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('allows downloading the SEI report PDF', () => {
    const seiAccordion = screen.getByTestId('selfEnteredAccordionItem');
    expect(seiAccordion).to.exist;

    fireEvent.click(seiAccordion);
    const downloadButton = screen.getByTestId('downloadSelfEnteredButton');
    expect(downloadButton).to.exist;

    fireEvent.click(downloadButton);
    expect(downloadButton).to.exist;
  });

  it('generates sei pdf on button click', () => {
    const seiAccordion = screen.getByTestId('selfEnteredAccordionItem');
    expect(seiAccordion).to.exist;

    fireEvent.click(seiAccordion);
    const seiGenerateButton = screen.getByTestId('downloadSelfEnteredButton');
    expect(seiGenerateButton).to.exist;

    fireEvent.click(seiGenerateButton);
    waitFor(() => {
      expect(screen.container.querySelector('#generating-sei-indicator')).to
        .exist;
    });
  });
});

describe('DownloadRecordsPage with a general BB download error', () => {
  const stateWithAllSeiFailed = {
    user,
    mr: {
      alerts: { alertList: [{ type: ALERT_TYPE_BB_ERROR, isActive: true }] },
    },
  };

  it('displays access trouble alert for BB document', async () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithAllSeiFailed,
      reducers: reducer,
      path: '/download-all',
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "We can't download your medical records reports right now",
        ),
      ).to.exist;
    });
  });
});

describe('DownloadRecordsPage with successful Blue Button download alert', () => {
  const stateWithBBSuccess = {
    user,
    mr: {
      downloads: {
        generatingCCD: false,
        ccdError: false,
        bbDownloadSuccess: true, // set success flag to true
      },
      blueButton: {
        failedDomains: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithBBSuccess,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders the Blue Button download success alert', () => {
    expect(screen.getByText('Your VA Blue Button report download has started'))
      .to.exist;
  });
});

describe('DownloadRecordsPage with extended file types flag OFF', () => {
  const baseState = {
    user,
    mr: {
      downloads: {
        generatingCCD: false,
        ccdError: false,
        bbDownloadSuccess: false,
      },
      blueButton: {
        failedDomains: [],
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: false,
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: baseState,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('does not render the CCD PDF button', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;
    fireEvent.click(ccdAccordion);
    expect(screen.queryByTestId('generateCcdButtonPdf')).to.be.null;
  });

  it('does not render the CCD HTML button', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;
    fireEvent.click(ccdAccordion);
    expect(screen.queryByTestId('generateCcdButtonHtml')).to.be.null;
  });
});
