import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import BreadCrumbs from '../../components/BreadCrumbs';
import manifest from '../../manifest.json';

describe('BreadCrumbs component', () => {
  it('renders breadcrumb links based on currentLocation', () => {
    const currentLocation = `${manifest.rootUrl}/introduction`;
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    expect(screen.getByTestId('Breadcrumb')).to.exist;
  });
});
