// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import AuthContent from '.';

describe('Get Medical Records Page <AuthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<AuthContent />);

    const text = wrapper.text();
    expect(text).to.include('CernerCallToAction');
    expect(text).to.include(
      "What's VA Blue Button, and how can it help me manage my health care?",
    );
    expect(text).to.not.include(
      'Am I eligible to use all the features of VA Blue Button?',
    );
    expect(text).to.not.include(
      'Once I’m signed in, how do I get to my medical records?',
    );
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');
    expect(text).to.include(
      'What is the Veterans Health Information Exchange (VHIE), and how can',
    );
    expect(text).to.include('Can I opt out of sharing my information?');
    expect(text).to.include(
      'Can I change my mind if I want to share my information later?',
    );
    expect(text).to.include('What if I have more questions?');

    wrapper.unmount();
  });
});
