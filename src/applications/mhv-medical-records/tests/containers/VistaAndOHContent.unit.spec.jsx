import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import {
  ALERT_TYPE_SEI_ERROR,
  SEI_DOMAINS,
} from '@department-of-veterans-affairs/mhv/exports';
import VistaAndOHContent from '../../containers/ccdContent/VistaAndOHContent';
import {
  ALERT_TYPE_BB_ERROR,
  ALERT_TYPE_CCD_ERROR,
} from '../../util/constants';
import reducer from '../../reducers';

describe('VistaAndOHContent', () => {
  const initialState = {
    featureToggles: {
      loading: false,
    },
    drupalStaticData: {
      vamcEhrData: {
        loading: false,
      },
    },
    user: {
      profile: {
        facilities: [],
      },
    },
  };

  const defaultProps = {
    accessErrors: () => null,
    activeAlert: null,
    ccdError: false,
    CCDRetryTimestamp: null,
    isLoading: false,
    testIdSuffix: 'Vista',
    ohFacilityNames: ['VA Central Ohio health care'],
    ccdDownloadSuccess: false,
    failedBBDomains: [],
    failedSeiDomains: [],
    getFailedDomainList: () => [],
    generatingCCD: false,
    handleDownloadCCD: () => {},
    handleDownloadSelfEnteredPdf: () => {},
    lastSuccessfulUpdate: null,
    successfulSeiDownload: false,
    successfulBBDownload: false,
    vistaFacilityNames: [
      'VA Western New York health care',
      'VA Pacific Islands health care',
    ],
  };

  const renderComponent = (props = {}, state = {}) => {
    return renderWithStoreAndRouter(
      <VistaAndOHContent {...defaultProps} {...props} />,
      {
        initialState: { ...initialState, ...state },
        reducers: reducer,
        path: '/download',
      },
    );
  };

  it('renders without errors', () => {
    const { getByText } = renderComponent();
    expect(getByText('Download your medical records reports')).to.exist;
  });

  it('renders the main heading and description when not loading', () => {
    const { getByText } = renderComponent();

    expect(getByText('Download your medical records reports')).to.exist;
    expect(
      getByText(/You can download your VA medical records as a single report/),
    ).to.exist;
    expect(getByText('Download your VA Blue Button report')).to.exist;
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container, queryByText } = renderComponent({ isLoading: true });

    const spinnerContainer = container.querySelector(
      '#generating-ccd-Vista-indicator',
    );
    expect(spinnerContainer).to.exist;
    expect(spinnerContainer.querySelector('va-loading-indicator')).to.exist;

    expect(queryByText('Download your medical records reports')).to.not.exist;
  });

  it('renders VistA facility names list', () => {
    const { getByText } = renderComponent();

    expect(getByText('VA Western New York health care')).to.exist;
    expect(getByText('VA Pacific Islands health care')).to.exist;
  });

  it('renders OH facility names list', () => {
    const { getByText } = renderComponent();

    expect(getByText('VA Central Ohio health care')).to.exist;
  });

  it('renders last successful update card when lastSuccessfulUpdate is provided', () => {
    const { getByTestId, getByText } = renderComponent({
      lastSuccessfulUpdate: { date: 'December 9, 2025', time: '10:30 AM ET' },
    });

    expect(getByTestId('new-records-last-updated')).to.exist;
    expect(getByText(/Records in these reports last updated at/)).to.exist;
    expect(getByText(/10:30 AM ET/)).to.exist;
    expect(getByText(/December 9, 2025/)).to.exist;
  });

  it('does not render last successful update card when lastSuccessfulUpdate is null', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('new-records-last-updated')).to.not.exist;
  });

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_BB_ERROR', () => {
    const { getByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_BB_ERROR },
    });

    expect(getByTestId('expired-alert-message')).to.exist;
  });

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_CCD_ERROR', () => {
    const { getAllByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_CCD_ERROR },
    });

    expect(getAllByTestId('expired-alert-message').length).to.be.greaterThan(0);
  });

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_SEI_ERROR', () => {
    const { getAllByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_SEI_ERROR },
    });

    expect(getAllByTestId('expired-alert-message').length).to.be.greaterThan(0);
  });

  it('does not render error alerts when activeAlert is null', () => {
    const { queryAllByTestId } = renderComponent();
    expect(queryAllByTestId('expired-alert-message').length).to.equal(0);
  });

  it('calls accessErrors function', () => {
    const accessErrors = sinon.spy(() => (
      <div data-testid="custom-access-error">Custom Error</div>
    ));
    const { getByTestId } = renderComponent({ accessErrors });

    expect(accessErrors.called).to.be.true;
    expect(getByTestId('custom-access-error')).to.exist;
  });

  it('renders Blue Button download link', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('go-to-download-all')).to.exist;
    expect(getByTestId('go-to-download-all')).to.have.attribute(
      'href',
      '/my-health/medical-records/download/date-range',
    );
  });

  it('renders DownloadSuccessAlert when successfulBBDownload is true', () => {
    const { getByTestId, getByText } = renderComponent({
      successfulBBDownload: true,
    });

    expect(getByTestId('alert-download-started')).to.exist;
    expect(getByText(/Your VA Blue Button report download has/)).to.exist;
  });

  it('does not render BB success alert when successfulBBDownload is false', () => {
    const { queryByText } = renderComponent({
      successfulBBDownload: false,
    });

    expect(queryByText(/Your VA Blue Button report download has/)).to.not.exist;
  });

  it('renders MissingRecordsError and DownloadSuccessAlert when SEI download is successful with some failed domains', () => {
    const { getByText } = renderComponent({
      successfulSeiDownload: true,
      failedSeiDomains: ['allergies', 'medications'],
    });

    expect(getByText(/Self-entered health information report download/)).to
      .exist;
  });

  it('does not render SEI alerts when all SEI domains failed', () => {
    const { queryByText } = renderComponent({
      successfulSeiDownload: true,
      failedSeiDomains: SEI_DOMAINS,
    });

    expect(queryByText(/Self-entered health information report download/)).to
      .not.exist;
  });

  it('does not render SEI alerts when successfulSeiDownload is false', () => {
    const { queryByText } = renderComponent({
      successfulSeiDownload: false,
      failedSeiDomains: ['allergies'],
    });

    expect(queryByText(/Self-entered health information report download/)).to
      .not.exist;
  });

  it('renders self-entered download button', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('downloadSelfEnteredButton')).to.exist;
  });

  it('calls handleDownloadSelfEnteredPdf when self-entered download button is clicked', () => {
    const handleDownloadSelfEnteredPdf = sinon.spy();
    const { getByTestId } = renderComponent({ handleDownloadSelfEnteredPdf });

    fireEvent.click(getByTestId('downloadSelfEnteredButton'));
    expect(handleDownloadSelfEnteredPdf.calledOnce).to.be.true;
  });

  it('renders CCD download success alert when generatingCCD is true and no error', () => {
    const { getByText } = renderComponent({
      generatingCCD: true,
      ccdError: false,
      CCDRetryTimestamp: null,
    });

    expect(getByText(/Continuity of Care Document download/)).to.exist;
  });

  it('renders CCD download success alert when ccdDownloadSuccess is true and no error', () => {
    const { getByText } = renderComponent({
      ccdDownloadSuccess: true,
      ccdError: false,
      CCDRetryTimestamp: null,
    });

    expect(getByText(/Continuity of Care Document download/)).to.exist;
  });

  it('does not render CCD success alert when ccdError is true', () => {
    const { queryByText } = renderComponent({
      generatingCCD: true,
      ccdError: true,
    });

    expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
  });

  it('does not render CCD success alert when CCDRetryTimestamp is set', () => {
    const { queryByText } = renderComponent({
      generatingCCD: true,
      ccdError: false,
      CCDRetryTimestamp: '2025-12-09T10:30:00Z',
    });

    expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
  });

  it('renders Blue Button note at the bottom', () => {
    const { getByText } = renderComponent();

    expect(
      getByText(
        /Blue Button and the Blue Button logo are registered service marks/,
      ),
    ).to.exist;
  });

  it('renders CCD section heading and description', () => {
    const { getByText } = renderComponent();

    expect(getByText('Download your Continuity of Care Document')).to.exist;
    expect(
      getByText(
        /This Continuity of Care Document \(CCD\) is a summary of your VA medical records/,
      ),
    ).to.exist;
  });

  it('renders self-entered section heading and description', () => {
    const { getByText } = renderComponent();

    expect(getByText('Download your self-entered health information')).to.exist;
    expect(
      getByText(
        /This report includes all the health information you entered yourself/,
      ),
    ).to.exist;
  });

  it('uses the correct testIdSuffix in loading indicator', () => {
    const { container } = renderComponent({
      isLoading: true,
      testIdSuffix: 'CustomSuffix',
    });

    const spinnerContainer = container.querySelector(
      '#generating-ccd-CustomSuffix-indicator',
    );
    expect(spinnerContainer).to.exist;
  });

  it('calls getFailedDomainList when successfulBBDownload is true', () => {
    const getFailedDomainList = sinon.spy(() => ['allergies']);
    renderComponent({
      successfulBBDownload: true,
      failedBBDomains: ['allergies'],
      getFailedDomainList,
    });

    expect(getFailedDomainList.called).to.be.true;
  });

  it('renders CCD DownloadSection component', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('generateCcdButtonXmlVista')).to.exist;
    expect(getByTestId('generateCcdButtonPdfVista')).to.exist;
    expect(getByTestId('generateCcdButtonHtmlVista')).to.exist;
  });

  it('calls handleDownloadCCD with correct format when CCD link is clicked', () => {
    const handleDownloadCCD = sinon.spy();
    const { getByTestId } = renderComponent({ handleDownloadCCD });

    fireEvent.click(getByTestId('generateCcdButtonXmlVista'));
    expect(handleDownloadCCD.calledOnce).to.be.true;
    expect(handleDownloadCCD.firstCall.args[1]).to.equal('xml');
  });

  it('renders explanatory text about facility availability', () => {
    const { getByText } = renderComponent();

    expect(
      getByText(
        /VA medical records for these facilities aren.t available in your Blue Button report right now/,
      ),
    ).to.exist;
  });
});
