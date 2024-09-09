import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import BreadCrumbs from '../../../components/BreadCrumbs';

describe('BreadCrumbs component', () => {
  it('renders breadcrumb links based on currentLocation', () => {
    const currentLocation = '/contact-us/ask-va-too/introduction';
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    expect(screen.getByTestId('Breadcrumb')).to.exist;
  });
});
