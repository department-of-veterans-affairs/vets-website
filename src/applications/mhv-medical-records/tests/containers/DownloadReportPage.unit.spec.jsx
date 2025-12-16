import { expect } from 'chai';
import React from 'react';
import { waitFor } from '@testing-library/react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { beforeEach, describe, it, afterEach } from 'mocha';
import { fireEvent } from '@testing-library/dom';
import reducer from '../../reducers';
import DownloadReportPage from '../../containers/DownloadReportPage';
import { ALERT_TYPE_BB_ERROR } from '../../util/constants';

/**
 * Unit tests for DownloadReportPage.jsx
 *
 * Tests the conditional rendering logic based on user facility types:
 * 1. hasBothDataSources - User has both VistA and Oracle Health facilities
 * 2. hasOHOnly - User has only Oracle Health (Cerner) facilities
 * 3. Default (VistA only) - User has only VistA facilities
 */

// Base state for VistA-only user (default case)
const vistaOnlyBaseState = {
  user: {
    profile: {
      userFullName: { first: 'John', last: 'Smith' },
      dob: '1974-04-06',
      facilities: [
        {
          facilityId: '516',
          isCerner: false,
        },
      ],
    },
  },
  mr: {
    downloads: {
      generatingCCD: false,
      ccdDownloadSuccess: false,
      error: false,
      bbDownloadSuccess: false,
    },
    blueButton: {
      failedDomains: [],
    },
    refresh: {
      status: [],
    },
  },
  featureToggles: {
    [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: true,
    loading: false,
  },
  drupalStaticData: {
    vamcEhrData: {
      loading: false,
      data: {
        ehrDataByVhaId: {
          '516': {
            vhaId: '516',
            vamcFacilityName: 'Test VA Medical Center',
            vamcSystemName: 'VA Test health care',
            ehr: 'vista',
          },
        },
        cernerFacilities: [],
      },
    },
  },
};

// State for Oracle Health (Cerner) only user
const ohOnlyBaseState = {
  user: {
    profile: {
      userFullName: { first: 'Oracle', last: 'Only' },
      dob: '1970-01-01',
      facilities: [
        {
          facilityId: '757',
          isCerner: true,
        },
      ],
    },
  },
  mr: {
    downloads: {
      generatingCCD: false,
      ccdDownloadSuccess: false,
      error: false,
      bbDownloadSuccess: false,
    },
    blueButton: {
      failedDomains: [],
    },
    refresh: {
      status: [],
    },
  },
  featureToggles: {
    [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: true,
    loading: false,
  },
  drupalStaticData: {
    vamcEhrData: {
      loading: false,
      data: {
        ehrDataByVhaId: {
          '757': {
            vhaId: '757',
            vamcFacilityName: 'Mann-Grandstaff VA Medical Center',
            vamcSystemName: 'VA Spokane health care',
            ehr: 'cerner',
          },
        },
        cernerFacilities: [
          {
            vhaId: '757',
            vamcFacilityName: 'Mann-Grandstaff VA Medical Center',
            vamcSystemName: 'VA Spokane health care',
            ehr: 'cerner',
          },
        ],
      },
    },
  },
};

// State for user with both VistA and Oracle Health facilities
const bothSourcesBaseState = {
  user: {
    profile: {
      userFullName: { first: 'Both', last: 'Sources' },
      dob: '1970-01-01',
      facilities: [
        {
          facilityId: '516',
          isCerner: false,
        },
        {
          facilityId: '757',
          isCerner: true,
        },
      ],
    },
  },
  mr: {
    downloads: {
      generatingCCD: false,
      ccdDownloadSuccess: false,
      error: false,
      bbDownloadSuccess: false,
    },
    blueButton: {
      failedDomains: [],
    },
    refresh: {
      status: [],
    },
  },
  featureToggles: {
    [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: true,
    loading: false,
  },
  drupalStaticData: {
    vamcEhrData: {
      loading: false,
      data: {
        ehrDataByVhaId: {
          '516': {
            vhaId: '516',
            vamcFacilityName: 'Test VA Medical Center',
            vamcSystemName: 'VA Test health care',
            ehr: 'vista',
          },
          '757': {
            vhaId: '757',
            vamcFacilityName: 'Mann-Grandstaff VA Medical Center',
            vamcSystemName: 'VA Spokane health care',
            ehr: 'cerner',
          },
        },
        cernerFacilities: [
          {
            vhaId: '757',
            vamcFacilityName: 'Mann-Grandstaff VA Medical Center',
            vamcSystemName: 'VA Spokane health care',
            ehr: 'cerner',
          },
        ],
      },
    },
  },
};

describe('DownloadReportPage - VistA Only User (Default)', () => {
  let screen;

  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
    // Use getAllByText since there may be multiple h1 elements from intro text and content components
    const headings = screen.getAllByText(
      'Download your medical records reports',
    );
    expect(headings.length).to.be.greaterThan(0);
  });

  it('displays Blue Button report section', () => {
    expect(screen.getByText('Download your VA Blue Button report')).to.exist;
    expect(screen.getByTestId('go-to-download-all')).to.exist;
  });

  it('displays CCD accordion', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;
  });

  it('displays self-entered accordion', () => {
    const selfEnteredAccordion = screen.getByTestId('selfEnteredAccordionItem');
    expect(selfEnteredAccordion).to.exist;
  });

  it('shows help section', () => {
    expect(screen.getByText('Need help?')).to.exist;
  });

  it('renders CCD download buttons (XML, PDF, HTML) in accordion', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    fireEvent.click(ccdAccordion);

    expect(screen.getByTestId('generateCcdButtonXml')).to.exist;
    expect(screen.getByTestId('generateCcdButtonPdf')).to.exist;
    expect(screen.getByTestId('generateCcdButtonHtml')).to.exist;
  });

  it('CCD XML button has correct text', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    fireEvent.click(ccdAccordion);

    const ccdGenerateButton = screen.getByTestId('generateCcdButtonXml');
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download XML (best for sharing with your provider)',
    );
  });

  it('CCD PDF button has correct text', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    fireEvent.click(ccdAccordion);

    const ccdGenerateButton = screen.getByTestId('generateCcdButtonPdf');
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download PDF (best for printing)',
    );
  });

  it('CCD HTML button has correct text', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    fireEvent.click(ccdAccordion);

    const ccdGenerateButton = screen.getByTestId('generateCcdButtonHtml');
    expect(ccdGenerateButton).to.have.attribute(
      'text',
      'Download HTML (best for screen readers, enlargers, and refreshable Braille displays)',
    );
  });
});

