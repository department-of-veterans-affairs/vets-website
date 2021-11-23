import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { AskVAQuestions } from '../../components/AskVAQuestions';

describe('AskVAQuestions', () => {
  it('should render', () => {
    const wrapper = render(<AskVAQuestions showOmniChannelLink />);

    expect(wrapper.getByText(/800-827-1000/)).to.exist;
    expect(wrapper.getByText(/Contact us/i)).to.exist;
    expect(wrapper.getByText(/live chat/i)).to.exist;
  });
});
