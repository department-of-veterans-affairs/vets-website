// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { AuthContent } from '.';

describe('Scheduling Page <AuthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<AuthContent />);

    const text = wrapper.text();
    expect(text).to.include(
      'How can these appointment tools help me manage my care?',
    );
    expect(text).to.include('Am I eligible to use these tools?');
    expect(text).to.include(
      'How do I know if my VA health facility uses online scheduling?',
    );
    expect(text).to.include(
      'Can I use these tools to schedule community (non-VA) appointments?',
    );
    expect(text).to.include(
      'Can I schedule appointments through VA secure messaging?',
    );
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');

    wrapper.unmount();
  });
});