describe('DownloadReportPage - VistA Only User with generatingCCD', () => {
  it('shows loading spinner in accordion when generatingCCD is true', () => {
    const stateWithGeneratingCCD = {
      ...vistaOnlyBaseState,
      mr: {
        ...vistaOnlyBaseState.mr,
        downloads: {
          ...vistaOnlyBaseState.mr.downloads,
          generatingCCD: true,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithGeneratingCCD,
      reducers: reducer,
      path: '/download',
    });

    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    fireEvent.click(ccdAccordion);

    // Loading spinner should be inside the accordion - CCDAccordionItemV2 uses 'generating-ccd-indicator'
    expect(screen.container.querySelector('#generating-ccd-indicator')).to
      .exist;
  });
});

describe('DownloadReportPage - Oracle Health Only User', () => {
  let screen;

  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: ohOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });
  });

  it('renders without errors with singular heading', () => {
    expect(screen).to.exist;
    expect(screen.getByText('Download your medical records report')).to.exist;
  });

  it('does NOT display Blue Button section', () => {
    expect(screen.queryByText('Download your VA Blue Button report')).to.be
      .null;
    expect(screen.queryByTestId('go-to-download-all')).to.be.null;
  });

  it('displays CCD download section heading', () => {
    expect(screen.getByText('Download your Continuity of Care Document')).to
      .exist;
  });

  it('displays OH CCD download buttons (XML, PDF, HTML)', () => {
    expect(screen.getByTestId('generateCcdButtonXmlOH')).to.exist;
    expect(screen.getByTestId('generateCcdButtonPdfOH')).to.exist;
    expect(screen.getByTestId('generateCcdButtonHtmlOH')).to.exist;
  });

  it('does NOT display accordion pattern', () => {
    expect(screen.queryByTestId('ccdAccordionItem')).to.be.null;
    expect(screen.queryByTestId('selfEnteredAccordionItem')).to.be.null;
  });

  it('shows help section', () => {
    expect(screen.getByText('Need help?')).to.exist;
  });

  it('displays correct Datadog action names on download buttons', () => {
    const xmlButton = screen.getByTestId('generateCcdButtonXmlOH');
    const pdfButton = screen.getByTestId('generateCcdButtonPdfOH');
    const htmlButton = screen.getByTestId('generateCcdButtonHtmlOH');

    expect(xmlButton.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD XML OH',
    );
    expect(pdfButton.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD PDF OH',
    );
    expect(htmlButton.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD HTML OH',
    );
  });
});

