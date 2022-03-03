import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { AskVAQuestions } from '../../components/AskVAQuestions';

describe('AskVAQuestions', () => {
  it('should render', () => {
    const wrapper = render(<AskVAQuestions showOmniChannelLink />);
    expect(
      wrapper.container.querySelector('va-telephone')?.getAttribute('contact'),
    ).to.eq('8008271000');
    expect(wrapper.getByText(/Contact us/i)).to.exist;
    expect(wrapper.getByText(/live chat/i)).to.exist;
  });
});
