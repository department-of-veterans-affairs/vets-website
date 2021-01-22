import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import NeedHelp from '../../components/NeedHelp';

describe('VAOS <NeedHelp>', () => {
  it('should show contact information and feedback link', () => {
    const screen = render(<NeedHelp />);

    expect(screen.getByRole('heading', { level: 2, name: /need help/i })).to
      .exist;

    expect(screen.getByText(/877-470-5947/i)).to.have.attribute('href');
    expect(screen.getByText(/866-651-3180/i)).to.have.attribute('href');
    expect(
      screen.getByRole('link', { name: /find your health facility/i }),
    ).to.have.attribute('href', '/find-locations');
    expect(
      screen.getByRole('link', { name: /leave feedback/i }),
    ).to.have.attribute(
      'href',
      'https://veteran.apps.va.gov/feedback-web/v1/?appId=85870ADC-CC55-405E-9AC3-976A92BBBBEE',
    );
    expect(screen.getByText(/We’re here 24\/7/i)).to.exist;
  });
});