describe('DownloadReportPage - Oracle Health Only with generatingCCD', () => {
  it('shows loading spinner when generatingCCD is true', () => {
    const stateWithGeneratingCCD = {
      ...ohOnlyBaseState,
      mr: {
        ...ohOnlyBaseState.mr,
        downloads: {
          ...ohOnlyBaseState.mr.downloads,
          generatingCCD: true,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithGeneratingCCD,
      reducers: reducer,
      path: '/download',
    });

    // Loading spinner should be visible for OH Only
    expect(screen.container.querySelector('#generating-ccd-OH-indicator')).to
      .exist;
  });
});

describe('DownloadReportPage - Both VistA and Oracle Health User', () => {
  let screen;

  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: bothSourcesBaseState,
      reducers: reducer,
      path: '/download',
    });
  });

  it('renders without errors with plural heading', () => {
    expect(screen).to.exist;
    // Use getAllByText since there may be multiple h1 elements from intro text and content components
    const headings = screen.getAllByText(
      'Download your medical records reports',
    );
    expect(headings.length).to.be.greaterThan(0);
  });

  it('displays Blue Button report section', () => {
    expect(screen.getByText('Download your VA Blue Button report')).to.exist;
    expect(screen.getByTestId('go-to-download-all')).to.exist;
  });

  it('displays CCD section heading', () => {
    expect(screen.getByText('Download your Continuity of Care Document')).to
      .exist;
  });

  it('displays self-entered health information section', () => {
    expect(screen.getByText('Download your self-entered health information')).to
      .exist;
    expect(screen.getByTestId('downloadSelfEnteredButton')).to.exist;
  });

  it('displays VistA facility CCD download section', () => {
    expect(screen.getByTestId('generateCcdButtonXmlVista')).to.exist;
    expect(screen.getByTestId('generateCcdButtonPdfVista')).to.exist;
    expect(screen.getByTestId('generateCcdButtonHtmlVista')).to.exist;
  });

  it('displays OH facility CCD download section', () => {
    expect(screen.getByTestId('generateCcdButtonXmlOH')).to.exist;
    expect(screen.getByTestId('generateCcdButtonPdfOH')).to.exist;
    expect(screen.getByTestId('generateCcdButtonHtmlOH')).to.exist;
  });

  it('shows help section', () => {
    expect(screen.getByText('Need help?')).to.exist;
  });
});

