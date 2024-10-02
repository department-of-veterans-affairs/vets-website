import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import NeedHelpFooterEducation from '../../components/NeedHelpFooterEducation';

describe('NeedHelpFooterEducation Component', () => {
  it('renders without crashing', () => {
    render(<NeedHelpFooterEducation />);
  });

  it('displays the correct text', () => {
    const screen = render(<NeedHelpFooterEducation />);

    const operatingHoursText = screen.getByText(
      /Monday through Friday, 8:00 a.m to 7:00 p.m ET/,
    );
    const internationalStudentsText = screen.getByText(
      /For students outside the U.S., call us at/,
    );

    expect(operatingHoursText).to.exist;
    expect(internationalStudentsText).to.exist;
  });
});
