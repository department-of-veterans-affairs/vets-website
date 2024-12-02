// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import UnauthContent from '.';

describe('View Test + Lab Results Page <UnauthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<UnauthContent />);

    const text = wrapper.text();
    expect(text).to.include('How can this tool help me manage my health care?');
    expect(text).to.include('Am I eligible to use this tool?');
    expect(text).to.include(
      'Can I view all my VA lab and test information using this tool?',
    );
    expect(text).to.include(
      'Can I view results from community (non-VA) providers or labs?',
    );
    expect(text).to.include('Once I’m signed in, how do I view my results?');
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');

    wrapper.unmount();
  });
});
