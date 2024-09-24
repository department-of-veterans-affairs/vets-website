import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import NeedHelpFooter from '../../components/NeedHelpFooter';

describe('NeedHelpFooter Component', () => {
  it('renders without crashing', () => {
    render(<NeedHelpFooter />);
  });

  it('displays the correct text', () => {
    const screen = render(<NeedHelpFooter />);

    const callUs = screen.getByText(/Call us/);
    const operatingHoursText = screen.getByText(
      /Monday through Friday, 8:00 a.m to 9:00 p.m ET/,
    );

    expect(callUs).to.exist;
    expect(operatingHoursText).to.exist;
  });
});
