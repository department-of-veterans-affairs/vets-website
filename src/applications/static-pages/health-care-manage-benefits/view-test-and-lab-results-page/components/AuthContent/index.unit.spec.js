// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import AuthContent from '.';

describe('View Test + Lab Results Page <AuthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<AuthContent />);

    const text = wrapper.text();
    expect(text).to.not.include(
      'How can this tool help me manage my health care?',
    );
    expect(text).to.not.include('Am I eligible to use this tool?');
    expect(text).to.include('Am I eligible to use these tools?');
    expect(text).to.not.include(
      'Can I view all my VA lab and test information using this tool?',
    );
    expect(text).to.include('What if I have more questions?');
    expect(text).to.not.include(
      'Can I view results from non-VA providers or labs?',
    );
    expect(text).to.include('Can I view lab results from non-VA providers?');
    expect(text).to.not.include(
      'Once I’m signed in within My HealtheVet, how do I view my results?',
    );
    expect(text).to.include('Once I’m signed in, how do I view my results?');
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');

    wrapper.unmount();
  });
});
