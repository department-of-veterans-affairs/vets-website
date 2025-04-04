import React from 'react';
import { expect } from 'chai';
import GetHelpPage from '../../../containers/GetHelpPage';
import { renderTestApp } from '../helpers';

describe('Get Help Page', () => {
  it('renders get help heading and content', () => {
    const { getByTestId } = renderTestApp(<GetHelpPage />);
    expect(getByTestId('get-help-page-heading').textContent).to.eq(
      'Get help using the portal',
    );
    expect(getByTestId('get-help-page-content').textContent).to.eq(
      'You can email the portal team for help at RepresentativePortalHelp@va.gov. We monitor the email Monday through Friday from 8am to 4pm ET. Someone from the team will respond to your email within 1-2 business days.',
    );
    expect(getByTestId('get-help-page-link')).to.exist;
  });
  it('renders download instructions and content', () => {
    const { getByTestId } = renderTestApp(<GetHelpPage />);
    expect(getByTestId('download-instructions-heading').textContent).to.eq(
      'Download instructions for submitting VA Form 21-22 online',
    );
    expect(getByTestId('download-instructions-content').textContent).to.eq(
      'You can accept power of attorney (POA) requests in the portal as long as the claimant submits the request using the online . Download detailed, step by step instructions on how to submit the request online.',
    );
    expect(getByTestId('download-instructions-pdf-link')).to.exist;
  });
});
