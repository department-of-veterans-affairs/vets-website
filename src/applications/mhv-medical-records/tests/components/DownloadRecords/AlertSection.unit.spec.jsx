import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import {
  ALERT_TYPE_SEI_ERROR,
  SEI_DOMAINS,
} from '@department-of-veterans-affairs/mhv/exports';
import AlertSection from '../../../components/DownloadRecords/AlertSection';
import { ALERT_TYPE_CCD_ERROR } from '../../../util/constants';
import { DownloadReportProvider } from '../../../context/DownloadReportContext';

describe('AlertSection', () => {
  const defaultContextValue = {
    activeAlert: null,
    generatingCCD: false,
    ccdDownloadSuccess: false,
    ccdError: false,
    CCDRetryTimestamp: null,
  };

  const renderWithContext = (contextOverrides = {}, props = {}) => {
    const contextValue = { ...defaultContextValue, ...contextOverrides };
    return render(
      <DownloadReportProvider value={contextValue}>
        <AlertSection {...props} />
      </DownloadReportProvider>,
    );
  };

  describe('CCD alerts', () => {
    it('renders nothing when no conditions are met', () => {
      const { container } = renderWithContext();
      expect(container.querySelector('va-alert')).to.not.exist;
    });

    it('renders CCD retry error when CCDRetryTimestamp is set', () => {
      const { getByTestId, getByText } = renderWithContext({
        CCDRetryTimestamp: '2025-01-01T00:00:00Z',
      });

      expect(getByTestId('expired-alert-message')).to.exist;
      expect(
        getByText(
          /We can't download your continuity of care document right now/,
        ),
      ).to.exist;
    });

    it('renders CCD error alert when activeAlert type is CCD_ERROR', () => {
      const { getByTestId, getByText } = renderWithContext({
        activeAlert: { type: ALERT_TYPE_CCD_ERROR },
      });

      expect(getByTestId('expired-alert-message')).to.exist;
      expect(
        getByText(
          /We can't download your continuity of care document right now/,
        ),
      ).to.exist;
    });

    it('renders CCD download success alert when ccdDownloadSuccess is true and no errors', () => {
      const { getByText } = renderWithContext({
        ccdDownloadSuccess: true,
        ccdError: false,
      });

      expect(getByText(/Continuity of Care Document download/)).to.exist;
    });

    it('does not render CCD success alert when ccdError is true', () => {
      const { queryByText } = renderWithContext({
        ccdDownloadSuccess: true,
        ccdError: true,
      });

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
    });

    it('does not render CCD alerts when showCcdAlerts is false', () => {
      const { container } = renderWithContext(
        {
          ccdDownloadSuccess: true,
          activeAlert: { type: ALERT_TYPE_CCD_ERROR },
        },
        { showCcdAlerts: false },
      );

      expect(container.querySelector('va-alert')).to.not.exist;
    });

    it('prioritizes CCD retry error over other CCD alerts', () => {
      const { getAllByTestId, queryByText } = renderWithContext({
        CCDRetryTimestamp: '2025-01-01T00:00:00Z',
        ccdDownloadSuccess: true,
        activeAlert: { type: ALERT_TYPE_CCD_ERROR },
      });

      // Should show retry error (and Redux error can also show), but not success
      const expiredAlerts = getAllByTestId('expired-alert-message');
      expect(expiredAlerts.length).to.be.at.least(1);
      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
    });
  });

  describe('SEI alerts', () => {
    it('renders SEI error alert when all SEI domains have failed', () => {
      const { getByTestId, getByText } = renderWithContext(
        {},
        { failedSeiDomains: SEI_DOMAINS },
      );

      expect(getByTestId('expired-alert-message')).to.exist;
      expect(
        getByText(/We can't download your self-entered information right now/),
      ).to.exist;
    });

    it('renders SEI error alert when seiPdfGenerationError is true', () => {
      const { getByTestId, getByText } = renderWithContext(
        {},
        { seiPdfGenerationError: true },
      );

      expect(getByTestId('expired-alert-message')).to.exist;
      expect(
        getByText(/We can't download your self-entered information right now/),
      ).to.exist;
    });

    it('does not render SEI error when only some domains have failed', () => {
      const { container } = renderWithContext(
        {},
        { failedSeiDomains: ['allergies', 'medications'] },
      );

      expect(container.querySelector('va-alert')).to.not.exist;
    });

    it('renders SEI error alert when activeAlert type is SEI_ERROR', () => {
      const { getByTestId, getByText } = renderWithContext({
        activeAlert: { type: ALERT_TYPE_SEI_ERROR },
      });

      expect(getByTestId('expired-alert-message')).to.exist;
      expect(
        getByText(/We can't download your self-entered information right now/),
      ).to.exist;
    });

    it('renders SEI success alert with missing records error when partial success', () => {
      const { getByTestId } = renderWithContext(
        {},
        {
          successfulSeiDownload: true,
          failedSeiDomains: ['allergies', 'medications'],
        },
      );

      expect(getByTestId('missing-records-error-alert')).to.exist;
      expect(getByTestId('alert-download-started')).to.exist;
    });

    it('renders SEI success alert without missing records error when complete success', () => {
      const { getByTestId, queryByTestId } = renderWithContext(
        {},
        {
          successfulSeiDownload: true,
          failedSeiDomains: [],
        },
      );

      // Should show success alert but not missing records error
      expect(getByTestId('alert-download-started')).to.exist;
      expect(queryByTestId('missing-records-error-alert')).to.not.exist;
    });

    it('does not render SEI success alert when all domains failed', () => {
      const { queryByText } = renderWithContext(
        {},
        {
          successfulSeiDownload: true,
          failedSeiDomains: SEI_DOMAINS,
        },
      );

      // Should show access error, not success
      expect(queryByText(/Self-entered health information report download/)).to
        .not.exist;
    });

    it('does not render SEI alerts when showSeiAlerts is false', () => {
      const { container, queryByTestId } = renderWithContext(
        { activeAlert: { type: ALERT_TYPE_SEI_ERROR } },
        {
          showSeiAlerts: false,
          failedSeiDomains: SEI_DOMAINS,
          successfulSeiDownload: true,
        },
      );

      // Should not show SEI access error
      expect(queryByTestId('missing-records-error-alert')).to.not.exist;
      expect(queryByTestId('alert-download-started')).to.not.exist;
      // SEI_ERROR alert should also be hidden
      expect(container.querySelectorAll('va-alert').length).to.equal(0);
    });
  });

  describe('combined scenarios', () => {
    it('CCD retry error takes priority over SEI access error (only one shows)', () => {
      const { getAllByTestId, getByText, queryByText } = renderWithContext(
        { CCDRetryTimestamp: '2025-01-01T00:00:00Z' },
        { failedSeiDomains: SEI_DOMAINS },
      );

      // Original behavior: CCD retry error takes priority, SEI access error does not show
      expect(getAllByTestId('expired-alert-message').length).to.equal(1);
      expect(
        getByText(
          /We can't download your continuity of care document right now/,
        ),
      ).to.exist;
      expect(
        queryByText(
          /We can't download your self-entered information right now/,
        ),
      ).to.not.exist;
    });

    it('shows CCD retry error and SEI redux error together', () => {
      const { getAllByTestId, getByText } = renderWithContext(
        {
          CCDRetryTimestamp: '2025-01-01T00:00:00Z',
          activeAlert: { type: ALERT_TYPE_SEI_ERROR },
        },
        {},
      );

      // Should show both CCD retry error and SEI redux error
      expect(getAllByTestId('expired-alert-message').length).to.equal(2);
      expect(
        getByText(
          /We can't download your continuity of care document right now/,
        ),
      ).to.exist;
      expect(
        getByText(/We can't download your self-entered information right now/),
      ).to.exist;
    });

    it('shows both CCD success and SEI partial success when both succeed', () => {
      const { getByText, getByTestId } = renderWithContext(
        { ccdDownloadSuccess: true },
        {
          successfulSeiDownload: true,
          failedSeiDomains: ['allergies'],
        },
      );

      expect(getByText(/Continuity of Care Document download/)).to.exist;
      expect(getByTestId('missing-records-error-alert')).to.exist;
    });

    it('can show only CCD alerts when showSeiAlerts is false', () => {
      const { getByText, queryByTestId } = renderWithContext(
        { ccdDownloadSuccess: true },
        {
          showSeiAlerts: false,
          successfulSeiDownload: true,
          failedSeiDomains: ['allergies'],
        },
      );

      expect(getByText(/Continuity of Care Document download/)).to.exist;
      expect(queryByTestId('missing-records-error-alert')).to.not.exist;
    });

    it('can show only SEI alerts when showCcdAlerts is false', () => {
      const { queryByText, getByTestId } = renderWithContext(
        { ccdDownloadSuccess: true },
        {
          showCcdAlerts: false,
          successfulSeiDownload: true,
          failedSeiDomains: ['allergies'],
        },
      );

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
      expect(getByTestId('missing-records-error-alert')).to.exist;
    });
  });
});
