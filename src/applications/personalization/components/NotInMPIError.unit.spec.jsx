import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import NotInMPI from './NotInMPIError';

describe('NotInMPI', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = render(<NotInMPI />);
  });

  it('should render the correct text', () => {
    expect(
      wrapper.findByText(
        'We can’t match your information with our Veteran records',
      ),
    ).to.exist;
    expect(
      wrapper.findByText(
        'You may not be able to use some tools and features right now. But we’re working to connect with your records. Try again soon.',
      ),
    ).to.exist;
    wrapper.unmount();
  });
});
