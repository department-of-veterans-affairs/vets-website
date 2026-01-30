import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { ALERT_TYPE_SEI_ERROR } from '@department-of-veterans-affairs/mhv/exports';
import OHOnlyContent from '../../../components/DownloadRecords/OHOnlyContent';
import { ALERT_TYPE_CCD_ERROR } from '../../../util/constants';
import reducer from '../../../reducers';
import { DownloadReportProvider } from '../../../context/DownloadReportContext';

describe('OHOnlyContent', () => {
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
    generatingCCD: false,
    handleDownloadCCD: () => {},
    handleDownloadCCDV2: () => {},
    activeAlert: null,
    ccdExtendedFileTypeFlag: true,
    ccdDownloadSuccess: false,
    ccdError: false,
    CCDRetryTimestamp: null,
    runningUnitTest: true,
    vistaFacilityNames: [],
    ohFacilityNames: [],
    expandSelfEntered: false,
    selfEnteredAccordionRef: { current: null },
  };

  const renderComponent = (contextOverrides = {}, state = {}) => {
    const contextValue = { ...defaultContextValue, ...contextOverrides };
    return renderWithStoreAndRouter(
      <DownloadReportProvider value={contextValue}>
        <OHOnlyContent />
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

  it('renders the CCD section heading when not loading', () => {
    const { getByText } = renderComponent();

    expect(getByText('Download your Continuity of Care Document')).to.exist;
  });

  it('shows loading spinner when generatingCCD is true', () => {
    const { getByTestId, getByText } = renderComponent({
      generatingCCD: true,
    });

    expect(getByTestId('generating-ccd-OH-indicator')).to.exist;
    // Heading remains visible while loading spinner is shown
    expect(getByText('Download your Continuity of Care Document')).to.exist;
  });

  describe('when ccdExtendedFileTypeFlag is true', () => {
    it('renders all 3 download links when not loading', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
      });

      expect(getByTestId('generateCcdButtonXmlOH')).to.exist;
      expect(getByTestId('generateCcdButtonPdfOH')).to.exist;
      expect(getByTestId('generateCcdButtonHtmlOH')).to.exist;
    });

    it('calls handleDownloadCCDV2 with correct format when XML link is clicked', () => {
      const handleDownloadCCDV2 = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCDV2,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonXmlOH'));
      expect(handleDownloadCCDV2.calledOnce).to.be.true;
      expect(handleDownloadCCDV2.firstCall.args[1]).to.equal('xml');
    });

    it('calls handleDownloadCCDV2 with correct format when PDF link is clicked', () => {
      const handleDownloadCCDV2 = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCDV2,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonPdfOH'));
      expect(handleDownloadCCDV2.calledOnce).to.be.true;
      expect(handleDownloadCCDV2.firstCall.args[1]).to.equal('pdf');
    });

    it('calls handleDownloadCCDV2 with correct format when HTML link is clicked', () => {
      const handleDownloadCCDV2 = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCDV2,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonHtmlOH'));
      expect(handleDownloadCCDV2.calledOnce).to.be.true;
      expect(handleDownloadCCDV2.firstCall.args[1]).to.equal('html');
    });

    it('has correct data attributes for Datadog tracking', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
      });

      const xmlLink = getByTestId('generateCcdButtonXmlOH');
      const pdfLink = getByTestId('generateCcdButtonPdfOH');
      const htmlLink = getByTestId('generateCcdButtonHtmlOH');

      expect(xmlLink.getAttribute('data-dd-action-name')).to.equal(
        'Download CCD XML OH',
      );
      expect(pdfLink.getAttribute('data-dd-action-name')).to.equal(
        'Download CCD PDF OH',
      );
      expect(htmlLink.getAttribute('data-dd-action-name')).to.equal(
        'Download CCD HTML OH',
      );
    });

    it('renders download links with correct text', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
      });

      expect(getByTestId('generateCcdButtonXmlOH')).to.have.attribute(
        'text',
        'Download XML (best for sharing with your provider)',
      );
      expect(getByTestId('generateCcdButtonPdfOH')).to.have.attribute(
        'text',
        'Download PDF (best for printing)',
      );
      expect(getByTestId('generateCcdButtonHtmlOH')).to.have.attribute(
        'text',
        'Download HTML (best for screen readers, enlargers, and refreshable Braille displays)',
      );
    });
  });

  describe('when ccdExtendedFileTypeFlag is false', () => {
    it('renders only XML download link', () => {
      const { getByTestId, queryByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: false,
      });

      expect(getByTestId('generateCcdButtonXmlOH')).to.exist;
      expect(queryByTestId('generateCcdButtonPdfOH')).to.not.exist;
      expect(queryByTestId('generateCcdButtonHtmlOH')).to.not.exist;
    });

    it('renders XML download link with correct text', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: false,
      });

      expect(getByTestId('generateCcdButtonXmlOH')).to.have.attribute(
        'text',
        'Download Continuity of Care Document (XML)',
      );
    });

    it('renders XML format description text', () => {
      const { getByText } = renderComponent({
        ccdExtendedFileTypeFlag: false,
      });

      expect(
        getByText(
          /You can download this report in .xml format, a standard file format/,
        ),
      ).to.exist;
    });

    it('calls handleDownloadCCD with xml format when XML link is clicked', () => {
      const handleDownloadCCD = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownloadCCD,
        ccdExtendedFileTypeFlag: false,
      });

      fireEvent.click(getByTestId('generateCcdButtonXmlOH'));
      expect(handleDownloadCCD.calledOnce).to.be.true;
      expect(handleDownloadCCD.firstCall.args[1]).to.equal('xml');
    });
  });

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_CCD_ERROR', () => {
    const { getByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_CCD_ERROR },
    });

    expect(getByTestId('expired-alert-message')).to.exist;
  });

  it('does not render SEI error alert when activeAlert type is ALERT_TYPE_SEI_ERROR (OH-only users do not have SEI)', () => {
    const { queryByTestId, queryByText } = renderComponent({
      activeAlert: { type: ALERT_TYPE_SEI_ERROR },
    });

    // SEI alerts should NOT be shown for OH-only users
    expect(queryByTestId('expired-alert-message')).to.not.exist;
    expect(queryByText(/self-entered information/)).to.not.exist;
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

  // Note: OHOnlyContent does not handle SEI functionality.
  // SEI alerts are handled by VistaOnlyContent and VistaAndOHContent.
  // The component only renders CCD-related content.

  describe('CCD Download Success Alert', () => {
    it('does not render CCD download success alert when only generatingCCD is true, but shows spinner', () => {
      const { queryByText, getByTestId } = renderComponent({
        generatingCCD: true,
        ccdDownloadSuccess: false,
        ccdError: false,
        CCDRetryTimestamp: null,
      });

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
      expect(getByTestId('generating-ccd-OH-indicator')).to.exist;
    });

    it('renders CCD download success alert when ccdDownloadSuccess is true', () => {
      const { getByText } = renderComponent({
        ccdDownloadSuccess: true,
        ccdError: false,
        CCDRetryTimestamp: null,
      });

      expect(getByText(/Continuity of Care Document download/)).to.exist;
    });

    it('does not render CCD download success alert when ccdError is true', () => {
      const { queryByText } = renderComponent({
        ccdDownloadSuccess: true,
        ccdError: true,
        CCDRetryTimestamp: null,
      });

      // Should not find the CCD success alert (but might find SEI if that's also present)
      const alerts = queryByText(/Continuity of Care Document download/);
      expect(alerts).to.not.exist;
    });

    it('does not render CCD download success alert when CCDRetryTimestamp is set', () => {
      const { queryByText } = renderComponent({
        ccdDownloadSuccess: true,
        ccdError: false,
        CCDRetryTimestamp: '2025-12-16T10:00:00Z',
      });

      const alerts = queryByText(/Continuity of Care Document download/);
      expect(alerts).to.not.exist;
    });

    it('does not render CCD download success alert when ccdDownloadSuccess is false and not generating', () => {
      const { queryByText } = renderComponent({
        ccdDownloadSuccess: false,
        generatingCCD: false,
        ccdError: false,
        CCDRetryTimestamp: null,
      });

      const alerts = queryByText(/Continuity of Care Document download/);
      expect(alerts).to.not.exist;
    });
  });

  it('renders CCD description text correctly', () => {
    const { getByText } = renderComponent();

    expect(
      getByText(
        /This Continuity of Care Document \(CCD\) is a summary of your VA medical records/,
      ),
    ).to.exist;
    expect(
      getByText(/that you can share with non-VA providers in your community/),
    ).to.exist;
  });

  it('renders h2 heading for CCD section', () => {
    const { container } = renderComponent();

    const h2 = container.querySelector('h2');
    expect(h2).to.exist;
    expect(h2.textContent).to.equal(
      'Download your Continuity of Care Document',
    );
  });

  it('does not render h1 heading (heading is in parent component)', () => {
    const { container } = renderComponent();

    const h1 = container.querySelector('h1');
    expect(h1).to.not.exist;
  });
});
