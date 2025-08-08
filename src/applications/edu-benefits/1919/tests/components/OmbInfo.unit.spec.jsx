import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import OmbInfo from '../../components/OmbInfo';

describe('<OmbInfo>', () => {
  it('should render a `va-omb-info` component', () => {
    const { container } = render(<OmbInfo />);
    const selector = container.querySelector('va-omb-info');

    expect(selector).to.exist;
  });

  it('should contain the correct props to populate the web component', () => {
    const { container } = render(<OmbInfo />);
    const selector = container.querySelector('va-omb-info');

    expect(selector).to.have.attr('exp-date', '03/31/2027');
    expect(selector).to.have.attr('omb-number', '2900-0657');
    expect(selector).to.have.attr('res-burden', '10');
  });

  it('should render the PrivacyActStatement component', () => {
    const { container } = render(<OmbInfo />);
    const privacyActStatement = container.querySelector(
      '[data-testid="privacy-act-notice"]',
    );
    expect(privacyActStatement).to.exist;
  });

  it('should render the respondent burden text', () => {
    const { container } = render(<OmbInfo />);
    const respondentBurden = container.querySelector(
      '[data-testid="respondent-burden"]',
    );
    expect(respondentBurden).to.exist;
    expect(respondentBurden.innerHTML).to.contain('Respondent Burden:');
    expect(respondentBurden.innerHTML).to.contain('2900-0657');
    expect(respondentBurden.innerHTML).to.contain('03/31/2027');
  });
});
