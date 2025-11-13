import React from 'react';
import { expect } from 'chai';
import GetHelpPage from '../../../containers/GetHelpPage';
import { renderTestApp } from '../helpers';

describe('Get Help Page', () => {
  it('renders get help heading and content', () => {
    const { getByTestId } = renderTestApp(<GetHelpPage />);
    expect(getByTestId('get-help-page-heading').textContent).to.eq(
      'Get help with the Accredited Representative Portal',
    );
  });
});
