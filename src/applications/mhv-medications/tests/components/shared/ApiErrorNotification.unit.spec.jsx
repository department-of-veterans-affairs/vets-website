import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ApiErrorNotification from '../../../components/shared/ApiErrorNotification';
import { getErrorTypeFromFormat } from '../../../util/helpers';
import { PRINT_FORMAT, DOWNLOAD_FORMAT } from '../../../util/constants';

describe('ApiErrorNotification', () => {
  const setup = (format = PRINT_FORMAT.PRINT, content = 'medications') => {
    const errorType = getErrorTypeFromFormat(format);
    return render(
      <ApiErrorNotification errorType={errorType} content={content} />,
    );
  };

  it('shows access error alert', () => {
    const screen = setup();
    const alertHeadline = screen.findByText(
      'We can’t access your medications right now',
    );
    expect(alertHeadline).to.exist;
  });

  it('shows print error alert', () => {
    const screen = setup(PRINT_FORMAT.PRINT, 'records');
    const alertHeadline = screen.findByText(
      'We can’t access your medications right now',
    );
    expect(alertHeadline).to.exist;
  });

  it('shows print full list error alert', () => {
    const screen = setup(PRINT_FORMAT.PRINT_FULL_LIST, 'records');
    const alertHeadline = screen.findByText(
      'We can’t print your records right now',
    );
    expect(alertHeadline).to.exist;
  });

  it('shows download pdf error alert', () => {
    const screen = setup(DOWNLOAD_FORMAT.PDF, 'records');
    const alertHeadline = screen.findByText(
      'We can’t download your records right now',
    );
    expect(alertHeadline).to.exist;
  });

  it('shows download txt error alert', () => {
    const screen = setup(DOWNLOAD_FORMAT.TXT, 'records');
    const alertHeadline = screen.findByText(
      'We can’t download your records right now',
    );
    expect(alertHeadline).to.exist;
  });
});
