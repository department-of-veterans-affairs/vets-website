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
    expect(getByTestId('get-help-page-link')).to.exist;
  });
  it('renders download instructions and content', () => {
    const { getByTestId } = renderTestApp(<GetHelpPage />);
    expect(getByTestId('download-instructions-heading').textContent).to.eq(
      'Download instructions for submitting VA Form 21-22 online',
    );
    expect(getByTestId('download-instructions-pdf-link')).to.exist;
  });
});
