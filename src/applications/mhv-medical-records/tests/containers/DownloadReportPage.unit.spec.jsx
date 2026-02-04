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

// Mock facility data for testing different user scenarios
const vistaOnlyFacilities = [{ facilityId: '123', isCerner: false }];
const ohOnlyFacilities = [{ facilityId: '456', isCerner: true }];
const bothFacilities = [
  { facilityId: '123', isCerner: false },
  { facilityId: '456', isCerner: true },
];

// Mock EHR data for facility name mapping
const ehrDataByVhaId = {
  123: { vamcSystemName: 'VA Medical Center - Vista' },
  456: { vamcSystemName: 'VA Medical Center - Oracle Health' },
};

// Base state for VistA-only user (default)
const getBaseState = (facilities = vistaOnlyFacilities, cernerIds = []) => ({
  user: {
    ...user,
    profile: {
      ...user.profile,
      facilities,
    },
  },
  drupalStaticData: {
    vamcEhrData: {
      data: {
        ehrDataByVhaId,
        cernerFacilities: cernerIds.map(id => ({ vhaId: id })),
      },
      loading: false,
    },
  },
  mr: {
    downloads: {
      generatingCCD: false,
      ccdError: false,
      bbDownloadSuccess: false,
      ccdDownloadSuccess: false,
    },
    blueButton: {
      failedDomains: [],
    },
    refresh: {
      status: null,
    },
  },
  featureToggles: {
    [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: true,
    [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdOH]: true,
  },
});

describe('DownloadRecordsPage - VistA Only User', () => {
  let screen;

  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: getBaseState(),
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
  });

  it('renders VistA intro text', () => {
    expect(
      screen.getByText(/Download your VA medical records as a single report/i),
    ).to.exist;
  });

  it('shows help section', () => {
    expect(screen.getByText('Need help?')).to.exist;
  });

  it('generates CCD (XML) on button click', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;

    fireEvent.click(ccdAccordion);
    const ccdGenerateButton = screen.getByTestId('generateCcdButtonXmlVistA');
    expect(ccdGenerateButton).to.exist;
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download XML (best for sharing with your provider)',
    );

    fireEvent.click(ccdGenerateButton);
    expect(screen.getByTestId('generating-ccd-VistA-indicator')).to.exist;
  });

  it('generates CCD (PDF) on button click', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;

    fireEvent.click(ccdAccordion);
    const ccdGenerateButton = screen.getByTestId('generateCcdButtonPdfVistA');
    expect(ccdGenerateButton).to.exist;
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download PDF (best for printing)',
    );

    fireEvent.click(ccdGenerateButton);
    expect(screen.getByTestId('generating-ccd-VistA-indicator')).to.exist;
  });

  it('generates CCD (HTML) on button click', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;

    fireEvent.click(ccdAccordion);
    const ccdGenerateButton = screen.getByTestId('generateCcdButtonHtmlVistA');
    expect(ccdGenerateButton).to.exist;
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download HTML (best for screen readers, enlargers, and refreshable Braille displays)',
    );

    fireEvent.click(ccdGenerateButton);
    expect(screen.getByTestId('generating-ccd-VistA-indicator')).to.exist;
  });
});

