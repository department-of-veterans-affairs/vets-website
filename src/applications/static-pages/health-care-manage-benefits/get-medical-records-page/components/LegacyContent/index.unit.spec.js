// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import LegacyContent from '.';

describe('Get Medical Records Page <LegacyContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<LegacyContent />);

    const text = wrapper.text();
    expect(text).to.include('VA Blue Button');
    expect(text).to.include('More about VA Blue Button');
    expect(text).to.include(
      "What's VA Blue Button, and how can it help me manage my health care?",
    );
    expect(text).to.include(
      'Am I eligible to use all the features of VA Blue Button?',
    );
    expect(text).to.include(
      'Once I’m signed in, how do I get to my medical records?',
    );
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');
    expect(text).to.include(
      "What's the Veterans Health Information Exchange (VHIE), and how can it",
    );
    expect(text).to.include('VHIE sharing options');
    expect(text).to.include('How do I opt out?');
    expect(text).to.include('If I opt out, how can I opt back in?');
    expect(text).to.include('Can I check my sharing preference status?');

    wrapper.unmount();
  });
});
