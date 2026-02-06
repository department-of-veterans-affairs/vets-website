import React from 'react';
import { expect } from 'chai';
import HelpPage from '../../../containers/HelpPage';
import { renderTestApp } from '../helpers';

describe('Get Help Page', () => {
  it('renders get help heading and content', () => {
    const { getByTestId } = renderTestApp(<HelpPage />);
    expect(getByTestId('get-help-page-heading').textContent).to.eq(
      'Get help with the Accredited Representative Portal',
    );
  });
});
