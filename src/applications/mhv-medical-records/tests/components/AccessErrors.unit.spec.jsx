import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { SEI_DOMAINS } from '@department-of-veterans-affairs/mhv/exports';
import AccessErrors from '../../components/DownloadRecords/AccessErrors';

describe('AccessErrors', () => {
  it('renders nothing when no error conditions are present', () => {
    const { container } = render(<AccessErrors />);

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('renders CCD error alert when CCDRetryTimestamp is set', () => {
    const { getByTestId, getByText } = render(
      <AccessErrors CCDRetryTimestamp="2025-01-01T00:00:00Z" />,
    );

    expect(getByTestId('expired-alert-message')).to.exist;
    expect(
      getByText(/We can't download your continuity of care document right now/),
    ).to.exist;
  });

  it('renders SEI error alert when all SEI domains have failed', () => {
    const { getByTestId, getByText } = render(
      <AccessErrors failedSeiDomains={SEI_DOMAINS} />,
    );

    expect(getByTestId('expired-alert-message')).to.exist;
    expect(
      getByText(/We can't download your self-entered information right now/),
    ).to.exist;
  });

  it('renders SEI error alert when seiPdfGenerationError is true', () => {
    const { getByTestId, getByText } = render(
      <AccessErrors seiPdfGenerationError />,
    );

    expect(getByTestId('expired-alert-message')).to.exist;
    expect(
      getByText(/We can't download your self-entered information right now/),
    ).to.exist;
  });

  it('does not render SEI error when only some domains have failed', () => {
    const { container } = render(
      <AccessErrors failedSeiDomains={['allergies', 'medications']} />,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('prioritizes CCD error over SEI error when both are present', () => {
    const { getByTestId, getByText } = render(
      <AccessErrors
        CCDRetryTimestamp="2025-01-01T00:00:00Z"
        failedSeiDomains={SEI_DOMAINS}
      />,
    );

    expect(getByTestId('expired-alert-message')).to.exist;
    expect(
      getByText(/We can't download your continuity of care document right now/),
    ).to.exist;
  });
});
