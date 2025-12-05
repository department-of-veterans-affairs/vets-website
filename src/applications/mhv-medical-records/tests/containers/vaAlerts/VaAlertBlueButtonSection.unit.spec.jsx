import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import VaAlertBlueButtonDualUserSection from '../../../containers/vaAlerts/VaAlertBlueButtonSection';
import { ALERT_TYPE_BB_ERROR } from '../../../util/constants';
import * as helpers from '../../../util/helpers';

describe('VaAlertBlueButtonDualUserSection', () => {
  let sandbox;

  const defaultProps = {
    hasBothDataSources: false,
    vistaFacilityNames: [],
    ohFacilityNames: [],
    activeAlert: null,
    successfulBBDownload: false,
    failedBBDomains: [],
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the Blue Button section heading', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <VaAlertBlueButtonDualUserSection {...defaultProps} />
      </MemoryRouter>,
    );

    expect(
      getByRole('heading', { name: /Download your VA Blue Button report/i }),
    ).to.exist;
  });

  it('renders the explanatory paragraph about selecting records', () => {
    const { getByText } = render(
      <MemoryRouter>
        <VaAlertBlueButtonDualUserSection {...defaultProps} />
      </MemoryRouter>,
    );

    expect(
      getByText(
        /First, select the types of records you want in your report. Then download./i,
      ),
    ).to.exist;
  });

  it('renders the download link with correct href and attributes', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <VaAlertBlueButtonDualUserSection {...defaultProps} />
      </MemoryRouter>,
    );

    const downloadLink = getByTestId('go-to-download-all');
    expect(downloadLink).to.exist;
    expect(downloadLink).to.have.attribute(
      'href',
      '/my-health/medical-records/download/date-range',
    );
    expect(downloadLink).to.have.attribute(
      'label',
      'Select records and download report',
    );
    expect(downloadLink).to.have.attribute(
      'data-dd-action-name',
      'Select records and download',
    );
  });

  it('fires sendDataDogAction when download link is clicked', () => {
    const actionStub = sandbox.stub(helpers, 'sendDataDogAction');
    const { getByTestId } = render(
      <MemoryRouter>
        <VaAlertBlueButtonDualUserSection {...defaultProps} />
      </MemoryRouter>,
    );

    const downloadLink = getByTestId('go-to-download-all');
    fireEvent.click(downloadLink);

    expect(actionStub.calledOnce).to.be.true;
    expect(actionStub.firstCall.args[0]).to.equal(
      'Select records and download',
    );
  });

  describe('dual facilities alert', () => {
    it('renders dual facilities info alert when user has both data sources', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: true,
        vistaFacilityNames: ['VA Western New York health care'],
        ohFacilityNames: ['VA Central Ohio health care'],
      };
      const { getByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      const alert = getByTestId('dual-facilities-blue-button-message');
      expect(alert).to.exist;
      expect(alert).to.have.attribute('status', 'info');
    });

    it('displays VistA facility names in the alert message', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: true,
        vistaFacilityNames: [
          'VA Western New York health care',
          'VA Pacific Islands health care',
        ],
        ohFacilityNames: ['VA Central Ohio health care'],
      };
      const { getByText } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(
        getByText(
          /For VA Western New York health care, VA Pacific Islands health care, you can download your data in a Blue Button report./i,
        ),
      ).to.exist;
    });

    it('displays Oracle Health facility names in the alert message', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: true,
        vistaFacilityNames: ['VA Western New York health care'],
        ohFacilityNames: [
          'VA Central Ohio health care',
          'VA Southern Nevada health care',
        ],
      };
      const { getByText } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(
        getByText(
          /Data for VA Central Ohio health care, VA Southern Nevada health care is not yet available in Blue Button./i,
        ),
      ).to.exist;
    });

    it('provides guidance to use CCD for Oracle Health facilities', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: true,
        vistaFacilityNames: ['VA Western New York health care'],
        ohFacilityNames: ['VA Central Ohio health care'],
      };
      const { getByText } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(
        getByText(
          /You can access records for those by downloading a Continuity of Care Document, which is shown above./i,
        ),
      ).to.exist;
    });

    it('does not render dual facilities alert when hasBothDataSources is false', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: false,
        vistaFacilityNames: ['VA Western New York health care'],
        ohFacilityNames: [],
      };
      const { queryByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(queryByTestId('dual-facilities-blue-button-message')).to.not.exist;
    });

    it('does not render dual facilities alert when VistA facilities list is empty', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: true,
        vistaFacilityNames: [],
        ohFacilityNames: ['VA Central Ohio health care'],
      };
      const { queryByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(queryByTestId('dual-facilities-blue-button-message')).to.not.exist;
    });

    it('does not render dual facilities alert when OH facilities list is empty', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: true,
        vistaFacilityNames: ['VA Western New York health care'],
        ohFacilityNames: [],
      };
      const { queryByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(queryByTestId('dual-facilities-blue-button-message')).to.not.exist;
    });
  });

  describe('error alert', () => {
    it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_BB_ERROR', () => {
      const props = {
        ...defaultProps,
        activeAlert: { type: ALERT_TYPE_BB_ERROR },
      };
      const { getByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(getByTestId('expired-alert-message')).to.exist;
    });

    it('does not render AccessTroubleAlertBox when activeAlert is null', () => {
      const props = {
        ...defaultProps,
        activeAlert: null,
      };
      const { queryByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(queryByTestId('expired-alert-message')).to.not.exist;
    });

    it('does not render AccessTroubleAlertBox when activeAlert has different type', () => {
      const props = {
        ...defaultProps,
        activeAlert: { type: 'some-other-error' },
      };
      const { queryByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(queryByTestId('expired-alert-message')).to.not.exist;
    });
  });

  describe('success alert and missing records', () => {
    it('renders DownloadSuccessAlert when successfulBBDownload is true', () => {
      const props = {
        ...defaultProps,
        successfulBBDownload: true,
        failedBBDomains: [],
      };
      const { getByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(getByTestId('alert-download-started')).to.exist;
    });

    it('displays correct success message type', () => {
      const props = {
        ...defaultProps,
        successfulBBDownload: true,
        failedBBDomains: [],
      };
      const { getByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(
        getByTestId('download-success-alert-message').textContent,
      ).to.equal('Your VA Blue Button report download has started');
    });

    it('does not render DownloadSuccessAlert when successfulBBDownload is false', () => {
      const props = {
        ...defaultProps,
        successfulBBDownload: false,
        failedBBDomains: [],
      };
      const { queryByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(queryByTestId('alert-download-started')).to.not.exist;
    });

    it('renders MissingRecordsError when successfulBBDownload is true with failed domains', () => {
      const props = {
        ...defaultProps,
        successfulBBDownload: true,
        failedBBDomains: ['labsAndTests', 'vaccines'],
      };
      const { container } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      // MissingRecordsError component should be rendered
      const alertContainer = container.querySelector('va-alert');
      expect(alertContainer).to.exist;
    });

    it('passes correct documentType to MissingRecordsError', () => {
      const props = {
        ...defaultProps,
        successfulBBDownload: true,
        failedBBDomains: ['allergies'],
      };
      const { getByTestId } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      // The MissingRecordsError component should be rendered with correct testid
      const missingRecordsAlert = getByTestId('missing-records-error-alert');
      expect(missingRecordsAlert).to.exist;
      // Check that it includes the text about VA Blue Button report
      expect(missingRecordsAlert.textContent).to.include(
        'VA Blue Button report',
      );
    });
  });

  describe('component renders without crashing with various prop combinations', () => {
    it('renders with empty arrays', () => {
      const { container } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...defaultProps} />
        </MemoryRouter>,
      );

      expect(container).to.exist;
    });

    it('renders with all features enabled', () => {
      const props = {
        hasBothDataSources: true,
        vistaFacilityNames: ['VA Facility 1', 'VA Facility 2'],
        ohFacilityNames: ['OH Facility 1'],
        activeAlert: { type: ALERT_TYPE_BB_ERROR },
        successfulBBDownload: true,
        failedBBDomains: ['labsAndTests'],
      };
      const { container } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(container).to.exist;
    });

    it('renders with single VistA facility', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: true,
        vistaFacilityNames: ['VA Single Facility'],
        ohFacilityNames: ['OH Facility'],
      };
      const { getByText } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(
        getByText(
          /For VA Single Facility, you can download your data in a Blue Button report./i,
        ),
      ).to.exist;
    });

    it('renders with multiple OH facilities', () => {
      const props = {
        ...defaultProps,
        hasBothDataSources: true,
        vistaFacilityNames: ['VA Facility'],
        ohFacilityNames: ['OH Facility 1', 'OH Facility 2', 'OH Facility 3'],
      };
      const { getByText } = render(
        <MemoryRouter>
          <VaAlertBlueButtonDualUserSection {...props} />
        </MemoryRouter>,
      );

      expect(
        getByText(
          /Data for OH Facility 1, OH Facility 2, OH Facility 3 is not yet available in Blue Button./i,
        ),
      ).to.exist;
    });
  });
});
