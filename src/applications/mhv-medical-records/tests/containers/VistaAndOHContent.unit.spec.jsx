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
    ccdExtendedFileTypeFlag: true,
    ccdDownloadSuccess: false,
    failedBBDomains: [],
    failedSeiDomains: [],
    getFailedDomainList: () => [],
    generatingCCD: false,
    handleDownloadCCD: () => {},
    handleDownloadCCDV2: () => {},
    handleDownloadSelfEnteredPdf: () => {},
    lastSuccessfulUpdate: null,
    selfEnteredPdfLoading: false,
    successfulSeiDownload: false,
    successfulBBDownload: false,
    vistaFacilityNames: ['VA Western New York health care'],
    ohFacilityNames: ['VA Central Ohio health care'],
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
    expect(getByText('Download your VA Blue Button report')).to.exist;
  });

  it('renders the Blue Button section heading', () => {
    const { getByText } = renderComponent();

    expect(getByText('Download your VA Blue Button report')).to.exist;
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

  it('renders Blue Button instructions text', () => {
    const { getByText } = renderComponent();

    expect(
      getByText(
        /First, select the types of records you want in your report. Then download./,
      ),
    ).to.exist;
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

  describe('Self-entered health information section', () => {
    it('renders self-entered section heading and description', () => {
      const { getByText } = renderComponent();

      expect(getByText('Download your self-entered health information')).to
        .exist;
      expect(
        getByText(
          /This report includes all the health information you entered yourself/,
        ),
      ).to.exist;
    });

    it('renders self-entered download button when not loading', () => {
      const { getByTestId } = renderComponent({
        selfEnteredPdfLoading: false,
      });

      expect(getByTestId('downloadSelfEnteredButton')).to.exist;
    });

    it('shows self-entered loading spinner when selfEnteredPdfLoading is true', () => {
      const { container, queryByTestId } = renderComponent({
        selfEnteredPdfLoading: true,
      });

      const spinnerContainer = container.querySelector(
        '#generating-sei-indicator',
      );
      expect(spinnerContainer).to.exist;
      expect(spinnerContainer.querySelector('va-loading-indicator')).to.exist;

      expect(queryByTestId('downloadSelfEnteredButton')).to.not.exist;
    });

    it('calls handleDownloadSelfEnteredPdf when self-entered download button is clicked', () => {
      const handleDownloadSelfEnteredPdf = sinon.spy();
      const { getByTestId } = renderComponent({ handleDownloadSelfEnteredPdf });

      fireEvent.click(getByTestId('downloadSelfEnteredButton'));
      expect(handleDownloadSelfEnteredPdf.calledOnce).to.be.true;
    });
  });

  describe('CCD Download Success Alert', () => {
    it('does not render CCD download success alert when only generatingCCD is true, but shows spinner', () => {
      const { queryByText, getByTestId } = renderComponent({
        generatingCCD: true,
        ccdDownloadSuccess: false,
        ccdError: false,
        CCDRetryTimestamp: null,
      });

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
      expect(getByTestId('generating-ccd-Vista-indicator')).to.exist;
      expect(getByTestId('generating-ccd-OH-indicator')).to.exist;
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

    it('does not render CCD success alert when both generatingCCD and ccdDownloadSuccess are false', () => {
      const { queryByText } = renderComponent({
        generatingCCD: false,
        ccdDownloadSuccess: false,
        ccdError: false,
        CCDRetryTimestamp: null,
      });

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
    });
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

  it('calls getFailedDomainList when successfulBBDownload is true', () => {
    const getFailedDomainList = sinon.spy(() => ['allergies']);
    renderComponent({
      successfulBBDownload: true,
      failedBBDomains: ['allergies'],
      getFailedDomainList,
    });

    expect(getFailedDomainList.called).to.be.true;
  });

  describe('when ccdExtendedFileTypeFlag is true', () => {
    it('renders VistA facility CCD download section', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
      });

      expect(getByTestId('generateCcdButtonXmlVista')).to.exist;
      expect(getByTestId('generateCcdButtonPdfVista')).to.exist;
      expect(getByTestId('generateCcdButtonHtmlVista')).to.exist;
    });

    it('renders OH facility CCD download section', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
      });

      expect(getByTestId('generateCcdButtonXmlOH')).to.exist;
      expect(getByTestId('generateCcdButtonPdfOH')).to.exist;
      expect(getByTestId('generateCcdButtonHtmlOH')).to.exist;
    });

    it('displays VistA facility names', () => {
      const { getByText } = renderComponent({
        ccdExtendedFileTypeFlag: true,
        vistaFacilityNames: ['VA Western New York health care'],
      });

      expect(
        getByText(/CCD: medical records from VA Western New York health care/),
      ).to.exist;
    });

    it('displays OH facility names', () => {
      const { getByText } = renderComponent({
        ccdExtendedFileTypeFlag: true,
        ohFacilityNames: ['VA Central Ohio health care'],
      });

      expect(getByText(/CCD: medical records from VA Central Ohio health care/))
        .to.exist;
    });

    it('calls handleDownloadCCD with correct format when VistA XML link is clicked', () => {
      const handleDownloadCCD = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCD,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonXmlVista'));
      expect(handleDownloadCCD.calledOnce).to.be.true;
      expect(handleDownloadCCD.firstCall.args[1]).to.equal('xml');
    });

    it('calls handleDownloadCCD with correct format when VistA PDF link is clicked', () => {
      const handleDownloadCCD = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCD,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonPdfVista'));
      expect(handleDownloadCCD.calledOnce).to.be.true;
      expect(handleDownloadCCD.firstCall.args[1]).to.equal('pdf');
    });

    it('calls handleDownloadCCD with correct format when VistA HTML link is clicked', () => {
      const handleDownloadCCD = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCD,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonHtmlVista'));
      expect(handleDownloadCCD.calledOnce).to.be.true;
      expect(handleDownloadCCD.firstCall.args[1]).to.equal('html');
    });

    it('calls handleDownloadCCDV2 with correct format when OH XML link is clicked', () => {
      const handleDownloadCCDV2 = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCDV2,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonXmlOH'));
      expect(handleDownloadCCDV2.calledOnce).to.be.true;
      expect(handleDownloadCCDV2.firstCall.args[1]).to.equal('xml');
    });

    it('calls handleDownloadCCDV2 with correct format when OH PDF link is clicked', () => {
      const handleDownloadCCDV2 = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCDV2,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonPdfOH'));
      expect(handleDownloadCCDV2.calledOnce).to.be.true;
      expect(handleDownloadCCDV2.firstCall.args[1]).to.equal('pdf');
    });

    it('calls handleDownloadCCDV2 with correct format when OH HTML link is clicked', () => {
      const handleDownloadCCDV2 = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCDV2,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonHtmlOH'));
      expect(handleDownloadCCDV2.calledOnce).to.be.true;
      expect(handleDownloadCCDV2.firstCall.args[1]).to.equal('html');
    });
  });

  describe('when ccdExtendedFileTypeFlag is false', () => {
    it('renders only XML download link', () => {
      const { getByTestId, queryByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: false,
      });

      expect(getByTestId('generateCcdButtonXml')).to.exist;
      expect(queryByTestId('generateCcdButtonPdfVista')).to.not.exist;
      expect(queryByTestId('generateCcdButtonHtmlVista')).to.not.exist;
      expect(queryByTestId('generateCcdButtonXmlOH')).to.not.exist;
    });

    it('renders XML download link with correct text', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: false,
      });

      expect(getByTestId('generateCcdButtonXml')).to.have.attribute(
        'text',
        'Download Continuity of Care Document (XML)',
      );
    });

    it('calls handleDownloadCCD with xml format when XML link is clicked', () => {
      const handleDownloadCCD = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCD,
        ccdExtendedFileTypeFlag: false,
      });

      fireEvent.click(getByTestId('generateCcdButtonXml'));
      expect(handleDownloadCCD.calledOnce).to.be.true;
      expect(handleDownloadCCD.firstCall.args[1]).to.equal('xml');
    });

    it('shows loading spinner when generatingCCD is true', () => {
      const { getByTestId, queryByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: false,
        generatingCCD: true,
      });

      expect(getByTestId('generating-ccd-indicator')).to.exist;

      expect(queryByTestId('generateCcdButtonXml')).to.not.exist;
    });

    it('does not show loading spinner when generatingCCD is false', () => {
      const { queryByTestId, getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: false,
        generatingCCD: false,
      });

      expect(queryByTestId('generating-ccd-indicator')).to.not.exist;
      expect(getByTestId('generateCcdButtonXml')).to.exist;
    });
  });

  it('does not render h1 heading (heading is in parent/intro component)', () => {
    const { container } = renderComponent();

    const h1 = container.querySelector('h1');
    expect(h1).to.not.exist;
  });

  it('renders h2 headings for each section', () => {
    const { container } = renderComponent();

    const h2s = container.querySelectorAll('h2');
    expect(h2s.length).to.equal(3);
    expect(h2s[0].textContent).to.equal('Download your VA Blue Button report');
    expect(h2s[1].textContent).to.equal(
      'Download your Continuity of Care Document',
    );
    expect(h2s[2].textContent).to.equal(
      'Download your self-entered health information',
    );
  });
});