describe('DownloadReportPage - SEI PDF Download', () => {
  let screen;

  beforeEach(() => {
    // Mock the API to return an error, which will cause generateSEIPdf to fail
    mockApiRequest({}, false);

    screen = renderWithStoreAndRouter(<DownloadReportPage runningUnitTest />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });
  });

  it('displays SEI download button in accordion', () => {
    const seiAccordion = screen.getByTestId('selfEnteredAccordionItem');
    expect(seiAccordion).to.exist;

    fireEvent.click(seiAccordion);
    const downloadButton = screen.getByTestId('downloadSelfEnteredButton');
    expect(downloadButton).to.exist;
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

describe('DownloadReportPage - Blue Button Error Alert', () => {
  const stateWithBBError = {
    ...vistaOnlyBaseState,
    mr: {
      ...vistaOnlyBaseState.mr,
      alerts: { alertList: [{ type: ALERT_TYPE_BB_ERROR, isActive: true }] },
    },
  };

  it('displays access trouble alert for BB document', async () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithBBError,
      reducers: reducer,
      path: '/download',
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

describe('DownloadReportPage - Blue Button Success Alert', () => {
  const stateWithBBSuccess = {
    ...vistaOnlyBaseState,
    mr: {
      ...vistaOnlyBaseState.mr,
      downloads: {
        ...vistaOnlyBaseState.mr.downloads,
        bbDownloadSuccess: true,
      },
    },
  };

  it('renders the Blue Button download success alert', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithBBSuccess,
      reducers: reducer,
      path: '/download',
    });

    expect(screen.getByText('Your VA Blue Button report download has started'))
      .to.exist;
  });
});

describe('DownloadReportPage - CCD Download Success Alert', () => {
  it('renders CCD download success alert when ccdDownloadSuccess is true', () => {
    const stateWithCCDSuccess = {
      ...vistaOnlyBaseState,
      mr: {
        ...vistaOnlyBaseState.mr,
        downloads: {
          ...vistaOnlyBaseState.mr.downloads,
          ccdDownloadSuccess: true,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithCCDSuccess,
      reducers: reducer,
      path: '/download',
    });

    expect(screen.getByText('Continuity of Care Document download started')).to
      .exist;
  });
});

describe('DownloadReportPage - Extended File Types Flag', () => {
  it('does not render PDF and HTML buttons when flag is disabled for VistA users', () => {
    const stateWithFlagDisabled = {
      ...vistaOnlyBaseState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: false,
        loading: false,
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithFlagDisabled,
      reducers: reducer,
      path: '/download',
    });

    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    fireEvent.click(ccdAccordion);

    expect(screen.queryByTestId('generateCcdButtonPdf')).to.be.null;
    expect(screen.queryByTestId('generateCcdButtonHtml')).to.be.null;
    // XML should still exist
    expect(screen.getByTestId('generateCcdButtonXml')).to.exist;
  });

  it('renders PDF and HTML buttons when flag is enabled for VistA users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    fireEvent.click(ccdAccordion);

    expect(screen.getByTestId('generateCcdButtonPdf')).to.exist;
    expect(screen.getByTestId('generateCcdButtonHtml')).to.exist;
    expect(screen.getByTestId('generateCcdButtonXml')).to.exist;
  });

  it('does not render PDF and HTML buttons when flag is disabled for OH Only users', () => {
    const stateWithFlagDisabled = {
      ...ohOnlyBaseState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: false,
        loading: false,
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithFlagDisabled,
      reducers: reducer,
      path: '/download',
    });

    expect(screen.queryByTestId('generateCcdButtonPdfOH')).to.be.null;
    expect(screen.queryByTestId('generateCcdButtonHtmlOH')).to.be.null;
    // XML should still exist
    expect(screen.getByTestId('generateCcdButtonXmlOH')).to.exist;
  });

  it('does not render PDF and HTML buttons when flag is disabled for Both sources users', () => {
    const stateWithFlagDisabled = {
      ...bothSourcesBaseState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes]: false,
        loading: false,
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithFlagDisabled,
      reducers: reducer,
      path: '/download',
    });

    // Only XML download should exist, no separate VistA/OH sections
    expect(screen.getByTestId('generateCcdButtonXml')).to.exist;
    expect(screen.queryByTestId('generateCcdButtonXmlVista')).to.be.null;
    expect(screen.queryByTestId('generateCcdButtonXmlOH')).to.be.null;
  });
});

