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

    expect(selector).to.have.attr('exp-date');
    expect(selector).to.have.attr('omb-number');
    expect(selector).to.have.attr('res-burden');
  });
});
