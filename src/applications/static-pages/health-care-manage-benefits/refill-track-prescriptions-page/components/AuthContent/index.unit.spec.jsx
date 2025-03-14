// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import AuthContent from '.';

describe('Prescriptions Page <AuthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<AuthContent />);

    const text = wrapper.text();
    expect(text).to.include(
      'How can VA’s prescription tools help me manage my health care?',
    );
    expect(text).to.include('Am I eligible to use this tool?');
    expect(text).to.include("Once I'm signed in, how do I get started?");
    expect(text).to.include(
      'Can I use these tools to refill and track all my VA prescriptions?',
    );
    expect(text).to.include('Where will VA send my prescriptions?');
    expect(text).to.include(
      'When will I get my prescriptions, and when should I reorder?',
    );
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');

    wrapper.unmount();
  });
});
