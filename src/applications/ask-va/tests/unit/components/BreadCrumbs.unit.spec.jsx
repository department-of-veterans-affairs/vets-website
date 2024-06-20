import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import BreadCrumbs from '../../../components/BreadCrumbs';

describe('BreadCrumbs component', () => {
  it('renders breadcrumb links based on currentLocation', () => {
    const currentLocation = '/contact-us/ask-va-too/introduction';
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    expect(screen.getByText('Home')).to.exists;
    expect(screen.getByText('New Inquiry')).to.exists;
  });

  it('does not render breadcrumb links if currentLocation does not match', () => {
    const currentLocation = '/unknown-location';
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    expect(screen.queryByText('/unknown-location')).to.not.exist;
  });
});
