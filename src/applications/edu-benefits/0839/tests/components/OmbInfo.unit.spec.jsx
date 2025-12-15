import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import OmbInfo from '../../components/OmbInfo';

describe('<OmbInfo>', () => {
  it('should render OMB info content', () => {
    const { container, getByText } = render(<OmbInfo />);

    expect(getByText('Respondent burden:')).to.exist;
    expect(getByText('OMB Control #:')).to.exist;
    expect(getByText('Expiration date:')).to.exist;

    // Ensure markup container exists
    expect(container.querySelector('.vads-u-margin-bottom--1p5')).to.exist;
  });
});
