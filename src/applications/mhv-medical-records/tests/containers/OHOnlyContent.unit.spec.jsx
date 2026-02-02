import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import {
  ALERT_TYPE_SEI_ERROR,
  SEI_DOMAINS,
} from '@department-of-veterans-affairs/mhv/exports';
import OHOnlyContent from '../../containers/ccdContent/OHOnlyContent';
import { ALERT_TYPE_CCD_ERROR } from '../../util/constants';
import reducer from '../../reducers';

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

  const defaultProps = {
    ddSuffix: 'OH',
    generatingCCD: false,
    handleDownload: () => {},
    testIdSuffix: 'OH',
    lastSuccessfulUpdate: null,
    accessErrors: () => null,
    activeAlert: null,
    successfulSeiDownload: false,
    failedSeiDomains: [],
    ccdExtendedFileTypeFlag: true,
    ccdDownloadSuccess: false,
    ccdError: false,
    CCDRetryTimestamp: null,
  };

  const renderComponent = (props = {}, state = {}) => {
    return renderWithStoreAndRouter(
      <OHOnlyContent {...defaultProps} {...props} />,
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
    const { getByTestId, queryByText } = renderComponent({
      generatingCCD: true,
    });

    expect(getByTestId('generating-ccd-OH-indicator')).to.exist;

    expect(queryByText('Download your Continuity of Care Document')).to.not
      .exist;
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

    it('calls handleDownload with correct format when XML link is clicked', () => {
      const handleDownload = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownload,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonXmlOH'));
      expect(handleDownload.calledOnce).to.be.true;
      expect(handleDownload.firstCall.args[1]).to.equal('xml');
    });

    it('calls handleDownload with correct format when PDF link is clicked', () => {
      const handleDownload = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownload,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonPdfOH'));
      expect(handleDownload.calledOnce).to.be.true;
      expect(handleDownload.firstCall.args[1]).to.equal('pdf');
    });

    it('calls handleDownload with correct format when HTML link is clicked', () => {
      const handleDownload = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownload,
        ccdExtendedFileTypeFlag: true,
      });

      fireEvent.click(getByTestId('generateCcdButtonHtmlOH'));
      expect(handleDownload.calledOnce).to.be.true;
      expect(handleDownload.firstCall.args[1]).to.equal('html');
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

    it('uses the correct testIdSuffix in test ids', () => {
      const { getByTestId } = renderComponent({
        testIdSuffix: 'CustomSuffix',
        ccdExtendedFileTypeFlag: true,
      });

      expect(getByTestId('generateCcdButtonXmlCustomSuffix')).to.exist;
      expect(getByTestId('generateCcdButtonPdfCustomSuffix')).to.exist;
      expect(getByTestId('generateCcdButtonHtmlCustomSuffix')).to.exist;
    });

    it('uses the correct ddSuffix in data-dd-action-name attributes', () => {
      const { getByTestId } = renderComponent({
        ddSuffix: 'CustomDD',
        ccdExtendedFileTypeFlag: true,
      });

      const xmlLink = getByTestId('generateCcdButtonXmlOH');
      const pdfLink = getByTestId('generateCcdButtonPdfOH');
      const htmlLink = getByTestId('generateCcdButtonHtmlOH');

      expect(xmlLink.getAttribute('data-dd-action-name')).to.equal(
        'Download CCD XML CustomDD',
      );
      expect(pdfLink.getAttribute('data-dd-action-name')).to.equal(
        'Download CCD PDF CustomDD',
      );
      expect(htmlLink.getAttribute('data-dd-action-name')).to.equal(
        'Download CCD HTML CustomDD',
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

    it('calls handleDownload with xml format when XML link is clicked', () => {
      const handleDownload = sinon.spy();
      const { getByTestId } = renderComponent({
        handleDownload,
        ccdExtendedFileTypeFlag: false,
      });

      fireEvent.click(getByTestId('generateCcdButtonXmlOH'));
      expect(handleDownload.calledOnce).to.be.true;
      expect(handleDownload.firstCall.args[1]).to.equal('xml');
    });
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

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_CCD_ERROR', () => {
    const { getByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_CCD_ERROR },
    });

    expect(getByTestId('expired-alert-message')).to.exist;
  });

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_SEI_ERROR', () => {
    const { getByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_SEI_ERROR },
    });

    expect(getByTestId('expired-alert-message')).to.exist;
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

  it('renders MissingRecordsError and DownloadSuccessAlert when SEI download is successful with some failed domains', () => {
    const { getByTestId, getByText } = renderComponent({
      successfulSeiDownload: true,
      failedSeiDomains: ['allergies', 'medications'],
    });

    expect(getByTestId('alert-download-started')).to.exist;
    expect(getByText(/Self-entered health information report download/)).to
      .exist;
  });

  it('does not render MissingRecordsError when all SEI domains failed', () => {
    const { queryByTestId } = renderComponent({
      successfulSeiDownload: true,
      failedSeiDomains: SEI_DOMAINS,
    });

    expect(queryByTestId('alert-download-started')).to.not.exist;
  });

  it('does not render SEI alerts when successfulSeiDownload is false', () => {
    const { queryByTestId } = renderComponent({
      successfulSeiDownload: false,
      failedSeiDomains: ['allergies'],
    });

    expect(queryByTestId('alert-download-started')).to.not.exist;
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
