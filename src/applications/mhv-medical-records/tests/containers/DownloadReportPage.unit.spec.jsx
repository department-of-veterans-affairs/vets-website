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
  let generateSEIPdfStub;

  beforeEach(() => {
    generateSEIPdfStub = sinon
      .stub(exports, 'generateSEIPdf')
      .rejects(new Error('SEI PDF generation failed'));

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

  afterEach(() => {
    generateSEIPdfStub.restore();
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

describe('DownloadRecordsPage for Cerner users', () => {
  const cernerUserState = {
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
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '668': {
              vhaId: '668',
              vamcFacilityName:
                'Mann-Grandstaff Department of Veterans Affairs Medical Center',
              vamcSystemName: 'VA Spokane health care',
              ehr: 'cerner',
            },
          },
          cernerFacilities: [
            {
              vhaId: '668',
              vamcFacilityName:
                'Mann-Grandstaff Department of Veterans Affairs Medical Center',
              vamcSystemName: 'VA Spokane health care',
              ehr: 'cerner',
            },
          ],
        },
        loading: false,
      },
    },
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
      loading: false,
    },
  };

  const multipleCernerFacilitiesState = {
    ...cernerUserState,
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
          {
            facilityId: '692',
            isCerner: true,
          },
        ],
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '668': {
              vhaId: '668',
              vamcFacilityName:
                'Mann-Grandstaff Department of Veterans Affairs Medical Center',
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
              vhaId: '668',
              vamcFacilityName:
                'Mann-Grandstaff Department of Veterans Affairs Medical Center',
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
        loading: false,
      },
    },
  };

  it('displays Cerner facility alert for Cerner users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: cernerUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
    expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
  });

  it('displays correct alert text for single Cerner facility', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: cernerUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    expect(
      screen.getByText(
        'To get your medical records reports from this facility, go to My VA Health',
      ),
    ).to.exist;
    // Facility name appears in alert text (within data-testid="single-cerner-facility-text")
    expect(screen.getByTestId('single-cerner-facility-text')).to.exist;
    expect(
      screen
        .getByTestId('single-cerner-facility-text')
        .textContent.includes('VA Spokane health care'),
    ).to.be.true;
  });

  it('displays correct alert text for multiple Cerner facilities', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: multipleCernerFacilitiesState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    expect(
      screen.getByText(
        'To get your medical records reports from these facilities, go to My VA Health',
      ),
    ).to.exist;

    // Should show both facilities in a list
    const facilityList = screen.getAllByTestId('cerner-facility');
    expect(facilityList.length).to.equal(2);
    expect(screen.getByText('VA Spokane health care')).to.exist;
    expect(screen.getByText('VA Southern Oregon health care')).to.exist;
  });

  it('includes link to My VA Health portal', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: cernerUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    const link = screen.getByRole('link', { name: /Go to My VA Health/i });
    expect(link).to.exist;
  });
});

describe('DownloadRecordsPage for non-Cerner users', () => {
  const nonCernerUserState = {
    user: {
      profile: {
        userFullName: {
          first: 'Jane',
          middle: 'M',
          last: 'Doe',
        },
        facilities: [
          {
            facilityId: '516',
            isCerner: false,
          },
        ],
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '516': {
              vhaId: '516',
              vamcFacilityName:
                'C.W. Bill Young Department of Veterans Affairs Medical Center',
              vamcSystemName: 'VA Bay Pines health care',
              ehr: 'vista',
            },
          },
          cernerFacilities: [],
        },
        loading: false,
      },
    },
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
      loading: false,
    },
  };

  it('does not display Cerner facility alert for non-Cerner users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: nonCernerUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it('displays Blue Button section for VistA-only users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: nonCernerUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen.getByText('Download your VA Blue Button report')).to.exist;
    expect(screen.getByTestId('go-to-download-all')).to.exist;
    expect(screen.queryByTestId('dual-facilities-blue-button-message')).to.not
      .exist;
  });
});

describe('DownloadRecordsPage Blue Button section for Oracle Health-only users', () => {
  const oracleHealthOnlyUserState = {
    user: {
      profile: {
        userFullName: {
          first: 'Oracle',
          middle: 'H',
          last: 'User',
        },
        facilities: [
          {
            facilityId: '668',
            isCerner: true,
          },
        ],
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '668': {
              vhaId: '668',
              vamcFacilityName:
                'Mann-Grandstaff Department of Veterans Affairs Medical Center',
              vamcSystemName: 'VA Spokane health care',
              ehr: 'cerner',
            },
          },
          cernerFacilities: [
            {
              vhaId: '668',
              vamcFacilityName:
                'Mann-Grandstaff Department of Veterans Affairs Medical Center',
              vamcSystemName: 'VA Spokane health care',
              ehr: 'cerner',
            },
          ],
        },
        loading: false,
      },
    },
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
      loading: false,
    },
  };

  it('does not display Blue Button section for Oracle Health-only users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: oracleHealthOnlyUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen.queryByText('Download your VA Blue Button report')).to.not
      .exist;
    expect(screen.queryByTestId('go-to-download-all')).to.not.exist;
  });

  it('displays Other reports section for Oracle Health-only users', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: oracleHealthOnlyUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen.getByText('Other reports you can download')).to.exist;
    expect(screen.getByTestId('selfEnteredAccordionItem')).to.exist;
  });
});

describe('DownloadRecordsPage Blue Button section for users with both facility types', () => {
  const dualFacilitiesUserState = {
    user: {
      profile: {
        userFullName: {
          first: 'Dual',
          middle: 'F',
          last: 'User',
        },
        facilities: [
          {
            facilityId: '668',
            isCerner: true,
          },
          {
            facilityId: '516',
            isCerner: false,
          },
        ],
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '668': {
              vhaId: '668',
              vamcFacilityName:
                'Mann-Grandstaff Department of Veterans Affairs Medical Center',
              vamcSystemName: 'VA Spokane health care',
              ehr: 'cerner',
            },
            '516': {
              vhaId: '516',
              vamcFacilityName:
                'C.W. Bill Young Department of Veterans Affairs Medical Center',
              vamcSystemName: 'VA Bay Pines health care',
              ehr: 'vista',
            },
          },
          cernerFacilities: [
            {
              vhaId: '668',
              vamcFacilityName:
                'Mann-Grandstaff Department of Veterans Affairs Medical Center',
              vamcSystemName: 'VA Spokane health care',
              ehr: 'cerner',
            },
          ],
        },
        loading: false,
      },
    },
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
      loading: false,
    },
  };

  it('displays Blue Button section for users with both facility types', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: dualFacilitiesUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen.getByText('Download your VA Blue Button report')).to.exist;
    expect(screen.getByTestId('go-to-download-all')).to.exist;
  });

  it('displays explanatory message for users with both facility types', () => {
    const screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState: dualFacilitiesUserState,
      reducers: reducer,
      path: '/download-all',
    });

    expect(screen.getByTestId('dual-facilities-blue-button-message')).to.exist;
    expect(
      screen.getByText(
        /For VA Bay Pines health care, you can download your data in a Blue Button report./,
      ),
    ).to.exist;
    expect(
      screen.getByText(
        /Data for VA Spokane health care is not yet available in Blue Button./,
      ),
    ).to.exist;
    expect(
      screen.getByText(
        /You can access records for those by downloading a Continuity of Care Document, which is shown above./,
      ),
    ).to.exist;
  });
});
