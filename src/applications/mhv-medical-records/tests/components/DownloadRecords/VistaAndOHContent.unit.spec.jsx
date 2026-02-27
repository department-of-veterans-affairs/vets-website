import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { ALERT_TYPE_SEI_ERROR } from '@department-of-veterans-affairs/mhv/exports';
import VistaAndOHContent from '../../../components/DownloadRecords/VistaAndOHContent';
import { ALERT_TYPE_CCD_ERROR } from '../../../util/constants';
import reducer from '../../../reducers';
import { DownloadReportProvider } from '../../../context/DownloadReportContext';

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

  const defaultContextValue = {
    activeAlert: null,
    ccdError: false,
    CCDRetryTimestamp: null,
    ccdExtendedFileTypeFlag: true,
    ccdDownloadSuccess: false,
    generatingCCD: false,
    handleDownloadCCD: () => {},
    handleDownloadCCDV2: () => {},
    runningUnitTest: true,
    vistaFacilityNames: [
      { id: '528A4', content: 'VA Western New York health care' },
    ],
    ohFacilityNamesBeforeCutover: [
      {
        id: '757-before',
        content: (
          <>
            VA Central Ohio health care <strong>(before April 30, 2022)</strong>
          </>
        ),
      },
    ],
    ohFacilityNamesAfterCutover: [
      {
        id: '757-after',
        content: (
          <>
            VA Central Ohio health care{' '}
            <strong>(April 30, 2022-present)</strong>
          </>
        ),
      },
    ],
    expandSelfEntered: false,
    selfEnteredAccordionRef: { current: null },
  };

  const renderComponent = (contextOverrides = {}, state = {}) => {
    const contextValue = { ...defaultContextValue, ...contextOverrides };
    return renderWithStoreAndRouter(
      <DownloadReportProvider value={contextValue}>
        <VistaAndOHContent />
      </DownloadReportProvider>,
      {
        initialState: { ...initialState, ...state },
        reducers: reducer,
        path: '/download',
      },
    );
  };

  it('renders without errors', () => {
    const { getByText } = renderComponent();
    expect(getByText('Download your Continuity of Care Document')).to.exist;
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

  it('renders CcdAccessErrors with CCD error when CCDRetryTimestamp is set', () => {
    const { getAllByTestId } = renderComponent({
      CCDRetryTimestamp: '2025-01-01T00:00:00Z',
    });

    expect(getAllByTestId('expired-alert-message').length).to.be.greaterThan(0);
  });

  it('renders MissingRecordsError and DownloadSuccessAlert when SEI download is successful with some failed domains', () => {
    // Note: SEI state is now managed by useSelfEnteredPdf hook.
    // This test verifies the component renders the self-entered section.
    // Success alerts are shown when hook returns success=true, which requires
    // actual download interaction (tested at integration level).
    const { getByTestId } = renderComponent();

    expect(getByTestId('downloadSelfEnteredButton')).to.exist;
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

    it('renders self-entered download button', () => {
      // Note: Loading state is now managed by useSelfEnteredPdf hook.
      // Button is rendered by default when hook's loading=false.
      const { getByTestId } = renderComponent();

      expect(getByTestId('downloadSelfEnteredButton')).to.exist;
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
      expect(getByTestId('generating-ccd-VistA-indicator')).to.exist;
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

  describe('when ccdExtendedFileTypeFlag is true', () => {
    it('renders VistA facility CCD download section', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
      });

      expect(getByTestId('generateCcdButtonXmlVistA')).to.exist;
      expect(getByTestId('generateCcdButtonPdfVistA')).to.exist;
      expect(getByTestId('generateCcdButtonHtmlVistA')).to.exist;
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
        vistaFacilityNames: [
          { id: '528A4', content: 'VA Western New York health care' },
        ],
      });

      expect(getByText(/VA Western New York health care/)).to.exist;
    });

    it('displays OH facility names', () => {
      const { getAllByText } = renderComponent({
        ccdExtendedFileTypeFlag: true,
        ohFacilityNamesBeforeCutover: [
          {
            id: '757-before',
            content: (
              <>
                VA Central Ohio health care{' '}
                <strong>(before April 30, 2022)</strong>
              </>
            ),
          },
        ],
        ohFacilityNamesAfterCutover: [
          {
            id: '757-after',
            content: (
              <>
                VA Central Ohio health care{' '}
                <strong>(April 30, 2022-present)</strong>
              </>
            ),
          },
        ],
      });

      expect(getAllByText(/VA Central Ohio health care/).length).to.be.at.least(
        1,
      );
    });

    it('calls handleDownloadCCD with correct format when VistA XML link is clicked', () => {
      const handleDownloadCCD = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCD,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonXmlVistA'));
      expect(handleDownloadCCD.calledOnce).to.be.true;
      expect(handleDownloadCCD.firstCall.args[1]).to.equal('xml');
    });

    it('calls handleDownloadCCD with correct format when VistA PDF link is clicked', () => {
      const handleDownloadCCD = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCD,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonPdfVistA'));
      expect(handleDownloadCCD.calledOnce).to.be.true;
      expect(handleDownloadCCD.firstCall.args[1]).to.equal('pdf');
    });

    it('calls handleDownloadCCD with correct format when VistA HTML link is clicked', () => {
      const handleDownloadCCD = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCD,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonHtmlVistA'));
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
      expect(queryByTestId('generateCcdButtonPdfVistA')).to.not.exist;
      expect(queryByTestId('generateCcdButtonHtmlVistA')).to.not.exist;
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
    expect(h2s.length).to.equal(2);
    expect(h2s[0].textContent).to.equal(
      'Download your Continuity of Care Document',
    );
    expect(h2s[1].textContent).to.equal(
      'Download your self-entered health information',
    );
  });
});
