import { expect } from 'chai';
import React from 'react';
import { waitFor } from '@testing-library/react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach, describe, it } from 'mocha';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
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
  let generateSEIPdfStub;

  beforeEach(() => {
    generateSEIPdfStub = sinon
      .stub(exports, 'generateSEIPdf')
      .rejects(new Error('SEI PDF generation failed'));

    screen = renderWithStoreAndRouter(<DownloadReportPage runningUnitTest />, {
      initialState: vistaOnlyBaseState,
      reducers: reducer,
      path: '/download',
    });
  });

  afterEach(() => {
    if (generateSEIPdfStub?.restore) {
      generateSEIPdfStub.restore();
    }
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
        'To get your medical records reports from this facility, go to My VA Health',
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
        'To get your medical records reports from these facilities, go to My VA Health',
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
    const link = screen.getByRole('link', { name: /Go to My VA Health/i });
    expect(link).to.exist;
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