describe('DownloadReportPage - Cerner Facility Alert', () => {
  it('displays Cerner facility alert for Cerner users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: ohOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    expect(screen).to.exist;
    expect(screen.getByText('Download your medical records report')).to.exist;
    expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
  });

  it('displays correct alert text for single Cerner facility', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: ohOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    expect(
      screen.getByText(
        /To get your medical records reports from this facility/,
      ),
    ).to.exist;
    expect(screen.getByTestId('single-cerner-facility-text')).to.exist;
    expect(
      screen
        .getByTestId('single-cerner-facility-text')
        .textContent.includes('VA Spokane health care'),
    ).to.be.true;
  });

  it('displays correct alert text for multiple Cerner facilities', () => {
    const multipleCernerState = {
      ...ohOnlyBaseState,
      user: {
        profile: {
          ...ohOnlyBaseState.user.profile,
          facilities: [
            { facilityId: '757', isCerner: true },
            { facilityId: '692', isCerner: true },
          ],
        },
      },
      drupalStaticData: {
        vamcEhrData: {
          loading: false,
          data: {
            ehrDataByVhaId: {
              '757': {
                vhaId: '757',
                vamcFacilityName: 'Mann-Grandstaff VA Medical Center',
                vamcSystemName: 'VA Spokane health care',
                ehr: 'cerner',
              },
              '692': {
                vhaId: '692',
                vamcFacilityName: 'White City VA Medical Center',
                vamcSystemName: 'VA Southern Oregon health care',
                ehr: 'cerner',
              },
            },
            cernerFacilities: [
              {
                vhaId: '757',
                vamcFacilityName: 'Mann-Grandstaff VA Medical Center',
                vamcSystemName: 'VA Spokane health care',
                ehr: 'cerner',
              },
              {
                vhaId: '692',
                vamcFacilityName: 'White City VA Medical Center',
                vamcSystemName: 'VA Southern Oregon health care',
                ehr: 'cerner',
              },
            ],
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: multipleCernerState,
      reducers: reducer,
      path: '/download',
    });

    expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    expect(
      screen.getByText(
        /To get your medical records reports from these facilities/,
      ),
    ).to.exist;

    const facilityList = screen.getAllByTestId('cerner-facility');
    expect(facilityList.length).to.equal(2);
    expect(screen.getByText('VA Spokane health care')).to.exist;
    expect(screen.getByText('VA Southern Oregon health care')).to.exist;
  });

  it('includes link to My VA Health portal', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: ohOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    const link = screen.getByTestId('cerner-facility-action-link');
    expect(link).to.exist;
  });

  it('displays Info facility alert for transitioned users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: {
        ...ohOnlyBaseState,
        user: {
          profile: {
            userFullName: {
              first: 'Andrew- Cerner',
              middle: 'J',
              last: 'Morkel',
            },
            facilities: [
              {
                facilityId: '668',
                isCerner: true,
              },
            ],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: true,
          },
        },
      },
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
    expect(screen.getByTestId('cerner-facilities-info-alert')).to.exist;
  });
});

describe('DownloadReportPage - Non-Cerner Users', () => {
  it('does not display Cerner facility alert for non-Cerner users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    expect(screen).to.exist;
    // Use getAllByText since there may be multiple h1 elements from intro text and content components
    const headings = screen.getAllByText(
      'Download your medical records reports',
    );
    expect(headings.length).to.be.greaterThan(0);
    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });
});

describe('DownloadReportPage - URL Parameter Handling', () => {
  it('expands self-entered accordion when ?sei=true query param is present', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download?sei=true',
    });

    const selfEnteredAccordion = screen.getByTestId('selfEnteredAccordionItem');
    expect(selfEnteredAccordion).to.exist;
    // The accordion should be expanded based on the expandSelfEntered state
    expect(selfEnteredAccordion).to.have.attribute('open', 'true');
  });

  it('does not expand self-entered accordion when sei param is not present', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    const selfEnteredAccordion = screen.getByTestId('selfEnteredAccordionItem');
    expect(selfEnteredAccordion).to.exist;
    // Without sei=true, accordion should not be automatically expanded
    expect(selfEnteredAccordion).to.not.have.attribute('open', 'true');
  });
});