describe('DownloadRecordsPage - Oracle Health Only User', () => {
  let screen;

  beforeEach(() => {
    // OH-only user: all facilities are Cerner/OH
    const state = getBaseState(ohOnlyFacilities, ['456']);
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: state,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('renders OH-only intro text with singular "report"', () => {
    expect(screen.getByText('Download your medical records report')).to.exist;
    // Verify the intro paragraph exists (not the h2)
    expect(
      screen.getByRole('heading', {
        name: /Download your medical records report/i,
        level: 1,
      }),
    ).to.exist;
  });

  it('shows help section', () => {
    expect(screen.getByText('Need help?')).to.exist;
  });
});

describe('DownloadRecordsPage - Both VistA and Oracle Health User', () => {
  let screen;

  beforeEach(() => {
    // Both facilities: mix of VistA and OH
    const state = getBaseState(bothFacilities, ['456']);
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: state,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('shows help section', () => {
    expect(screen.getByText('Need help?')).to.exist;
  });
});

describe('DownloadRecordsPage with all SEI domains failed', () => {
  let screen;

  beforeEach(() => {
    mockApiRequest({}, false);

    screen = renderWithStoreAndRouter(<DownloadReportPage runningUnitTest />, {
      initialState: getBaseState(),
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
  let screen;

  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: getBaseState(),
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
  it('displays access trouble alert for BB document', async () => {
    const stateWithBBError = {
      ...getBaseState(),
      mr: {
        ...getBaseState().mr,
        alerts: { alertList: [{ type: ALERT_TYPE_BB_ERROR, isActive: true }] },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithBBError,
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
  let screen;

  beforeEach(() => {
    const stateWithBBSuccess = {
      ...getBaseState(),
      mr: {
        ...getBaseState().mr,
        downloads: {
          generatingCCD: false,
          ccdError: false,
          bbDownloadSuccess: true,
          ccdDownloadSuccess: false,
        },
      },
    };

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
  let screen;

  beforeEach(() => {
    const stateWithFlagOff = {
      ...getBaseState(),
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: false,
      },
    };

    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithFlagOff,
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

describe('DownloadRecordsPage with successful CCD download', () => {
  let screen;

  beforeEach(() => {
    const stateWithCCDSuccess = {
      ...getBaseState(),
      mr: {
        ...getBaseState().mr,
        downloads: {
          generatingCCD: false,
          ccdError: false,
          bbDownloadSuccess: false,
          ccdDownloadSuccess: true,
        },
      },
    };

    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithCCDSuccess,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders the CCD download success alert', () => {
    expect(screen.getByText(/Continuity of Care Document download/i)).to.exist;
  });
});

describe('DownloadRecordsPage with last successful update timestamp', () => {
  let screen;

  beforeEach(() => {
    const currentDate = new Date().toISOString();
    const stateWithRefreshStatus = {
      ...getBaseState(),
      mr: {
        ...getBaseState().mr,
        refresh: {
          status: [
            {
              extract: 'Allergy',
              lastSuccessfulCompleted: currentDate,
            },
            {
              extract: 'ChemistryHematology',
              lastSuccessfulCompleted: currentDate,
            },
            {
              extract: 'VPR',
              lastSuccessfulCompleted: currentDate,
            },
          ],
        },
      },
    };

    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithRefreshStatus,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders the last updated card', () => {
    expect(screen.getByTestId('new-records-last-updated')).to.exist;
  });
});

describe('DownloadRecordsPage - Missing EHR data for facility names', () => {
  const testNoneRecordedFallback = ehrData => {
    const state = {
      ...getBaseState(bothFacilities, ['456']),
      drupalStaticData: {
        vamcEhrData: {
          data: {
            ehrDataByVhaId: ehrData,
            cernerFacilities: [{ vhaId: '456' }],
          },
          loading: false,
        },
      },
    };
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: state,
      reducers: reducer,
      path: '/download-all',
    });
    expect(screen.getAllByText('None recorded').length).to.be.greaterThan(0);
  };

  it('renders "None recorded" when ehrDataByVhaId is missing', () => {
    testNoneRecordedFallback(undefined);
  });

  it('renders "None recorded" when facility IDs not found', () => {
    testNoneRecordedFallback({ 999: { vamcSystemName: 'Other' } });
  });
});

describe('DownloadRecordsPage - Oracle Health CCD not enabled', () => {
  it('shows VistaOnlyContent for VistA-only users when flag is false', () => {
    const state = getBaseState(vistaOnlyFacilities, []);
    state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdOH] = false;

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: state,
      reducers: reducer,
      path: '/download-all',
    });

    expect(
      screen.getByText(/Download your VA medical records as a single report/i),
    ).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
  });

  it('shows VistaOnlyContent for OH-only users when flag is false', () => {
    const state = getBaseState(ohOnlyFacilities, ['456']);
    state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdOH] = false;

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: state,
      reducers: reducer,
      path: '/download-all',
    });

    // Should show VistA intro text, not OH intro text
    expect(
      screen.getByText(/Download your VA medical records as a single report/i),
    ).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
    // Should not show OH-specific singular "report" heading
    expect(screen.queryByText('Download your medical records report')).to.not
      .exist;
  });

  it('shows VistaOnlyContent for users with both facilities when flag is false', () => {
    const state = getBaseState(bothFacilities, ['456']);
    state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdOH] = false;

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: state,
      reducers: reducer,
      path: '/download-all',
    });

    // Should show VistA intro text, not VistaAndOH intro text
    expect(
      screen.getByText(/Download your VA medical records as a single report/i),
    ).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
  });
});
