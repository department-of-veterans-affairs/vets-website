import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import {
  ALERT_TYPE_SEI_ERROR,
  SEI_DOMAINS,
} from '@department-of-veterans-affairs/mhv/exports';
import CCDAlertSection from '../../../components/DownloadRecords/CCDAlertSection';
import { ALERT_TYPE_CCD_ERROR } from '../../../util/constants';

describe('CCDAlertSection', () => {
  const defaultProps = {
    activeAlert: null,
    CCDRetryTimestamp: null,
    ccdDownloadSuccess: false,
    ccdError: false,
    failedSeiDomains: [],
    successfulSeiDownload: false,
  };

  it('renders nothing when no conditions are met', () => {
    const { container } = render(<CCDAlertSection {...defaultProps} />);

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('renders CCD error alert when activeAlert type is CCD_ERROR', () => {
    const { getByTestId, getByText } = render(
      <CCDAlertSection
        {...defaultProps}
        activeAlert={{ type: ALERT_TYPE_CCD_ERROR }}
      />,
    );

    expect(getByTestId('expired-alert-message')).to.exist;
    expect(
      getByText(/We can't download your continuity of care document right now/),
    ).to.exist;
  });

  it('renders SEI error alert when activeAlert type is SEI_ERROR', () => {
    const { getByTestId, getByText } = render(
      <CCDAlertSection
        {...defaultProps}
        activeAlert={{ type: ALERT_TYPE_SEI_ERROR }}
      />,
    );

    expect(getByTestId('expired-alert-message')).to.exist;
    expect(
      getByText(/We can't download your self-entered information right now/),
    ).to.exist;
  });

  it('renders CCD download success alert when ccdDownloadSuccess is true and no errors', () => {
    const { getByText } = render(
      <CCDAlertSection
        {...defaultProps}
        ccdDownloadSuccess
        ccdError={false}
        CCDRetryTimestamp={null}
      />,
    );

    expect(getByText(/Continuity of Care Document download/)).to.exist;
  });

  it('does not render CCD success alert when ccdError is true', () => {
    const { queryByText } = render(
      <CCDAlertSection {...defaultProps} ccdDownloadSuccess ccdError />,
    );

    expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
  });

  it('does not render CCD success alert when CCDRetryTimestamp is set', () => {
    const { queryByText } = render(
      <CCDAlertSection
        {...defaultProps}
        ccdDownloadSuccess
        CCDRetryTimestamp="2025-01-01T00:00:00Z"
      />,
    );

    expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
  });

  it('renders SEI success alert with missing records error when successfulSeiDownload is true and some domains failed', () => {
    const { getByTestId } = render(
      <CCDAlertSection
        {...defaultProps}
        successfulSeiDownload
        failedSeiDomains={['allergies', 'medications']}
      />,
    );

    expect(getByTestId('missing-records-error-alert')).to.exist;
    expect(getByTestId('alert-download-started')).to.exist;
  });

  it('does not render SEI success alert when all domains failed', () => {
    const { queryByText } = render(
      <CCDAlertSection
        {...defaultProps}
        successfulSeiDownload
        failedSeiDomains={SEI_DOMAINS}
      />,
    );

    expect(queryByText(/Self-entered health information report download/)).to
      .not.exist;
  });

  it('does not render SEI success alert when successfulSeiDownload is false', () => {
    const { queryByText } = render(
      <CCDAlertSection
        {...defaultProps}
        successfulSeiDownload={false}
        failedSeiDomains={['allergies']}
      />,
    );

    expect(queryByText(/Self-entered health information report download/)).to
      .not.exist;
  });
});