describe('DownloadReportPage - CCD Retry Timestamp', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.removeItem('lastCCDError');
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.removeItem('lastCCDError');
  });

  it('displays access trouble alert when CCD error is within 24 hours', () => {
    // Set error timestamp to now (within 24 hour window)
    const recentError = new Date().toISOString();
    localStorage.setItem('lastCCDError', recentError);

    const stateWithCCDError = {
      ...vistaOnlyBaseState,
      mr: {
        ...vistaOnlyBaseState.mr,
        downloads: {
          ...vistaOnlyBaseState.mr.downloads,
          error: true,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithCCDError,
      reducers: reducer,
      path: '/download',
    });

    expect(
      screen.getByText(
        "We can't download your Continuity of Care Document right now",
      ),
    ).to.exist;
  });

  it('does not display CCD retry alert when error is older than 24 hours', () => {
    // Set error timestamp to more than 24 hours ago
    const oldError = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    localStorage.setItem('lastCCDError', oldError);

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    expect(
      screen.queryByText(
        "We can't download your Continuity of Care Document right now",
      ),
    ).to.be.null;
  });
});

describe('DownloadReportPage - CCD Download Handlers', () => {
  it('renders CCD download button for VistA user and can be clicked', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    fireEvent.click(ccdAccordion);

    const xmlButton = screen.getByTestId('generateCcdButtonXml');
    expect(xmlButton).to.exist;

    // Click should not throw error
    fireEvent.click(xmlButton);
  });

  it('renders CCD V2 download buttons for OH user and can be clicked', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: ohOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    const xmlButton = screen.getByTestId('generateCcdButtonXmlOH');
    expect(xmlButton).to.exist;

    // Click should not throw error
    fireEvent.click(xmlButton);
  });

  it('renders both VistA and OH CCD download buttons for dual-source user', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: bothSourcesBaseState,
      reducers: reducer,
      path: '/download',
    });

    // VistA CCD buttons
    expect(screen.getByTestId('generateCcdButtonXmlVista')).to.exist;
    expect(screen.getByTestId('generateCcdButtonPdfVista')).to.exist;
    expect(screen.getByTestId('generateCcdButtonHtmlVista')).to.exist;

    // OH CCD buttons
    expect(screen.getByTestId('generateCcdButtonXmlOH')).to.exist;
    expect(screen.getByTestId('generateCcdButtonPdfOH')).to.exist;
    expect(screen.getByTestId('generateCcdButtonHtmlOH')).to.exist;
  });
});

describe('DownloadReportPage - Facility Name Mapping', () => {
  it('displays VistA facility names for dual-source user', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: bothSourcesBaseState,
      reducers: reducer,
      path: '/download',
    });

    // VistA facility name should be displayed
    expect(screen.getByText(/VA Test health care/)).to.exist;
  });

  it('displays OH facility names for dual-source user', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: bothSourcesBaseState,
      reducers: reducer,
      path: '/download',
    });

    // OH facility name should be displayed
    expect(screen.getByText(/VA Spokane health care/)).to.exist;
  });
});

describe('DownloadReportPage - Self-Entered Download', () => {
  it('renders self-entered download button in both sources view', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: bothSourcesBaseState,
      reducers: reducer,
      path: '/download',
    });

    const downloadButton = screen.getByTestId('downloadSelfEnteredButton');
    expect(downloadButton).to.exist;
  });

  it('renders self-entered accordion in VistA-only view', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });

    const selfEnteredAccordion = screen.getByTestId('selfEnteredAccordionItem');
    expect(selfEnteredAccordion).to.exist;

    fireEvent.click(selfEnteredAccordion);

    const downloadButton = screen.getByTestId('downloadSelfEnteredButton');
    expect(downloadButton).to.exist;
  });
});

describe('DownloadReportPage - Both Sources Loading States', () => {
  it('shows loading spinner for VistA CCD when generatingCCD is true', () => {
    const stateWithGeneratingCCD = {
      ...bothSourcesBaseState,
      mr: {
        ...bothSourcesBaseState.mr,
        downloads: {
          ...bothSourcesBaseState.mr.downloads,
          generatingCCD: true,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithGeneratingCCD,
      reducers: reducer,
      path: '/download',
    });

    // Loading spinner should exist for generating CCD
    expect(screen.container.querySelector('[id*="generating-ccd"]')).to.exist;
  });
});

describe('DownloadReportPage - Empty Facility Data', () => {
  it('handles missing ehrDataByVhaId gracefully', () => {
    const stateWithoutEhrData = {
      ...vistaOnlyBaseState,
      drupalStaticData: {
        vamcEhrData: {
          loading: false,
          data: {
            ehrDataByVhaId: null,
            cernerFacilities: [],
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithoutEhrData,
      reducers: reducer,
      path: '/download',
    });

    // Should still render without errors
    expect(screen).to.exist;
    const headings = screen.getAllByText(
      'Download your medical records reports',
    );
    expect(headings.length).to.be.greaterThan(0);
  });
});

describe('DownloadReportPage - CCD Success Alert for OH Users', () => {
  it('renders CCD download success alert for OH only user', () => {
    const stateWithCCDSuccess = {
      ...ohOnlyBaseState,
      mr: {
        ...ohOnlyBaseState.mr,
        downloads: {
          ...ohOnlyBaseState.mr.downloads,
          ccdDownloadSuccess: true,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithCCDSuccess,
      reducers: reducer,
      path: '/download',
    });

    expect(screen.getByText('Continuity of Care Document download started')).to
      .exist;
  });
});

describe('DownloadReportPage - CCD Success Alert for Both Sources Users', () => {
  it('renders CCD download success alert for dual-source user', () => {
    const stateWithCCDSuccess = {
      ...bothSourcesBaseState,
      mr: {
        ...bothSourcesBaseState.mr,
        downloads: {
          ...bothSourcesBaseState.mr.downloads,
          ccdDownloadSuccess: true,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithCCDSuccess,
      reducers: reducer,
      path: '/download',
    });

    expect(screen.getByText('Continuity of Care Document download started')).to
      .exist;
  });
});

describe('DownloadReportPage - Blue Button Failed Domains', () => {
  it('passes failedBBDomains to content components for VistA only user', () => {
    const stateWithFailedDomains = {
      ...vistaOnlyBaseState,
      mr: {
        ...vistaOnlyBaseState.mr,
        blueButton: {
          failedDomains: ['allergies', 'medications'],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithFailedDomains,
      reducers: reducer,
      path: '/download',
    });

    // Component should render without errors even with failed domains
    expect(screen).to.exist;
    expect(screen.getByTestId('go-to-download-all')).to.exist;
  });

  it('passes failedBBDomains to content components for dual-source user', () => {
    const stateWithFailedDomains = {
      ...bothSourcesBaseState,
      mr: {
        ...bothSourcesBaseState.mr,
        blueButton: {
          failedDomains: ['allergies', 'medications'],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithFailedDomains,
      reducers: reducer,
      path: '/download',
    });

    // Component should render without errors even with failed domains
    expect(screen).to.exist;
    expect(screen.getByTestId('go-to-download-all')).to.exist;
  });
});

describe('DownloadReportPage - Refresh Status', () => {
  it('handles refresh status for VistA user with status data', () => {
    const stateWithRefreshStatus = {
      ...vistaOnlyBaseState,
      mr: {
        ...vistaOnlyBaseState.mr,
        refresh: {
          status: [
            {
              extract: 'Allergy',
              lastRequested: '2024-01-01T12:00:00Z',
              lastCompleted: '2024-01-01T12:05:00Z',
              lastSuccessfulCompleted: '2024-01-01T12:05:00Z',
            },
          ],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: stateWithRefreshStatus,
      reducers: reducer,
      path: '/download',
    });

    expect(screen).to.exist;
    expect(screen.getByTestId('ccdAccordionItem')).to.exist;
  });
});

